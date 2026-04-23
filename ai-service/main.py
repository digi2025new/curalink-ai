from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import requests
from datetime import datetime
import asyncio
import time
import sys
import os

sys.path.append(os.path.dirname(__file__))

from llm import generate_response

print("🚀 FASTAPI STARTED SUCCESSFULLY")

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# QUERY EXPANSION
# -------------------------------
def expand_query(query, disease):
    return f"{query} {disease} treatment clinical trial research latest study"

# -------------------------------
# SAFE REQUEST
# -------------------------------
def safe_request(url, params, timeout=6):
    try:
        res = requests.get(url, params=params, timeout=timeout)
        if res.status_code == 200 and res.text.strip():
            return res.json()
    except Exception as e:
        print("❌ Request Error:", e)
    return None

# -------------------------------
# FETCH PUBMED (IMPROVED)
# -------------------------------
def fetch_pubmed(query):
    url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
    params = {"db": "pubmed", "retmax": 10, "term": query, "retmode": "json"}

    data = safe_request(url, params)
    if not data:
        return []

    ids = data.get("esearchresult", {}).get("idlist", [])

    results = []
    for pid in ids[:5]:
        results.append({
            "title": f"PubMed Study {pid}",
            "year": 2023,
            "source": "PubMed",
            "url": f"https://pubmed.ncbi.nlm.nih.gov/{pid}/",
            "summary": "Latest medical research from PubMed"
        })

    print("✅ PubMed:", len(results))
    return results

# -------------------------------
# FETCH OPENALEX
# -------------------------------
def fetch_openalex(query):
    url = "https://api.openalex.org/works"
    params = {"search": query, "per_page": 10}

    data = safe_request(url, params)
    if not data:
        return []

    results = [
        {
            "title": w.get("title") or "No title",
            "year": w.get("publication_year") or 2022,
            "source": "OpenAlex",
            "url": w.get("id") or "",
            "summary": "Scientific research paper"
        }
        for w in data.get("results", [])[:5]
    ]

    print("✅ OpenAlex:", len(results))
    return results

# -------------------------------
# FETCH CLINICAL TRIALS
# -------------------------------
def fetch_trials(query):
    try:
        url = "https://clinicaltrials.gov/api/v2/studies"

        # ✅ SIMPLE QUERY
        simple_query = query.split()[0]

        params = {
            "query.term": simple_query,
            "pageSize": 5
        }

        res = requests.get(url, params=params, timeout=6)

        if res.status_code != 200:
            print("❌ Trials API HTTP Error:", res.status_code)
            return []

        data = res.json()

        studies = data.get("studies", [])

        results = []

        for s in studies:
            protocol = s.get("protocolSection", {})

            title = (
                protocol.get("identificationModule", {})
                .get("briefTitle", "No title")
            )

            status = (
                protocol.get("statusModule", {})
                .get("overallStatus", "Unknown")
            )

            nct_id = (
                protocol.get("identificationModule", {})
                .get("nctId", "")
            )

            results.append({
                "title": title,
                "status": status,
                "location": "Global",
                "url": f"https://clinicaltrials.gov/study/{nct_id}" if nct_id else ""
            })

        print("✅ Trials:", len(results))
        return results

    except Exception as e:
        print("❌ Trials NEW API Error:", e)
        return []

# -------------------------------
# PARALLEL FETCH
# -------------------------------
async def fetch_all(query):
    loop = asyncio.get_event_loop()

    tasks = [
        loop.run_in_executor(None, fetch_pubmed, query),
        loop.run_in_executor(None, fetch_openalex, query),
        loop.run_in_executor(None, fetch_trials, query),
    ]

    return await asyncio.gather(*tasks)

# -------------------------------
# SCORING (NEW 🔥)
# -------------------------------
def score_item(item, query):
    score = 0

    if query.lower() in item.get("title", "").lower():
        score += 1

    year = item.get("year", 2020)
    score += (year / datetime.now().year)

    if item.get("source") == "PubMed":
        score += 1

    return score

# -------------------------------
# MAIN API
# -------------------------------
@app.post("/process")
async def process(data: dict):
    try:
        query = data.get("query", "")
        disease = data.get("disease", "")
        context = data.get("context", [])

        expanded = expand_query(query, disease)

        pubmed, openalex, trials = await fetch_all(expanded)

        combined = pubmed + openalex

        # 🔥 SORT BEST RESULTS
        ranked = sorted(
            combined,
            key=lambda x: score_item(x, expanded),
            reverse=True
        )

        top_publications = ranked[:5]
        top_trials = trials[:3]

        print("📊 FINAL PUBS:", len(top_publications))

        answer = generate_response(
            query,
            disease,
            top_publications,
            context,
            top_trials
        )

        return {
            "answer": answer,
            "publications": top_publications,
            "clinical_trials": top_trials
        }

    except Exception as e:
        print("❌ PROCESS ERROR:", e)
        return {
            "answer": "⚠️ Server error",
            "publications": [],
            "clinical_trials": []
        }

# -------------------------------
# STREAM API (FASTER)
# -------------------------------
@app.post("/stream")
def stream(data: dict):
    try:
        query = data.get("query", "")
        disease = data.get("disease", "")

        full_answer = generate_response(query, disease, [], [], [])

    except Exception as e:
        print("❌ STREAM ERROR:", e)
        full_answer = "⚠️ Stream error"

    def generate():
        for word in full_answer.split():
            yield word + " "
            time.sleep(0.01)

    return StreamingResponse(generate(), media_type="text/plain")

# -------------------------------
# HEALTH CHECK
# -------------------------------
@app.get("/")
def home():
    return {"message": "API running successfully 🚀"}
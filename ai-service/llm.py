import ollama

def generate_response(query, disease, publications, context, trials):
    try:
        prompt = f"""
You are a medical assistant.

Disease: {disease}
Question: {query}

Give a short, structured answer:
- Overview
- Key insights
- Recommendation
"""

        # ⚡ Use smallest model
        res = ollama.chat(
            model="tinyllama",   # ✅ VERY LIGHT MODEL
            messages=[{"role": "user", "content": prompt}]
        )

        return res["message"]["content"]

    except Exception as e:
        print("LLM Error:", e)

        # ✅ FALLBACK (ALWAYS WORKS)
        papers = "\n".join([
            f"- {p.get('title', 'Unknown study')}"
            for p in publications[:3]
        ])

        return f"""
🧠 AI Summary (Fallback Mode)

Condition: {disease}

Key Research:
{papers}

Insights:
- Research suggests evolving treatments
- Clinical trials are ongoing

👉 Consult a healthcare professional for proper guidance.
"""




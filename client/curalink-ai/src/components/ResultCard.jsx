import { useState } from "react";

function ResultCard({ data }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!data) return null;

  const copyLink = (url, i) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="mt-6 space-y-8">

      {/* PAPERS */}
      <div>
        <h2 className="text-lg font-bold mb-3 text-gray-800">
          📚 Research Papers
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {data.publications?.map((p, i) => (
            <div key={i} className="p-4 bg-white rounded-xl shadow hover:shadow-md">

              <h3 className="font-semibold text-[#4E8F80]">{p.title}</h3>

              <div className="text-xs mt-1 text-gray-500">
                {p.source} • {p.year}
              </div>

              <p className="text-sm mt-2 text-gray-600">
                {p.summary}
              </p>

              {p.url && (
                <div className="mt-3 flex gap-3 text-sm">
                  <a href={p.url} target="_blank" className="text-[#7CB5A6]">
                    🔗 Open
                  </a>

                  <button onClick={() => copyLink(p.url, i)}>
                    {copiedIndex === i ? "✅ Copied" : "📋 Copy"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* TRIALS */}
          {/* ========================== */}
{/* 🧪 CLINICAL TRIALS */}
{/* ========================== */}
<div>
  <h2 className="text-xl font-bold mb-4 text-gray-800">
    🧪 Clinical Trials
  </h2>

  {data.clinical_trials?.length === 0 ? (
    <p className="text-gray-400">No trials found</p>
  ) : (
    <div className="grid gap-4 md:grid-cols-2">

      {data.clinical_trials.map((trial, i) => {

        // ✅ STATUS COLOR LOGIC
        const getStatusStyle = (status) => {
          const s = status?.toLowerCase();

          if (s?.includes("recruiting")) {
            return "bg-green-100 text-green-700";
          }
          if (s?.includes("completed")) {
            return "bg-blue-100 text-blue-700";
          }
          if (s?.includes("terminated")) {
            return "bg-red-100 text-red-700";
          }
          if (s?.includes("active")) {
            return "bg-purple-100 text-purple-700";
          }
          return "bg-gray-100 text-gray-600";
        };

        return (
          <div
            key={i}
            className="
              p-5 rounded-2xl border
              bg-white/80 backdrop-blur
              shadow-sm hover:shadow-md
              transition
            "
          >
            {/* Title */}
            <h3 className="font-semibold text-gray-800">
              {trial.title}
            </h3>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-3 text-xs">

              {/* ✅ STATUS BADGE */}
              <span
                className={`px-3 py-1 rounded-full font-medium ${getStatusStyle(trial.status)}`}
              >
                {trial.status}
              </span>

              {/* LOCATION */}
              {trial.location && (
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                  📍 {trial.location}
                </span>
              )}
            </div>

            {/* ACTION */}
            {trial.url && (
              <a
                href={trial.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sm font-medium text-[#7CB5A6] hover:underline"
              >
                🔗 View Trial
              </a>
            )}
          </div>
        );
      })}

    </div>
  )}
</div>

    </div>
  );
}

export default ResultCard;
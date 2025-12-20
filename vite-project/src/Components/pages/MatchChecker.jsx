import React, { useEffect, useState } from "react";
import { Heart, Star } from "lucide-react";

export default function MatchChecker({ onPageChange }) {
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loggedUser?.id) {
      console.warn("No logged user found");
      setLoading(false);
      return;
    }

    const fetchMatches = async () => {
      try {
        console.log("📤 Fetching matches for user:", loggedUser.id);

        const res = await fetch("http://localhost:5000/ai-match-many", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: loggedUser.id }),
        });

        const data = await res.json();

        console.log("📥 Raw matches:", data);

        // ✅ FILTER: ONLY > 50%
       setMatches(Array.isArray(data) ? data : []);

        console.log("✅ Filtered matches (>50):", filtered);

        setMatches(filtered);
      } catch (err) {
        console.error("AI Match Error:", err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-yellow-700">
        🤖 Gemini AI is analyzing skill compatibility...
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#FFF9E6] p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-yellow-700 flex items-center justify-center gap-3">
            <Heart className="text-red-400 drop-shadow" />
            AI Skill Matches
          </h2>
          <p className="text-gray-600 mt-2">
            Showing matches above 50% compatibility
          </p>
        </div>

        {/* MATCH LIST */}
        {matches.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {matches.map((match) => {
              const level =
                match.score >= 80
                  ? "Excellent Match"
                  : match.score >= 65
                  ? "Strong Match"
                  : "Good Match";

              return (
                <div
                  key={match.userId}
                  className="bg-gradient-to-br from-yellow-50 to-white
                             border border-yellow-300 rounded-3xl
                             shadow-lg hover:shadow-2xl hover:-translate-y-1
                             transition-all p-6"
                >
                  {/* USER HEADER */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        User #{match.userId}
                      </h3>
                      <span className="inline-block mt-1 px-4 py-1 text-sm rounded-full font-medium bg-yellow-100 text-yellow-700">
                        {level}
                      </span>
                    </div>

                    <div className="text-4xl font-extrabold text-yellow-600">
                      {match.score}%
                    </div>
                  </div>

                  {/* SCORE BAR */}
                  <div className="mb-4">
                    <Star className="text-yellow-500 mb-2" size={32} />
                    <div className="w-full bg-yellow-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-3 bg-yellow-500 rounded-full transition-all duration-700"
                        style={{ width: `${match.score}%` }}
                      />
                    </div>
                  </div>

                  {/* REASON */}
                  <p className="text-sm text-gray-600 mb-6">
                    {match.reason}
                  </p>

                  {/* CTA */}
                  <button
                    onClick={() => onPageChange("schedule")}
                    className="w-full bg-yellow-500 hover:bg-yellow-600
                               text-white py-3 rounded-full
                               font-semibold shadow-md hover:shadow-lg
                               transition-all"
                  >
                    Schedule Collaboration
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-10 bg-red-50 rounded-2xl shadow">
            <p className="text-3xl font-semibold text-red-600">
              No Strong Matches Found
            </p>
            <p className="text-gray-600 mt-2">
              Try updating your skills to improve matching accuracy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

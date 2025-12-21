import React, { useEffect, useState } from "react";
import { Heart, Flame } from "lucide-react";

export default function MatchChecker({ onPageChange }) {
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loggedUser?.id) {
      setLoading(false);
      return;
    }

    const fetchMatches = async () => {
      try {
        const res = await fetch("http://localhost:5000/ai-match-many", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: loggedUser.id }),
        });

        const data = await res.json();
        setMatches(Array.isArray(data) ? data : []);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-yellow-700">
        💛 Finding your best matches...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF4CC] to-[#FFE08A] flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {matches.length > 0 ? (
          matches.map((match) => (
            <div
              key={match.userId}
              className="bg-white rounded-3xl shadow-2xl p-8 text-center
                         transform hover:scale-[1.02] transition-all"
            >
              {/* MATCH ICON */}
              <div className="flex justify-center mb-4">
                <div className="bg-yellow-100 p-4 rounded-full">
                  <Heart className="text-red-500" size={36} />
                </div>
              </div>

              {/* MATCH PERCENT */}
              <h2 className="text-5xl font-extrabold text-yellow-600 mb-2">
                {match.score}%
              </h2>

              <p className="text-lg font-semibold text-gray-800 mb-1">
                Match Compatibility
              </p>

              {/* TAG */}
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full
                              bg-yellow-100 text-yellow-700 font-semibold text-sm mb-4">
                <Flame size={16} />
                {match.score >= 80
                  ? "Excellent Match"
                  : match.score >= 60
                  ? "Strong Match"
                  : "Potential Match"}
              </div>

              {/* REASON */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {match.reason}
              </p>

              {/* CTA */}
              <button
                onClick={() => onPageChange("schedule")}
                className="w-full bg-yellow-500 hover:bg-yellow-600
                           text-white py-3 rounded-full
                           font-bold shadow-lg transition"
              >
                💬 Connect Now
              </button>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            <p className="text-2xl font-bold text-gray-800">
              No Matches Yet 💔
            </p>
            <p className="text-gray-600 mt-3">
              Update your skills to find better collaborations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

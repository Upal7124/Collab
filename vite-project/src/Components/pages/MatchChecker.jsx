import React, { useEffect, useState } from "react";
import { Heart, Star, ArrowLeftRight, User } from "lucide-react";

export default function MatchChecker({ onPageChange }) {

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("http://localhost:5000/ai-match-many", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: loggedUser.id
          })
        });

        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error("AI Match Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [loggedUser.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-yellow-700">
        🤖 Gemini AI is analyzing skill compatibility...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9E6] flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-5xl p-10 border border-yellow-300 animate-fadeIn">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-yellow-700 flex items-center justify-center gap-3">
            <Heart className="text-red-400 drop-shadow" />
            AI Skill Matches
          </h2>
          <p className="text-gray-600 mt-2">
            Real users matched using Gemini AI
          </p>
        </div>

        {/* MATCH LIST */}
        {matches.length > 0 ? (
          <div className="space-y-8">
            {matches.map((match) => (
              <div
                key={match.userId}
                className="bg-[#FFF5C8] rounded-3xl p-6 shadow-xl border border-yellow-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-200 p-3 rounded-full shadow">
                    <User className="text-yellow-700" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-yellow-800">
                    User ID: {match.userId}
                  </h3>
                </div>

                {/* SCORE */}
                <div className="bg-yellow-50 p-6 rounded-2xl border shadow text-center mb-4">
                  <Star className="text-yellow-600 mx-auto" size={36} />
                  <p className="text-5xl font-extrabold text-yellow-700 mt-2">
                    {match.score}%
                  </p>
                  <p className="text-gray-700 mt-1 text-sm">
                    {match.reason}
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => onPageChange("schedule")}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-2xl font-semibold transition"
                >
                  Schedule Collaboration
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-red-50 rounded-xl shadow">
            <p className="text-3xl font-semibold text-red-600">No Matches Found</p>
            <p className="text-gray-600 mt-2">
              Gemini AI could not find suitable skill matches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

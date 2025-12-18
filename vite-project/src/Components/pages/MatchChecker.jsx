import React from "react";
import { matchProfiles } from "../../utils/matchProfiles";
import { Heart, Star, ArrowLeftRight, User } from "lucide-react";

export default function MatchChecker({ onPageChange }) {
  const userA = {
    name: "Upal Ghosh",
    learn: ["C++", "JavaScript"],
    teach: ["Python", "Mongodb"],
  };

  const userB = {
    name: "Ankit Kumar Chaudhary",
    learn: ["Python"],
    teach: ["Java", "C++"],
  };

  const result = matchProfiles(userA, userB);

  return (
    <div className="min-h-screen bg-[#FFF9E6] flex items-center justify-center p-6">

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-5xl p-10 border border-yellow-300 animate-fadeIn">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-yellow-700 flex items-center justify-center gap-3">
            <Heart className="text-red-400 drop-shadow" /> Skill Match Result
          </h2>
          <p className="text-gray-600 mt-2">
            Smart AI-based skill-exchange compatibility analysis
          </p>
        </div>

        {/* USER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

          {/* CARD COMPONENT */}
          {[userA, userB].map((user, idx) => (
            <div
              key={idx}
              className="bg-[#FFF5C8] rounded-3xl p-6 shadow-xl border border-yellow-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-yellow-200 p-3 rounded-full shadow">
                  <User className="text-yellow-700" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-yellow-800">
                  {user.name}
                </h3>
              </div>

              {/* Wants to Learn */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-yellow-700">Wants to Learn:</p>
                <div className="flex flex-wrap mt-2 gap-2">
                  {user.learn.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-white rounded-full shadow-sm text-yellow-900 border border-yellow-300 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Can Teach */}
              <div>
                <p className="text-sm font-semibold text-yellow-700">Can Teach:</p>
                <div className="flex flex-wrap mt-2 gap-2">
                  {user.teach.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-white rounded-full shadow-sm text-yellow-900 border border-yellow-300 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MATCH RESULT */}
        {result.matchFound ? (
          <>
            {/* SCORE CARD */}
            <div className="bg-yellow-50 p-8 rounded-3xl border border-yellow-200 shadow-xl text-center mb-10">
              <Star className="text-yellow-600 mx-auto" size={44} />
              <p className="text-6xl font-extrabold text-yellow-700 mt-2 drop-shadow">
                {result.matchScore}%
              </p>
              <p className="text-gray-600 mt-1 text-sm">Overall Skill Match Score</p>
            </div>

            {/* EXCHANGE DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-yellow-100 p-6 rounded-2xl border border-green-300 shadow">
                <h3 className="text-yellow-800 font-semibold flex items-center gap-2">
                  <ArrowLeftRight size={20} /> User A can learn from User B
                </h3>
                <p className="mt-2 text-gray-700 font-medium">
                  {result.A_can_learn_from_B.join(", ")}
                </p>
              </div>

              <div className="bg-yellow-100 p-6 rounded-2xl border border-blue-300 shadow">
                <h3 className="text-yellow-800 font-semibold flex items-center gap-2">
                  <ArrowLeftRight size={20} /> User B can learn from User A
                </h3>
                <p className="mt-2 text-gray-700 font-medium">
                  {result.B_can_learn_from_A.join(", ")}
                </p>
              </div>
            </div>

            {/* CTA BUTTON */}
            <button
              onClick={() => onPageChange("schedule")}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300"
            >
              Schedule a Collaboration Session
            </button>
          </>
        ) : (
          <div className="text-center p-8 bg-red-50 border border-red-200 rounded-xl shadow-xl">
            <p className="text-3xl font-semibold text-red-600">No Match Found</p>
            <p className="text-gray-600 mt-2">
              These users currently have no compatible skill exchange paths.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

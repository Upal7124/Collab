import React, { useEffect, useState } from "react";
import { Heart, X } from "lucide-react";

export default function MatchChecker({ onPageChange }) {
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const selectedUser = JSON.parse(
    localStorage.getItem("selectedMatchUser")
  );

  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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

        let data = await res.json();
        data = Array.isArray(data) ? data : [];

        // ✅ Fix injected selected user
        if (selectedUser) {
          data.unshift({
  userId: selectedUser.id, // 🔥 VERY IMPORTANT
  name: selectedUser.fullName || "Selected User",
  score: 75,
  reason: "Selected from Skill Discovery",
  profile_pic: selectedUser.profile_pic,
});

          localStorage.removeItem("selectedMatchUser");
        }

        setMatches(data);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleNext = () => {
    setCurrentIndex(i => i + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-yellow-700">
        Finding your best matches...
      </div>
    );
  }

  if (!matches.length || currentIndex >= matches.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
          <p className="text-2xl font-bold">No More Matches</p>
          <button
            onClick={() => onPageChange("skills")}
            className="mt-6 px-6 py-3 rounded-full bg-yellow-500 text-white font-semibold"
          >
            Back to Skills
          </button>
        </div>
      </div>
    );
  }

  const match = matches[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF4CC] to-[#FFE08A]
                    flex items-center justify-center p-6">

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center">

        <img
          src={
            match.profile_pic
              ? `http://localhost:5000/uploads/${match.profile_pic}`
              : "https://i.pravatar.cc/150"
          }
          className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-yellow-400"
          alt={match.name}
        />

        {/* ✅ NAME INSTEAD OF USER ID */}
        <h2 className="text-2xl font-extrabold mb-2">
          {match.name || "Unknown User"}
        </h2>

        <p className="text-4xl font-bold text-yellow-600 mb-2">
          {match.score}%
        </p>

        <p className="text-gray-600 text-sm mb-6">
          {match.reason}
        </p>

        <div className="flex gap-4">
          <button
            onClick={handleNext}
            className="flex-1 bg-gray-200 py-3 rounded-full font-bold flex items-center justify-center gap-2"
          >
            <X /> Reject
          </button>

          <button
  onClick={async () => {
    try {
      if (!match.userId) {
        console.error("Receiver ID missing");
        return;
      }

      const res = await fetch("http://localhost:5000/collab-request/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          senderId: loggedUser.id,
          receiverId: match.userId
        })
      });

      const data = await res.json();

      if (!data.success) {
        console.warn(data.message);
      }

      // ✅ Move to next match
      handleNext();

    } catch (err) {
      console.error("Send request failed:", err);
    }
  }}
  className="flex-1 bg-yellow-500 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2"
>
  <Heart /> Send Request
</button>


        </div>
      </div>
    </div>
  );
}

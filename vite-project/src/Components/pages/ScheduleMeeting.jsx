import { useState, useEffect } from "react";

export default function ScheduleMeeting({ onPageChange, level }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60); // default

  // 🔥 Hybrid Recommendation Logic
  useEffect(() => {
    if (level === "beginner") {
      setDuration(60);
    } else if (level === "intermediate") {
      setDuration(75);
    } else if (level === "advanced") {
      setDuration(90);
    }
  }, [level]);

  const handleConfirm = () => {
    if (!date || !time) {
      alert("Please select date and time");
      return;
    }

    alert(`Meeting scheduled on ${date} at ${time} for ${duration} minutes`);
    onPageChange("skills");
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md text-center">

        <h2 className="text-3xl font-extrabold mb-4">
          Schedule Meeting 📅
        </h2>

        <p className="text-gray-600 mb-6">
          Choose a date and time to collaborate.
        </p>

        {/* Date & Time */}
        <div className="space-y-4 mb-6">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-full border"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-3 rounded-full border"
          />
        </div>

        {/* 🔥 Duration Selection (Hybrid Model) */}
        <div className="mb-6">
          <p className="font-semibold mb-3">
            Recommended: {duration} minutes
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            {[30, 45, 60, 75, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-4 py-2 rounded-full border ${
                  duration === d
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => onPageChange("match")}
            className="flex-1 py-3 rounded-full bg-gray-200 font-semibold"
          >
            Back
          </button>

          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Calendar, Clock, Video, MapPin, ArrowLeft } from "lucide-react";

export default function ScheduleMeeting({ onPageChange }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState("Google Meet");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!date || !time) {
      alert("Please select a date and time.");
      return;
    }

    alert(`Meeting Scheduled Successfully!

📅 Date: ${date}
⏰ Time: ${time}
🟡 Mode: ${mode}
💬 Message: ${message || "(No message)"}
`);

    onPageChange("profile"); // redirect to profile or home after booking
  }

  return (
    <div className="min-h-screen bg-[#FFF9E6] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-10 border border-yellow-300 animate-fadeIn">


        {/* Header */}
        <h2 className="text-4xl font-bold text-center text-yellow-700 mb-2">
          Schedule Your Collaboration Meeting
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Set a suitable time and meeting mode to connect with your partner.
        </p>

        {/* FORM */}
        <form className="space-y-8" onSubmit={handleSubmit}>

          {/* Date Picker */}
          <div>
            <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Calendar size={20} className="text-yellow-700" />
              Select Meeting Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-yellow-300 rounded-xl bg-gray-50 focus:ring-yellow-400 focus:border-yellow-500 outline-none"
              required
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Clock size={20} className="text-yellow-700" />
              Select Meeting Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 border border-yellow-300 rounded-xl bg-gray-50 focus:ring-yellow-400 focus:border-yellow-500 outline-none"
              required
            />
          </div>

          {/* Meeting Mode */}
          <div>
            <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <Video size={20} className="text-yellow-700" />
              Meeting Mode
            </label>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-4 py-3 border border-yellow-300 rounded-xl bg-gray-50 focus:ring-yellow-400 focus:border-yellow-500 outline-none"
            >
              <option>Google Meet</option>
              <option>Zoom</option>
              <option>Others</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <MapPin size={20} className="text-yellow-700" />
              Additional Message (Optional)
            </label>

            <textarea
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share meeting agenda, notes, or location details..."
              className="w-full px-4 py-3 border border-yellow-300 rounded-xl bg-gray-50 focus:ring-yellow-400 focus:border-yellow-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-semibold shadow-lg transition border-none"
          >
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
}

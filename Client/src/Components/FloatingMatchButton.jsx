import React from "react";
import { Sparkles } from "lucide-react";

export default function FloatingMatchButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2
                 bg-yellow-500 hover:bg-yellow-600
                 text-white px-5 py-3 rounded-full
                 shadow-2xl font-semibold transition border-none"
    >
      <Sparkles size={20} />
      Match
    </button>
  );
}

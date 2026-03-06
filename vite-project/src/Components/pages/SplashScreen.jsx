import { useEffect, useState } from "react";
const LETTERS = ["C", "o", "l", "a", "b"];
const LETTER_TIME = 1800; // synced with animationconst
const FINAL_HOLD = 1500;
const RobotHand = ({ letter }) => {
  return (
    <div className="relative flex flex-col items-center pointer-events-none">
      {" "}
      <svg width="120" height="120" viewBox="0 0 120 120">
        {" "}
        <rect x="42" y="10" width="36" height="60" rx="8" fill="#9CA3AF" />{" "}
        <rect x="28" y="70" width="16" height="36" rx="4" fill="#6B7280" />{" "}
        <rect x="52" y="70" width="16" height="36" rx="4" fill="#6B7280" />{" "}
        <rect x="76" y="70" width="16" height="36" rx="4" fill="#6B7280" />{" "}
      </svg>{" "}
      <div className="absolute top-6 text-yellow-500 text-7xl font-extrabold animate-glow">
        {" "}
        {letter}{" "}
      </div>{" "}
    </div>
  );
};
export default function SplashScreen({ onFinish }) {
  const [step, setStep] = useState(-1);
  const [fade, setFade] = useState(false);
  useEffect(() => {
    const timers = [];
    for (let i = 0; i <= LETTERS.length; i++) {
      timers.push(
        setTimeout(() => {
          setStep(i);
        }, i * LETTER_TIME),
      );
    }
    timers.push(
      setTimeout(
        () => {
          setFade(true);
          setTimeout(onFinish, 800);
        },
        LETTERS.length * LETTER_TIME + FINAL_HOLD,
      ),
    );
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onFinish]);
  const directions = [
    "hand-left",
    "hand-top",
    "hand-bottom",
    "hand-right",
    "hand-left",
  ];
  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center      bg-gradient-to-br from-black via-gray-900 to-black      transition-opacity duration-700      ${fade ? "opacity-0" : "opacity-100"}`}
    >
      {" "}
      {/* Soft Glow Background */}{" "}
      <div className="absolute w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />{" "}
      {/* Robot Entry */}{" "}
      {step >= 0 && step < LETTERS.length && (
        <div className={`absolute ${directions[step]}`}>
          {" "}
          <div className="animate-float">
            {" "}
            <RobotHand letter={LETTERS[step]} />{" "}
          </div>{" "}
        </div>
      )}{" "}
      {/* Final Word */}{" "}
      <div className="flex gap-2 text-yellow-500 text-7xl font-extrabold tracking-wider relative z-10">
        {" "}
        {LETTERS.map((l, i) =>
          i <= step ? (
            <span key={i} className="animate-settle">
              {" "}
              {l}{" "}
            </span>
          ) : null,
        )}{" "}
      </div>{" "}
    </div>
  );
}

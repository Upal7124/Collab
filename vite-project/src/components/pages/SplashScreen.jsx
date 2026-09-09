import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center transition-all duration-500 ${
        animate ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      }}
    >
      {/* Animated gradient blob */}
      <div
        className="absolute w-64 h-64 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-20"
        style={{
          animation: "pulse 3s ease-in-out",
        }}
      />

      {/* Main logo text */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Collab text with pulse effect */}
        <h1
          className="text-5xl font-black tracking-widest"
          style={{
            background: "linear-gradient(135deg, #FCD34D, #F59E0B)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "slideInScale 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            textShadow: "0 0 30px rgba(251, 191, 36, 0.5)",
          }}
        >
          COLLAB
        </h1>

        {/* Animated underline */}
        <div
          className="h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 rounded-full"
          style={{
            width: "120px",
            animation: "expandWidth 0.8s ease-out 0.3s both",
          }}
        />

        {/* Tagline */}
        <p
          className="text-xs font-light text-gray-300 tracking-[0.2em] mt-2"
          style={{
            animation: "fadeInUp 0.8s ease-out 0.6s both",
          }}
        >
          CONNECT • COLLABORATE • CREATE
        </p>
      </div>

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full opacity-60"
        style={{ animation: "float 4s ease-in-out infinite" }}
      />
      <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-40"
        style={{ animation: "float 5s ease-in-out infinite reverse" }}
      />

      <style>{`
        @keyframes slideInScale {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes expandWidth {
          0% {
            width: 0;
            opacity: 0;
          }
          100% {
            width: 120px;
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}

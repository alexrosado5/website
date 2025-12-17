"use client";

export default function DarkVeilBackground() {
  return (
    <>
      <style>{`
        @keyframes veil {
          0%   { background-position: 0% 0%, 50% 50%; }
          50%  { background-position: 100% 50%, 0% 100%; }
          100% { background-position: 0% 0%, 50% 50%; }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: `
            radial-gradient(circle at 30% 30%, rgba(20,40,70,0.55), transparent 60%),
            radial-gradient(circle at 70% 70%, rgba(0,0,0,0.75), transparent 65%)
          `,
          backgroundSize: "300% 300%",
          animation: "veil 50s linear infinite",
        }}
      />
    </>
  );
}

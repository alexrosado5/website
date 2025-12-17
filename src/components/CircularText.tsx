"use client";

interface Props {
  text: string;
  radius?: number;
  duration?: number;
}

export default function CircularText({
  text,
  radius = 90,
  duration = 18,
}: Props) {
  const chars = text.split("");
  const angle = 360 / chars.length;

  return (
    <div className="circle">
      {chars.map((c, i) => (
        <span
          key={i}
          style={{
            transform: `rotate(${i * angle}deg) translate(${radius}px) rotate(-${i * angle}deg)`,
          }}
        >
          {c}
        </span>
      ))}

      <style jsx>{`
        .circle {
          position: relative;
          width: ${radius * 2}px;
          height: ${radius * 2}px;
          animation: spin ${duration}s linear infinite;
          pointer-events: none;
        }

        span {
          position: absolute;
          left: 50%;
          top: 50%;
          transform-origin: 0 0;
          font-size: 12px;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.6);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

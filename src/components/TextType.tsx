"use client";

import { useEffect, useState } from "react";

export default function TextType({ text }: { text: string }) {
  const [out, setOut] = useState("");
  const [i, setI] = useState(0);

  useEffect(() => {
    if (i < text.length) {
      const t = setTimeout(() => {
        setOut(text.slice(0, i + 1));
        setI(i + 1);
      }, 80);
      return () => clearTimeout(t);
    } else {
      const r = setTimeout(() => {
        setOut("");
        setI(0);
      }, 2500);
      return () => clearTimeout(r);
    }
  }, [i, text]);

  return (
    <span>
      {out}
      <span className="cursor">|</span>
      <style jsx>{`
        .cursor {
          margin-left: 4px;
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%,50% { opacity: 1 }
          51%,100% { opacity: 0 }
        }
      `}</style>
    </span>
  );
}

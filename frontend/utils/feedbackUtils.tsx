"use client";

import { useStarHover } from "@/hooks/useStarHover";

export function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="fb-stars" style={{ cursor: "default" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`fb-star ${s <= rating ? "filled" : ""}`} style={{ cursor: "default" }}>★</span>
      ))}
    </span>
  );
}

export function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const { hovered, setHovered } = useStarHover();
  return (
    <span className="fb-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`fb-star ${s <= (hovered || value) ? "filled" : ""}`}
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
        >★</span>
      ))}
    </span>
  );
}

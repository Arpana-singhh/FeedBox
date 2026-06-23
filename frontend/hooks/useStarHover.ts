"use client";

import { useState } from "react";

export function useStarHover() {
  const [hovered, setHovered] = useState(0);
  return { hovered, setHovered };
}

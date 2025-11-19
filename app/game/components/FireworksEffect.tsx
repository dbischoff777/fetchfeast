"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { type Position } from "../utils/gameLogic";

type FireworksEffectProps = {
  position: Position;
  onComplete: () => void;
};

export default function FireworksEffect({
  position,
  onComplete,
}: FireworksEffectProps) {
  const [fireworkIndex, setFireworkIndex] = useState(1);

  useEffect(() => {
    // Randomly select one of the 6 firework animations
    setFireworkIndex(Math.floor(Math.random() * 6) + 1);

    // Set timeout to call onComplete after animation finishes
    // Assuming firework animations are approximately 1-2 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once when component mounts

  return (
    <div
      className="absolute z-50 animated-element will-change-transform pointer-events-none"
      style={{
        transform: `translate3d(${position.x - 150}px, ${position.y - 150}px, 0)`,
        width: "300px",
        height: "300px",
        opacity: 1,
        transition: "opacity 0.1s ease-out", // Smooth fade out when unmounting
      }}
    >
      <Image
        src={`/assets/animations/fireworks/fireworks animated_${fireworkIndex}.gif`}
        alt="Firework celebration"
        width={300}
        height={300}
        className="w-full h-full object-contain"
        priority
        unoptimized
      />
    </div>
  );
}


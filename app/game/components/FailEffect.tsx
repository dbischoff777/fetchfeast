"use client";

import Image from "next/image";
import { type Position } from "../utils/gameLogic";

type FailEffectProps = {
  position: Position;
};

export default function FailEffect({ position }: FailEffectProps) {
  const size = 250; // Increased size for better visibility
  const offset = size / 2; // Center the animation on the position

  return (
    <div
      className="absolute z-40 animated-element will-change-transform pointer-events-none"
      style={{
        transform: `translate3d(${position.x - offset}px, ${position.y - offset}px, 0)`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <Image
        src="/assets/animations/fail/fail1.gif"
        alt="Fail feedback"
        width={size}
        height={size}
        className="w-full h-full object-contain"
        priority
        unoptimized
      />
    </div>
  );
}


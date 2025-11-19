"use client";

import Image from "next/image";
import { type Position } from "../utils/gameLogic";

type FailEffectProps = {
  position: Position;
};

export default function FailEffect({ position }: FailEffectProps) {
  return (
    <div
      className="absolute z-40 animated-element will-change-transform pointer-events-none"
      style={{
        transform: `translate3d(${position.x - 75}px, ${position.y - 75}px, 0)`,
        width: "150px",
        height: "150px",
      }}
    >
      <Image
        src="/assets/animations/fail/fail1.gif"
        alt="Fail feedback"
        width={150}
        height={150}
        className="w-full h-full object-contain"
        priority
        unoptimized
      />
    </div>
  );
}


"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

type GameUIProps = {
  score: number;
  lives: number;
  onQuit: () => void;
};

export default function GameUI({ score, lives, onQuit }: GameUIProps) {
  return (
    <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-20 pointer-events-none">
      {/* Score display */}
      <div className="flex items-center bg-yellow-200/95 backdrop-blur-sm border-2 border-blue-600 p-3 md:p-4 rounded-xl shadow-lg pointer-events-auto">
        <Image
          src="/assets/images/score.png"
          alt="Score"
          width={40}
          height={40}
          className="mr-2 md:mr-3"
          unoptimized
        />
        <span className="text-2xl md:text-3xl font-bold text-blue-900">
          {score}
        </span>
      </div>

      {/* Lives display */}
      <div className="flex items-center bg-yellow-200/95 backdrop-blur-sm border-2 border-blue-600 p-3 md:p-4 rounded-xl shadow-lg pointer-events-auto">
        <Image
          src="/assets/images/lives.png"
          alt="Lives"
          width={40}
          height={40}
          className="mr-2 md:mr-3"
          unoptimized
        />
        <div className="flex gap-1 md:gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-6 h-6 md:w-8 md:h-8 rounded-full transition-colors border-2 ${
                i < lives
                  ? "bg-blue-600 border-blue-800"
                  : "bg-gray-400 border-gray-500"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
        <span className="sr-only">{lives} lives remaining</span>
      </div>

      {/* Quit button */}
      <Button
        onClick={onQuit}
        size="lg"
        variant="outline"
        className="bg-yellow-200/95 backdrop-blur-sm hover:bg-yellow-300 text-blue-900 w-20 h-20 md:w-24 md:h-24 rounded-xl shadow-lg pointer-events-auto border-2 border-blue-600"
        aria-label="Quit Game"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 md:h-12 md:w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>
    </div>
  );
}


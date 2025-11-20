"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatBuildInfo } from "@/app/utils/buildInfo";

export default function LandingPage() {
  const [howToPlayExpanded, setHowToPlayExpanded] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-yellow-50 p-4 md:p-6 lg:p-8">
      {/* Subtle animated background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[length:50px_50px] animate-[float_20s_ease-in-out_infinite]"></div>
      </div>
      <main className="relative z-10 flex w-full max-w-4xl h-full flex-col items-center justify-center gap-4 md:gap-6 text-center">
        {/* Welcome Section */}
        <div className="flex flex-col items-center gap-3 md:gap-4 flex-shrink-0">
          {/* Frenchie Logo/Mascot with gentle floating animation */}
          <div className="relative w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 flex-shrink-0 animate-float-gentle">
            <Image
              src="/assets/images/frenchie.png"
              alt="Fetch & Feast Mascot - Friendly French Bulldog"
              width={224}
              height={224}
              className="w-full h-full object-contain drop-shadow-2xl"
              priority
              unoptimized
            />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-blue-700 drop-shadow-lg animate-fade-in">
            Fetch & Feast
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-blue-900 font-semibold px-4 animate-fade-in-delay">
            Welcome! Ready to play with your furry friend?
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col items-center gap-3 md:gap-4 flex-shrink-0 animate-fade-in-delay-2">
          <Link href="/game" className="block">
            <Button
              size="lg"
              className="h-24 w-48 text-xl font-semibold transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-2xl active:scale-95 md:h-32 md:w-64 md:text-2xl lg:h-36 lg:w-72 lg:text-3xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl"
              aria-label="Start Game"
            >
              Start Playing!
            </Button>
          </Link>
        </div>

        {/* Instructions - Expandable */}
        <div className="w-full max-w-2xl rounded-2xl md:rounded-3xl bg-yellow-100/95 border-4 border-blue-500 shadow-lg flex-shrink overflow-hidden transition-all duration-300 ease-in-out animate-fade-in-delay-3">
          <button
            onClick={() => setHowToPlayExpanded(!howToPlayExpanded)}
            className="w-full p-4 md:p-6 lg:p-8 flex justify-between items-center hover:bg-yellow-200/50 transition-colors duration-200 rounded-t-2xl md:rounded-t-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-expanded={howToPlayExpanded}
            aria-label="Toggle How to Play instructions"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-blue-800">
              How to Play
            </h2>
            <svg
              className={`w-6 h-6 md:w-8 md:h-8 text-blue-600 transform transition-transform duration-300 ${
                howToPlayExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              howToPlayExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-4 md:p-6 lg:p-8 pt-0">
              <ul className="flex flex-col gap-2 md:gap-3 text-left text-sm md:text-base lg:text-lg text-blue-900 font-medium">
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="text-xl md:text-2xl flex-shrink-0" aria-hidden="true">
                    🐾
                  </span>
                  <span>Watch for animated objects moving across the screen</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="text-xl md:text-2xl flex-shrink-0" aria-hidden="true">
                    🐾
                  </span>
                  <span>Tap on them quickly to earn points</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="text-xl md:text-2xl flex-shrink-0" aria-hidden="true">
                    🐾
                  </span>
                  <span>Be careful! You have 5 lives</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="text-xl md:text-2xl flex-shrink-0" aria-hidden="true">
                    🐾
                  </span>
                  <span>Avoid clicking outside the objects or you'll lose a life</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Build version info - bottom center */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <p className="text-xs md:text-sm text-blue-600/70 font-mono">
          {formatBuildInfo()}
        </p>
      </div>
    </div>
  );
}

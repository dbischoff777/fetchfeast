"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import soundManager from "../utils/soundManager";

type GameUIProps = {
  score: number;
  lives: number;
  onQuit: () => void;
};

export default function GameUI({ score, lives, onQuit }: GameUIProps) {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const soundButtonWrapperRef = useRef<HTMLDivElement>(null);
  const quitButtonWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize sound manager when component mounts
    soundManager.initialize();
  }, []);

  // Set up touch event listeners with non-passive option
  useEffect(() => {
    const soundWrapper = soundButtonWrapperRef.current;
    const quitWrapper = quitButtonWrapperRef.current;

    const handleSoundTouch = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const newMutedState = soundManager.toggleMute();
      setIsMuted(newMutedState);
    };

    const handleQuitTouch = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onQuit();
    };

    if (soundWrapper) {
      soundWrapper.addEventListener('touchstart', handleSoundTouch, { passive: false });
    }
    if (quitWrapper) {
      quitWrapper.addEventListener('touchstart', handleQuitTouch, { passive: false });
    }

    return () => {
      if (soundWrapper) {
        soundWrapper.removeEventListener('touchstart', handleSoundTouch);
      }
      if (quitWrapper) {
        quitWrapper.removeEventListener('touchstart', handleQuitTouch);
      }
    };
  }, [onQuit]);

  const handleSoundToggle = () => {
    const newMutedState = soundManager.toggleMute();
    setIsMuted(newMutedState);
  };

  const handleQuit = () => {
    onQuit();
  };

  return (
    <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-20 pointer-events-none" style={{ touchAction: 'auto' }}>
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

      {/* Right side controls */}
      <div className="flex gap-2 md:gap-3 items-start">
        {/* Sound toggle button */}
        <div ref={soundButtonWrapperRef} style={{ touchAction: 'manipulation' }}>
          <Button
            onClick={handleSoundToggle}
            size="lg"
            variant="outline"
            className="bg-yellow-200/95 backdrop-blur-sm hover:bg-yellow-300 text-blue-900 w-20 h-20 md:w-24 md:h-24 rounded-xl shadow-lg pointer-events-auto border-2 border-blue-600 transition-transform hover:scale-105 active:scale-95 touch-manipulation"
            aria-label={isMuted ? "Unmute game sounds" : "Mute game sounds"}
            aria-pressed={isMuted}
            style={{ touchAction: 'manipulation' }}
          >
          {isMuted ? (
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
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
          ) : (
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
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          )}
        </Button>
        </div>

        {/* Quit button */}
        <div ref={quitButtonWrapperRef} style={{ touchAction: 'manipulation' }}>
          <Button
            onClick={handleQuit}
            size="lg"
            variant="outline"
            className="bg-yellow-200/95 backdrop-blur-sm hover:bg-yellow-300 text-blue-900 w-20 h-20 md:w-24 md:h-24 rounded-xl shadow-lg pointer-events-auto border-2 border-blue-600 transition-transform hover:scale-105 active:scale-95 touch-manipulation"
            aria-label="Quit Game"
            style={{ touchAction: 'manipulation' }}
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
      </div>
    </div>
  );
}


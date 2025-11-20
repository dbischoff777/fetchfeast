"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getHighScore, isNewRecord, getGameStats } from "@/app/utils/highScore";

type GameOverScreenProps = {
  score: number;
  onReplay: () => void;
  onQuit: () => void;
  isOpen: boolean;
};

export default function GameOverScreen({
  score,
  onReplay,
  onQuit,
  isOpen,
}: GameOverScreenProps) {
  const [highScore, setHighScore] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [gameStats, setGameStats] = useState(getGameStats());

  // Update high score when dialog opens
  useEffect(() => {
    if (isOpen) {
      const currentHighScore = getHighScore();
      const isRecord = isNewRecord(score);
      setHighScore(currentHighScore);
      setNewRecord(isRecord);
      setGameStats(getGameStats());
    }
  }, [isOpen, score]);

  // Determine encouraging message based on score
  const getMessage = () => {
    if (newRecord) {
      return "🎉 New Record! Amazing job! 🎉";
    }
    if (score >= 30) return "Amazing job! You're a Fetch & Feast champion! 🏆";
    if (score >= 20) return "Great work! You're getting really good at this! ⭐";
    if (score >= 10) return "Nice playing! Keep practicing to improve your score! 🎯";
    return "Good effort! Try again to beat your score! 🐾";
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md md:max-w-lg p-6 md:p-8 bg-white"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl md:text-4xl text-center mb-4 text-blue-800 font-bold">
            Game Over!
          </DialogTitle>
          <DialogDescription className="text-center text-xl md:text-2xl mb-6 text-blue-900 font-semibold">
            Great job! Your dog scored{" "}
            <span className="font-bold text-yellow-600 bg-blue-100 px-2 py-1 rounded">
              {score} points
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {/* Animated score display */}
        <div className="score-display my-6 text-center">
          {newRecord && (
            <div className="mb-4 animate-bounce">
              <span className="inline-block bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-lg md:text-xl font-bold shadow-lg">
                🏆 NEW RECORD! 🏆
              </span>
            </div>
          )}
          <div className="text-5xl md:text-6xl font-bold text-yellow-500 animate-score-pulse mb-2">
            {score}
          </div>
          <div className="text-xl text-blue-600 mt-1 font-semibold">Final Score</div>
          
          {/* High score display */}
          {highScore > 0 && (
            <div className="mt-4 pt-4 border-t-2 border-blue-200">
              <div className="text-sm md:text-base text-blue-600 mb-1">Personal Best</div>
              <div className="text-2xl md:text-3xl font-bold text-blue-800">
                {highScore}
              </div>
              {!newRecord && score < highScore && (
                <div className="text-xs md:text-sm text-blue-500 mt-1">
                  {highScore - score} points away from your best!
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center mb-6 md:mb-8">
          <p className="text-lg md:text-xl text-blue-700 mb-2 font-semibold">
            {getMessage()}
          </p>
          <p className="text-base md:text-lg text-blue-800">
            Want to play again?
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button
            onClick={onReplay}
            size="lg"
            className="w-full md:w-48 h-20 md:h-24 text-xl md:text-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-transform active:scale-95"
          >
            Play Again
          </Button>

          <Button
            onClick={onQuit}
            size="lg"
            variant="outline"
            className="w-full md:w-48 h-20 md:h-24 text-xl md:text-2xl bg-yellow-200 hover:bg-yellow-300 text-blue-900 font-semibold rounded-xl transition-transform active:scale-95 border-2 border-blue-600"
          >
            Quit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


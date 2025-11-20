"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  // Determine encouraging message based on score
  const getMessage = () => {
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
          <div className="text-5xl md:text-6xl font-bold text-yellow-500 animate-score-pulse mb-2">
            {score}
          </div>
          <div className="text-xl text-blue-600 mt-1 font-semibold">Final Score</div>
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


"use client";

import { useState, useCallback } from "react";

export type GameState = {
  score: number;
  lives: number;
  isGameOver: boolean;
  isPlaying: boolean;
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 5,
    isGameOver: false,
    isPlaying: false,
  });

  const startGame = useCallback(() => {
    setGameState({
      score: 0,
      lives: 5,
      isGameOver: false,
      isPlaying: true,
    });
  }, []);

  const incrementScore = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + 1,
    }));
  }, []);

  const decrementLives = useCallback(() => {
    setGameState((prev) => {
      const newLives = prev.lives - 1;
      const isGameOver = newLives <= 0;

      return {
        ...prev,
        lives: newLives,
        isGameOver,
        isPlaying: !isGameOver,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      score: 0,
      lives: 5,
      isGameOver: false,
      isPlaying: true,
    });
  }, []);

  const quitGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: false,
    }));
  }, []);

  return {
    gameState,
    startGame,
    incrementScore,
    decrementLives,
    resetGame,
    quitGame,
  };
};


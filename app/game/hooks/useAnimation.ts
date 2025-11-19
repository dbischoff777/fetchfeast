"use client";

import { useState, useEffect, useCallback } from "react";
import { preloadAnimations } from "../utils/animations";
import { type Position } from "../utils/gameLogic";

export const useAnimation = () => {
  const [showFireworks, setShowFireworks] = useState(false);
  const [fireworksPosition, setFireworksPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [showFailAnimation, setShowFailAnimation] = useState(false);
  const [failPosition, setFailPosition] = useState<Position>({ x: 0, y: 0 });

  // Preload animations on mount
  useEffect(() => {
    preloadAnimations();
  }, []);

  const triggerFireworks = useCallback((position: Position) => {
    setFireworksPosition(position);
    setShowFireworks(true);
  }, []);

  const hideFireworks = useCallback(() => {
    setShowFireworks(false);
  }, []);

  const triggerFailAnimation = useCallback((position: Position) => {
    setFailPosition(position);
    setShowFailAnimation(true);

    // Hide fail animation after 1 second
    setTimeout(() => {
      setShowFailAnimation(false);
    }, 1000);
  }, []);

  return {
    showFireworks,
    fireworksPosition,
    showFailAnimation,
    failPosition,
    triggerFireworks,
    hideFireworks,
    triggerFailAnimation,
  };
};


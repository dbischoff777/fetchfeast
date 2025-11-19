"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  generateRandomPosition,
  generateRandomMovement,
  GAME_CONFIG,
  type Position,
  type MovementPattern,
} from "../utils/gameLogic";

export const useObjectMovement = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  isPlaying: boolean
) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [objectSize] = useState(GAME_CONFIG.OPTIMAL_OBJECT_SIZE);
  const [currentObjectIndex, setCurrentObjectIndex] = useState(1);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const movementPatternRef = useRef<MovementPattern>("linear");
  const movementProgressRef = useRef<number>(0);
  const targetPositionRef = useRef<Position>({ x: 0, y: 0 });
  const startPositionRef = useRef<Position>({ x: 0, y: 0 });
  const currentPositionRef = useRef<Position>({ x: 0, y: 0 });
  const positionUpdateCounterRef = useRef<number>(0);
  const objectElementRef = useRef<{ updatePosition: (x: number, y: number) => void } | null>(null);

  // Function to reset object position and properties
  const resetObject = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();

    // Generate new random position
    const newPosition = generateRandomPosition(width, height, objectSizeRef.current);
    setPosition(newPosition);
    currentPositionRef.current = newPosition;
    startPositionRef.current = newPosition;

    // Immediately update GameObject position via ref (only if ref is available)
    if (objectElementRef.current) {
      objectElementRef.current.updatePosition(newPosition.x, newPosition.y);
    }

    // Generate new movement pattern
    movementPatternRef.current = generateRandomMovement();
    movementProgressRef.current = 0;

    // Generate new target position for movement
    targetPositionRef.current = generateRandomPosition(width, height, objectSizeRef.current);

    // Cycle to next object variation (1-5) - always update even if GameObject is temporarily unmounted
    setCurrentObjectIndex((prev) => ((prev % 5) + 1));
  }, [containerRef]);

  // Animation loop using requestAnimationFrame
  // Use refs to avoid recreating the callback
  const isPlayingRef = useRef(isPlaying);
  const objectSizeRef = useRef(objectSize);

  // Keep refs in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    objectSizeRef.current = objectSize;
  }, [isPlaying, objectSize]);

  const animate = useCallback((timestamp: number) => {
    if (!isPlayingRef.current || !containerRef.current) {
      return;
    }

    const deltaTime = timestamp - lastTimestampRef.current;
    lastTimestampRef.current = timestamp;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();

    // Update movement progress
    const speed = 0.00025; // pixels per ms (reduced for slower, more playable movement)
    movementProgressRef.current += deltaTime * speed;

    // Calculate new position based on movement pattern
    let newX = currentPositionRef.current.x;
    let newY = currentPositionRef.current.y;

    const progress = Math.min(movementProgressRef.current, 1);
    const dx = targetPositionRef.current.x - startPositionRef.current.x;
    const dy = targetPositionRef.current.y - startPositionRef.current.y;

    switch (movementPatternRef.current) {
      case "linear":
        newX = startPositionRef.current.x + dx * progress;
        newY = startPositionRef.current.y + dy * progress;
        break;
      case "curved":
        // Curved movement using sine wave
        const curveProgress = Math.sin(progress * Math.PI);
        newX = startPositionRef.current.x + dx * progress;
        newY = startPositionRef.current.y + dy * curveProgress;
        break;
      case "zigzag":
        // Zigzag pattern
        const zigzagOffset = Math.sin(progress * Math.PI * 4) * 30;
        newX = startPositionRef.current.x + dx * progress;
        newY = startPositionRef.current.y + dy * progress + zigzagOffset;
        break;
      case "bounce":
        // Bouncing pattern
        const bounceProgress = Math.abs(Math.sin(progress * Math.PI * 2));
        newX = startPositionRef.current.x + dx * progress;
        newY = startPositionRef.current.y + dy * bounceProgress;
        break;
    }

    // Ensure position stays within bounds
    newX = Math.max(
      objectSizeRef.current / 2,
      Math.min(width - objectSizeRef.current / 2, newX)
    );
    newY = Math.max(
      objectSizeRef.current / 2,
      Math.min(height - objectSizeRef.current / 2, newY)
    );

    currentPositionRef.current = { x: newX, y: newY };
    
    // Update DOM directly for smooth animation (60fps) - avoids React re-renders
    if (objectElementRef.current) {
      objectElementRef.current.updatePosition(newX, newY);
    }
    
    // Throttle React state updates to every 30 frames (~2 times per second) to prevent infinite loops
    // State is only needed for initial positioning and interaction detection
    positionUpdateCounterRef.current += 1;
    if (positionUpdateCounterRef.current >= 30) {
      setPosition({ x: newX, y: newY });
      positionUpdateCounterRef.current = 0;
    }

    // Check if we've reached the target position
    const distanceToTarget = Math.sqrt(
      Math.pow(targetPositionRef.current.x - newX, 2) +
        Math.pow(targetPositionRef.current.y - newY, 2)
    );

    if (distanceToTarget < 20 || movementProgressRef.current >= 1) {
      // Generate new target position
      startPositionRef.current = { x: newX, y: newY };
      targetPositionRef.current = generateRandomPosition(
        width,
        height,
        objectSizeRef.current
      );
      movementPatternRef.current = generateRandomMovement();
      movementProgressRef.current = 0;
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [containerRef]);

  // Start/stop animation based on isPlaying state
  useEffect(() => {
    if (isPlaying) {
      resetObject();
      lastTimestampRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isPlaying, animate, resetObject]);

  return {
    position,
    currentObjectIndex,
    resetObject,
    objectElementRef,
  };
};


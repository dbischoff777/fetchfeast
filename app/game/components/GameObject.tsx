"use client";

import { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";
import { GAME_CONFIG, type Position } from "../utils/gameLogic";

type GameObjectProps = {
  position: Position;
  objectIndex: number;
  onInteraction: () => void;
  ariaLabel?: string;
};

export type GameObjectRef = {
  updatePosition: (x: number, y: number) => void;
};

const GameObject = forwardRef<GameObjectRef, GameObjectProps>(
  ({ position, objectIndex, onInteraction, ariaLabel = "Clickable game object" }, ref) => {
    const objectRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      updatePosition: (x: number, y: number) => {
        if (objectRef.current) {
          objectRef.current.style.transform = `translate3d(${
            x - GAME_CONFIG.OPTIMAL_OBJECT_SIZE / 2
          }px, ${y - GAME_CONFIG.OPTIMAL_OBJECT_SIZE / 2}px, 0)`;
        }
      },
    }));

    // Initial position setup
    useEffect(() => {
      if (objectRef.current) {
        objectRef.current.style.transform = `translate3d(${
          position.x - GAME_CONFIG.OPTIMAL_OBJECT_SIZE / 2
        }px, ${position.y - GAME_CONFIG.OPTIMAL_OBJECT_SIZE / 2}px, 0)`;
      }
    }, [position.x, position.y]);

    // Handle touch events with non-passive listener
    useEffect(() => {
      const element = objectRef.current;
      if (!element) return;

      const handleTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onInteraction();
      };

      // Add non-passive touch listener
      element.addEventListener("touchstart", handleTouchStart, { passive: false });

      return () => {
        element.removeEventListener("touchstart", handleTouchStart);
      };
    }, [onInteraction]);

    // Handle mouse click interaction
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onInteraction();
    };

    // Handle keyboard interaction
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        onInteraction();
      }
    };

  return (
    <div
      ref={objectRef}
      className="absolute game-object will-change-transform game-object-container"
      style={{
        width: `${GAME_CONFIG.OPTIMAL_OBJECT_SIZE}px`,
        height: `${GAME_CONFIG.OPTIMAL_OBJECT_SIZE}px`,
        touchAction: "none", // Prevent scrolling on touch
        cursor: "pointer",
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
    >
      {/* Pulse/glow effect */}
      <div className="absolute inset-0 rounded-full game-object-pulse pointer-events-none" />
      
      {/* Main object image */}
      <div className="relative w-full h-full game-object-image">
        <Image
          src={`/assets/animations/try/Object_${objectIndex}.gif`}
          alt={`Game object ${objectIndex}`}
          width={GAME_CONFIG.OPTIMAL_OBJECT_SIZE}
          height={GAME_CONFIG.OPTIMAL_OBJECT_SIZE}
          className="w-full h-full object-contain pointer-events-none"
          priority
          unoptimized
        />
      </div>
    </div>
  );
});

GameObject.displayName = "GameObject";

export default GameObject;


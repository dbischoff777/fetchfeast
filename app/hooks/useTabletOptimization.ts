"use client";

import { useEffect, useState, useCallback } from "react";

export const useTabletOptimization = () => {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "landscape"
  );

  useEffect(() => {
    // Detect initial orientation
    const updateOrientation = () => {
      if (window.innerWidth > window.innerHeight) {
        setOrientation("landscape");
      } else {
        setOrientation("portrait");
      }
    };

    updateOrientation();

    // Listen for orientation changes
    window.addEventListener("resize", updateOrientation);

    // Prevent default touch behaviors that might interfere with the game
    const preventDefaultTouchBehavior = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.closest('[role="button"]') ||
          target.closest(".game-object"))
      ) {
        // Allow default behavior for buttons
        return;
      }
      // Prevent scrolling during gameplay
      if (target?.closest('[data-game-container]')) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchstart", preventDefaultTouchBehavior, {
      passive: false,
    });
    document.addEventListener("touchmove", preventDefaultTouchBehavior, {
      passive: false,
    });

    // Prevent pinch zoom
    const preventGesture = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", preventGesture);
    document.addEventListener("gesturechange", preventGesture);
    document.addEventListener("gestureend", preventGesture);

    // Handle visibility change (app switching on tablets)
    const handleVisibilityChange = () => {
      // Game can pause here when the tab/app is not visible
      // This is especially important on tablets where users might switch apps frequently
      if (document.hidden) {
        // Optional: pause game logic here
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean up event listeners
    return () => {
      window.removeEventListener("resize", updateOrientation);
      document.removeEventListener("touchstart", preventDefaultTouchBehavior);
      document.removeEventListener("touchmove", preventDefaultTouchBehavior);
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("gestureend", preventGesture);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const requestFullscreen = useCallback(() => {
    const docEl = document.documentElement;

    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().catch(() => {
        // Ignore errors (user may have denied permission)
      });
    } else if ((docEl as any).webkitRequestFullscreen) {
      (docEl as any).webkitRequestFullscreen();
    } else if ((docEl as any).mozRequestFullScreen) {
      (docEl as any).mozRequestFullScreen();
    } else if ((docEl as any).msRequestFullscreen) {
      (docEl as any).msRequestFullscreen();
    }
  }, []);

  return {
    orientation,
    requestFullscreen,
  };
};


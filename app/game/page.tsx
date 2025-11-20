"use client";

import { useRef, useEffect, useCallback, memo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


// Components
import GameObject from "./components/GameObject";
import FireworksEffect from "./components/FireworksEffect";
import FailEffect from "./components/FailEffect";
import GameUI from "./components/GameUI";
import GameOverScreen from "./components/GameOverScreen";

// Hooks
import { useGameState } from "./hooks/useGameState";
import { useObjectMovement } from "./hooks/useObjectMovement";
import { useAnimation } from "./hooks/useAnimation";
import { useTabletOptimization } from "../hooks/useTabletOptimization";

// Sound manager
import soundManager, { SoundType } from "./utils/soundManager";

// Performance utilities
import {
  setupFPSMonitoring,
  measureTouchResponseTime,
  optimizeAnimations,
  optimizeImages,
  detectMemoryLeaks,
} from "../utils/performance";

// Accessibility utilities
import {
  announceToScreenReader,
  setupKeyboardNavigation,
} from "../utils/accessibility";

// Browser compatibility utilities
import { logBrowserCompatibility } from "../utils/browserCompatibility";

// High score utilities
import { recordGameSession, updateHighScore } from "../utils/highScore";

export default function Game() {
  const router = useRouter();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const objectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSpawningNewObject, setIsSpawningNewObject] = useState(false);
  const gameStartTimeRef = useRef<number | null>(null);

  // Game state management
  const {
    gameState,
    startGame,
    incrementScore,
    decrementLives,
    resetGame,
    quitGame,
  } = useGameState();

  // Object movement
  const { position, currentObjectIndex, resetObject, objectElementRef } =
    useObjectMovement(gameContainerRef, gameState.isPlaying);

  // Animation effects
  const {
    showFireworks,
    fireworksPosition,
    showFailAnimation,
    failPosition,
    triggerFireworks,
    hideFireworks,
    triggerFailAnimation,
  } = useAnimation();

  // Tablet optimizations
  const { orientation, requestFullscreen } = useTabletOptimization();

  // Start game on component mount
  useEffect(() => {
    startGame();
    // Record game start time for playtime tracking
    gameStartTimeRef.current = Date.now();
  }, [startGame]);

  // Request fullscreen when game starts (optional, user can dismiss)
  useEffect(() => {
    if (gameState.isPlaying) {
      // Small delay to ensure game is ready
      const timer = setTimeout(() => {
        requestFullscreen();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.isPlaying, requestFullscreen]);

  // Log browser compatibility info in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      logBrowserCompatibility();
    }
  }, []);

  // Set up performance monitoring in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const getFPS = setupFPSMonitoring();
      const cleanupTouchMonitoring = measureTouchResponseTime();
      const cleanupMemoryLeaks = detectMemoryLeaks();

      // FPS monitoring (warnings disabled for cleaner console)
      // Uncomment below to enable low FPS warnings:
      // const fpsInterval = setInterval(() => {
      //   const currentFPS = getFPS();
      //   if (currentFPS < 55) {
      //     console.warn(`Low FPS detected: ${currentFPS}`);
      //   }
      // }, 5000);

      return () => {
        // clearInterval(fpsInterval); // Uncomment if enabling FPS warnings
        cleanupTouchMonitoring();
        cleanupMemoryLeaks();
      };
    }
  }, []);

  // Optimize game container animations
  useEffect(() => {
    if (gameContainerRef.current) {
      // Apply performance optimizations to the game container
      const cleanup = optimizeAnimations(gameContainerRef.current);

      // Optimize images
      optimizeImages();

      return cleanup;
    }
  }, []);

  // Announce score changes to screen readers
  useEffect(() => {
    if (gameState.score > 0) {
      announceToScreenReader(`Score increased to ${gameState.score}`);
    }
  }, [gameState.score]);

  // Announce lives changes to screen readers
  useEffect(() => {
    if (gameState.lives < 5 && gameState.lives >= 0) {
      announceToScreenReader(`${gameState.lives} lives remaining`);
    }
  }, [gameState.lives]);

  // Handle successful object interaction
  const handleObjectSuccess = useCallback(() => {
    if (!gameState.isPlaying || showFireworks || gameState.isGameOver) return;

    // Clear timeout since object was clicked
    if (objectTimeoutRef.current) {
      clearTimeout(objectTimeoutRef.current);
      objectTimeoutRef.current = null;
    }

    // Play success sound
    soundManager.play(SoundType.SUCCESS);

    // Increment score and trigger fireworks
    // The game object will be hidden immediately due to !showFireworks condition
    incrementScore();
    triggerFireworks(position);
  }, [gameState.isPlaying, showFireworks, gameState.isGameOver, incrementScore, triggerFireworks, position]);

  // Handle missed object (timeout)
  const handleObjectMiss = useCallback(() => {
    if (!gameState.isPlaying || showFireworks || gameState.isGameOver) return;

    // Play miss sound
    soundManager.play(SoundType.MISS);

    decrementLives();
    triggerFailAnimation(position);
    resetObject();
  }, [gameState.isPlaying, showFireworks, gameState.isGameOver, decrementLives, triggerFailAnimation, position, resetObject]);

  // Handle missclick (clicking outside the game object)
  const handleMissclick = useCallback((event: MouseEvent | TouchEvent) => {
    if (!gameState.isPlaying || showFireworks || showFailAnimation || gameState.isGameOver || isSpawningNewObject) {
      return;
    }

    const target = event.target as HTMLElement;
    
    // Check if click is on game object or its children
    const gameObject = target.closest('.game-object');
    if (gameObject) {
      return; // Click was on game object, not a missclick
    }

    // Check if click is on GameUI elements (score, lives, quit button)
    const gameUI = target.closest('[data-game-ui]');
    if (gameUI) {
      return; // Click was on UI, not a missclick
    }

    // Clear timeout since object was missed via missclick
    if (objectTimeoutRef.current) {
      clearTimeout(objectTimeoutRef.current);
      objectTimeoutRef.current = null;
    }

    // Play miss sound
    soundManager.play(SoundType.MISS);

    // This is a missclick - subtract a life
    decrementLives();
    // Get click position for fail animation
    const clickX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clickY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    if (gameContainerRef.current) {
      const containerRect = gameContainerRef.current.getBoundingClientRect();
      const relativeX = clickX - containerRect.left;
      const relativeY = clickY - containerRect.top;
      triggerFailAnimation({ x: relativeX, y: relativeY });
    }
    
    resetObject();
  }, [gameState.isPlaying, showFireworks, showFailAnimation, gameState.isGameOver, isSpawningNewObject, decrementLives, triggerFailAnimation, resetObject]);

  // Record game session and update high score when game ends
  useEffect(() => {
    if (gameState.isGameOver && gameStartTimeRef.current) {
      // Calculate playtime in seconds
      const playtimeSeconds = Math.floor(
        (Date.now() - gameStartTimeRef.current) / 1000
      );

      // Update high score
      updateHighScore(gameState.score);

      // Record game session
      recordGameSession(gameState.score, playtimeSeconds);

      // Reset start time
      gameStartTimeRef.current = null;
    }
  }, [gameState.isGameOver, gameState.score]);

  // Announce game over to screen readers
  useEffect(() => {
    if (gameState.isGameOver) {
      announceToScreenReader(
        `Game over. Final score: ${gameState.score}. Press Play Again to restart.`
      );
    }
  }, [gameState.isGameOver, gameState.score]);

  // Set up keyboard navigation
  useEffect(() => {
    if (gameState.isPlaying && !showFireworks && !gameState.isGameOver) {
      return setupKeyboardNavigation(gameContainerRef, handleObjectSuccess);
    }
  }, [gameState.isPlaying, showFireworks, gameState.isGameOver, handleObjectSuccess]);

  // Set up missclick detection (clicks outside game object)
  useEffect(() => {
    const container = gameContainerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      handleMissclick(e);
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      handleMissclick(e);
    };

    container.addEventListener('click', handleClick);
    container.addEventListener('touchstart', handleTouchStart, { passive: false });

    return () => {
      container.removeEventListener('click', handleClick);
      container.removeEventListener('touchstart', handleTouchStart);
    };
  }, [handleMissclick]);

  // Set up timeout for object interaction (fail if not clicked in time)
  useEffect(() => {
    if (!gameState.isPlaying || showFireworks || gameState.isGameOver) {
      // Clear timeout when game is paused or fireworks are showing
      if (objectTimeoutRef.current) {
        clearTimeout(objectTimeoutRef.current);
        objectTimeoutRef.current = null;
      }
      return;
    }

    // Clear existing timeout
    if (objectTimeoutRef.current) {
      clearTimeout(objectTimeoutRef.current);
    }

    // Set new timeout - object disappears after 5 seconds
    objectTimeoutRef.current = setTimeout(() => {
      if (gameState.isPlaying && !showFireworks && !gameState.isGameOver) {
        handleObjectMiss();
      }
    }, 5000);

    return () => {
      if (objectTimeoutRef.current) {
        clearTimeout(objectTimeoutRef.current);
        objectTimeoutRef.current = null;
      }
    };
  }, [position, gameState.isPlaying, showFireworks, gameState.isGameOver, handleObjectMiss]);

  // Handle fireworks animation complete
  const handleFireworksComplete = useCallback(() => {
    // Set flag to prevent old GameObject from showing during transition
    setIsSpawningNewObject(true);
    
    // First, hide fireworks to clean up the animation
    // This will cause the FireworksEffect component to unmount
    hideFireworks();
    
    // Wait for React to fully unmount the fireworks component and clean up DOM
    // before spawning new object to prevent any graphical overlap/distortion
    setTimeout(() => {
      if (gameState.isPlaying && !gameState.isGameOver) {
        // Reset object only after fireworks component is completely unmounted
        // This ensures clean visual transition
        resetObject();
        // Clear the flag after new object is spawned
        setIsSpawningNewObject(false);
      }
    }, 150); // Delay ensures React has time to unmount and clean up DOM
  }, [hideFireworks, resetObject, gameState.isPlaying, gameState.isGameOver]);

  // Handle quit game
  const handleQuit = () => {
    quitGame();
    router.push("/");
  };

  // Handle replay game
  const handleReplay = () => {
    setIsSpawningNewObject(false);
    resetGame();
    resetObject();
    // Reset game start time for new session
    gameStartTimeRef.current = Date.now();
  };

  // Memoized components for performance
  const MemoizedGameUI = memo(GameUI);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-100 to-yellow-50"
      role="application"
      aria-label="Fetch and Feast Game"
    >
      {/* Background image */}
      <Image
        src="/assets/images/gameBackgrounds/floor1.png"
        alt="Game background"
        fill
        className="object-cover"
        priority
        unoptimized
      />

      {/* Game container */}
      <div
        ref={gameContainerRef}
        data-game-container
        className="relative w-full h-full safe-area-inset"
        style={{ touchAction: "none" }} // Prevent scrolling on touch
        tabIndex={0} // Make container focusable for keyboard navigation
        aria-live="polite"
        aria-label="Game play area"
      >
        {/* Game UI - memoized for performance */}
        <div data-game-ui>
          <MemoizedGameUI
            score={gameState.score}
            lives={gameState.lives}
            onQuit={handleQuit}
          />
        </div>

        {/* Game object - hidden during fireworks and transition to prevent overlap */}
        {gameState.isPlaying && !showFireworks && !showFailAnimation && !gameState.isGameOver && !isSpawningNewObject && (
          <GameObject
            ref={objectElementRef}
            position={position}
            objectIndex={currentObjectIndex}
            onInteraction={handleObjectSuccess}
            ariaLabel="Clickable game object - tap or press Enter to interact"
          />
        )}

        {/* Fireworks effect */}
        {showFireworks && (
          <FireworksEffect
            position={fireworksPosition}
            onComplete={handleFireworksComplete}
          />
        )}

        {/* Fail animation */}
        {showFailAnimation && (
          <FailEffect position={failPosition} />
        )}
      </div>

      {/* Game over screen */}
      <GameOverScreen
        score={gameState.score}
        onReplay={handleReplay}
        onQuit={handleQuit}
        isOpen={gameState.isGameOver}
      />

      {/* Screen reader announcer (hidden visually) */}
      <div
        id="screen-reader-announcer"
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
      ></div>
    </div>
  );
}

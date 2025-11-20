// Constants for game configuration
export const GAME_CONFIG = {
  MIN_OBJECT_SIZE: 120, // Minimum size in pixels (for dog interaction)
  OPTIMAL_OBJECT_SIZE: 220, // Optimal size for visibility (increased from 180)
  ANIMATION_DURATION: 5000, // Base duration for object movement in ms
  PULSE_INTERVAL_MIN: 1000, // Minimum time between pulses in ms
  PULSE_INTERVAL_MAX: 3000, // Maximum time between pulses in ms
  PULSE_DURATION: 500, // Duration of pulse animation in ms
  TOUCH_RESPONSE_THRESHOLD: 100, // Max acceptable touch response time in ms
  INITIAL_LIVES: 5,
} as const;

export type Position = {
  x: number;
  y: number;
};

export type MovementPattern = "linear" | "curved" | "zigzag" | "bounce";

// Function to generate random position within viewport
export const generateRandomPosition = (
  containerWidth: number,
  containerHeight: number,
  objectSize: number
): Position => {
  // Calculate safe areas to avoid tablet bezels and system UI
  const safeAreaX = 20; // pixels from edge
  const safeAreaY = 20; // pixels from edge

  return {
    x:
      Math.random() * (containerWidth - objectSize - 2 * safeAreaX) +
      safeAreaX,
    y:
      Math.random() * (containerHeight - objectSize - 2 * safeAreaY) +
      safeAreaY,
  };
};

// Function to generate random movement pattern
export const generateRandomMovement = (): MovementPattern => {
  const patterns: MovementPattern[] = ["linear", "curved", "zigzag", "bounce"];
  return patterns[Math.floor(Math.random() * patterns.length)];
};

// Function to check if interaction was successful
export const isSuccessfulInteraction = (
  objectRect: DOMRect,
  touchX: number,
  touchY: number
): boolean => {
  return (
    touchX >= objectRect.left &&
    touchX <= objectRect.right &&
    touchY >= objectRect.top &&
    touchY <= objectRect.bottom
  );
};

// Function to generate random pulse timing
export const getRandomPulseDelay = (): number => {
  return (
    Math.random() * (GAME_CONFIG.PULSE_INTERVAL_MAX - GAME_CONFIG.PULSE_INTERVAL_MIN) +
    GAME_CONFIG.PULSE_INTERVAL_MIN
  );
};


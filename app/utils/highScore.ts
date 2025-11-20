"use client";

/**
 * High Score Management Utility
 * Handles local storage of high scores and game statistics
 */

export interface GameStats {
  highScore: number;
  totalGames: number;
  totalPlaytime: number; // in seconds
  averageScore: number;
  lastPlayed: string; // ISO date string
}

const STORAGE_KEY = 'fetchFeast_gameStats';

/**
 * Get current game statistics from localStorage
 */
export const getGameStats = (): GameStats => {
  if (typeof window === 'undefined') {
    return getDefaultStats();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const stats = JSON.parse(stored) as GameStats;
      // Validate and ensure all fields exist
      return {
        highScore: stats.highScore || 0,
        totalGames: stats.totalGames || 0,
        totalPlaytime: stats.totalPlaytime || 0,
        averageScore: stats.averageScore || 0,
        lastPlayed: stats.lastPlayed || new Date().toISOString(),
      };
    }
  } catch (error) {
    console.warn('Failed to load game stats from localStorage:', error);
  }

  return getDefaultStats();
};

/**
 * Get default stats structure
 */
const getDefaultStats = (): GameStats => ({
  highScore: 0,
  totalGames: 0,
  totalPlaytime: 0,
  averageScore: 0,
  lastPlayed: new Date().toISOString(),
});

/**
 * Update high score if new score is higher
 */
export const updateHighScore = (newScore: number): boolean => {
  const stats = getGameStats();
  const isNewRecord = newScore > stats.highScore;

  if (isNewRecord) {
    const updatedStats: GameStats = {
      ...stats,
      highScore: newScore,
      lastPlayed: new Date().toISOString(),
    };
    saveGameStats(updatedStats);
  }

  return isNewRecord;
};

/**
 * Record a completed game session
 */
export const recordGameSession = (
  score: number,
  playtimeSeconds: number
): void => {
  const stats = getGameStats();
  
  const totalGames = stats.totalGames + 1;
  const totalPlaytime = stats.totalPlaytime + playtimeSeconds;
  
  // Calculate new average score
  const averageScore = Math.round(
    (stats.averageScore * stats.totalGames + score) / totalGames
  );

  const updatedStats: GameStats = {
    ...stats,
    totalGames,
    totalPlaytime,
    averageScore,
    lastPlayed: new Date().toISOString(),
    // Update high score if this is a new record
    highScore: Math.max(stats.highScore, score),
  };

  saveGameStats(updatedStats);
};

/**
 * Save game statistics to localStorage
 */
const saveGameStats = (stats: GameStats): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to save game stats to localStorage:', error);
  }
};

/**
 * Get high score only
 */
export const getHighScore = (): number => {
  return getGameStats().highScore;
};

/**
 * Check if a score is a new record
 */
export const isNewRecord = (score: number): boolean => {
  return score > getHighScore();
};

/**
 * Reset all game statistics
 */
export const resetGameStats = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to reset game stats:', error);
  }
};

/**
 * Get formatted playtime string
 */
export const formatPlaytime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};


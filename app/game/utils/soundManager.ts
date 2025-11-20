"use client";

export interface SoundOptions {
  volume?: number;
  loop?: boolean;
}

export enum SoundType {
  SUCCESS = 'success',
  MISS = 'miss',
}

class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<SoundType, AudioBuffer> = new Map();
  private activeSources: Map<string, AudioBufferSourceNode> = new Map();
  private maxConcurrentSounds: number = 4;
  private muted: boolean = false;
  private initialized: boolean = false;
  private initializationAttempted: boolean = false;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private userInteractionListener: (() => void) | null = null;

  constructor() {
    // Check localStorage for saved preferences
    if (typeof window !== 'undefined') {
      try {
        const savedMuteState = localStorage.getItem('soundMuted');
        this.muted = savedMuteState === 'true';
      } catch (error) {
        // Handle localStorage access errors (e.g., in private browsing)
        console.warn('Could not access localStorage for sound preferences:', error);
        this.muted = false;
      }
    }
  }

  private async createAudioContext(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      // Close existing context if it exists and is broken
      if (this.audioContext) {
        try {
          if (this.audioContext.state !== 'closed') {
            await this.audioContext.close();
          }
        } catch (closeError) {
          // Context was already closed or broken
        }
        this.audioContext = null;
      }

      // Create new audio context with fallback for older browsers
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Listen for state changes to detect errors
      this.audioContext.addEventListener('statechange', () => {
        if (!this.audioContext) return;

        // If context becomes interrupted or closed, we'll need to recreate it
        if (this.audioContext.state === 'interrupted' || this.audioContext.state === 'closed') {
          // Mark context as broken so it gets recreated on next play attempt
          this.audioContext = null;
          this.initialized = false;
        }
      });

      // Try to resume if suspended (may fail without user interaction, that's ok)
      if (this.audioContext.state === 'suspended') {
        try {
          await this.audioContext.resume();
        } catch (resumeError) {
          // Can't resume without user interaction - will retry on play
        }
      }

      return true;
    } catch (error) {
      // AudioContext creation failed - mark as unavailable
      this.audioContext = null;
      this.initialized = false;
      return false;
    }
  }

  async initialize(): Promise<void> {
    if (typeof window === 'undefined') return;
    if (this.initializationAttempted) return; // Prevent multiple initialization attempts

    this.initializationAttempted = true;

    // Create audio context lazily - don't create it yet, wait for user interaction
    // This prevents "AudioContext encountered an error" when there's no user gesture
    
    // Set up user interaction listener to initialize on first interaction
    if (!this.userInteractionListener) {
      this.userInteractionListener = async () => {
        if (!this.initialized && !this.audioContext) {
          const created = await this.createAudioContext();
          if (created) {
            await this.preloadSounds();
            this.initialized = true;
          }
        }
        // Remove listener after first interaction
        if (this.userInteractionListener) {
          document.removeEventListener('click', this.userInteractionListener);
          document.removeEventListener('touchstart', this.userInteractionListener);
          document.removeEventListener('keydown', this.userInteractionListener);
          this.userInteractionListener = null;
        }
      };

      // Listen for user interaction to initialize audio context
      document.addEventListener('click', this.userInteractionListener, { once: true });
      document.addEventListener('touchstart', this.userInteractionListener, { once: true });
      document.addEventListener('keydown', this.userInteractionListener, { once: true });
    }

    // Start health check to monitor context state
    this.startHealthCheck();
  }

  private startHealthCheck(): void {
    if (this.healthCheckInterval) return;

    this.healthCheckInterval = setInterval(() => {
      if (!this.audioContext) return;

      try {
        // Check if context is still valid
        const state = this.audioContext.state;
        if (state === 'closed' || state === 'interrupted') {
          // Context is broken - mark for recreation
          this.audioContext = null;
          this.initialized = false;
        }
      } catch (error) {
        // Context is broken - mark for recreation
        this.audioContext = null;
        this.initialized = false;
      }
    }, 2000); // Check every 2 seconds
  }

  private stopHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  private async preloadSounds(onProgress?: (progress: number) => void): Promise<void> {
    if (!this.audioContext) return;

    const soundFiles = [
      { type: SoundType.SUCCESS, url: '/assets/sounds/success.mp3' },
      { type: SoundType.MISS, url: '/assets/sounds/miss.mp3' },
    ];

    let loaded = 0;
    const total = soundFiles.length;

    const loadPromises = soundFiles.map(async ({ type, url }) => {
      try {
        // Use fetch with cache control for better performance
        const response = await fetch(url, { cache: 'force-cache' });
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        
        // Wrap decodeAudioData in try-catch to prevent AudioContext errors
        try {
          const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
          this.sounds.set(type, audioBuffer);
          
          loaded++;
          if (onProgress) {
            onProgress(loaded / total);
          }
        } catch (decodeError) {
          // Silently fail - don't log AudioContext decode errors
          // This prevents "AudioContext encountered an error" messages
        }
      } catch (error) {
        // Silently fail - don't log errors to prevent console spam
      }
    });

    await Promise.all(loadPromises);
  }

  private async ensureAudioContext(): Promise<boolean> {
    // If context doesn't exist or is broken, try to recreate it
    if (!this.audioContext || this.audioContext.state === 'closed' || this.audioContext.state === 'interrupted') {
      const created = await this.createAudioContext();
      if (!created) {
        return false;
      }
      // If sounds aren't loaded, load them now
      if (this.sounds.size === 0 && this.audioContext) {
        await this.preloadSounds();
      }
    }

    if (!this.audioContext) return false;

    // Resume audio context if suspended (handles autoplay restrictions)
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        // Can't resume - context might be broken
        this.audioContext = null;
        this.initialized = false;
        return false;
      }
    }

    // Verify context is still valid after resume
    if (!this.audioContext || this.audioContext.state === 'closed' || this.audioContext.state === 'interrupted') {
      return false;
    }

    return this.audioContext.state === 'running';
  }

  play(type: SoundType, options: SoundOptions = {}): void {
    if (this.muted) return;

    // Ensure audio context is running (handles autoplay restrictions and recreates if broken)
    this.ensureAudioContext().then((isRunning) => {
      if (!isRunning || !this.audioContext) {
        return; // Context not available - silently fail
      }

      const buffer = this.sounds.get(type);
      if (!buffer) {
        return; // Buffer not loaded - silently fail
      }

      // Limit concurrent sounds using audio pooling
      if (this.activeSources.size >= this.maxConcurrentSounds) {
        // Find oldest sound of the same type to replace
        const oldestId = Array.from(this.activeSources.keys())
          .find(id => id.startsWith(type));
        
        if (oldestId) {
          const oldSource = this.activeSources.get(oldestId);
          if (oldSource) {
            try {
              oldSource.stop();
            } catch (error) {
              // Source already stopped or invalid
            }
            this.activeSources.delete(oldestId);
          }
        } else {
          // If no sound of same type and at limit, just return
          return;
        }
      }

      // Create unique ID for this sound instance
      const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      try {
        // Double-check context state before creating audio nodes
        if (this.audioContext.state !== 'running' && this.audioContext.state !== 'suspended') {
          // Context is broken - mark for recreation
          this.audioContext = null;
          this.initialized = false;
          return;
        }

        // Create audio nodes
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;

        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = options.volume ?? 1;

        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        source.loop = options.loop ?? false;

        // Store the source for potential cleanup
        this.activeSources.set(id, source);

        // Remove from active sources when complete
        source.onended = () => {
          this.activeSources.delete(id);
        };

        // Start playback with error handling
        try {
          source.start(0);
          this.initialized = true; // Mark as initialized on successful play
        } catch (startError) {
          // Start failed - context might be broken
          this.activeSources.delete(id);
          // Mark context as broken so it gets recreated
          this.audioContext = null;
          this.initialized = false;
        }
      } catch (error) {
        // Audio operation failed - context might be broken
        // Mark context as broken so it gets recreated
        this.audioContext = null;
        this.initialized = false;
      }
    }).catch(() => {
      // Promise rejection - context unavailable
    });
  }

  // Stop all sounds of a specific type
  stopByType(type: SoundType): void {
    const keysToDelete: string[] = [];
    this.activeSources.forEach((source, id) => {
      if (id.startsWith(type)) {
        try {
          source.stop();
        } catch (error) {
          // Source already stopped or invalid
        }
        keysToDelete.push(id);
      }
    });
    keysToDelete.forEach(id => this.activeSources.delete(id));
  }

  // Stop all sounds
  stopAll(): void {
    this.activeSources.forEach((source) => {
      try {
        source.stop();
      } catch (error) {
        // Source already stopped or invalid
      }
    });
    this.activeSources.clear();
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    this.saveMutePreference();
    return this.muted;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.saveMutePreference();
  }

  isMuted(): boolean {
    return this.muted;
  }

  private saveMutePreference(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('soundMuted', this.muted.toString());
    } catch (error) {
      console.warn('Could not save sound preference to localStorage:', error);
    }
  }

  // Method to check if audio is supported
  isAudioSupported(): boolean {
    return typeof window !== 'undefined' && !!(window.AudioContext || (window as any).webkitAudioContext);
  }

  // Method to get initialization status
  isInitialized(): boolean {
    return this.initialized;
  }

  // Method to handle user interaction to unlock audio (for browser compatibility)
  async unlockAudio(): Promise<boolean> {
    if (!this.audioContext) {
      // Try to create audio context if it doesn't exist
      const created = await this.createAudioContext();
      if (!created) {
        return false;
      }
    }

    if (!this.audioContext) return false;

    try {
      // Resume audio context if suspended (handles autoplay restrictions)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // If sounds aren't loaded yet, load them now
      if (this.sounds.size === 0) {
        await this.preloadSounds();
      }
      
      this.initialized = true;
      return this.audioContext.state === 'running';
    } catch (error) {
      console.warn('Could not unlock audio context:', error);
      return false;
    }
  }

  // Cleanup method to properly close audio context
  cleanup(): void {
    this.stopHealthCheck();

    // Stop all active sounds
    this.stopAll();

    // Remove user interaction listener
    if (this.userInteractionListener) {
      document.removeEventListener('click', this.userInteractionListener);
      document.removeEventListener('touchstart', this.userInteractionListener);
      document.removeEventListener('keydown', this.userInteractionListener);
      this.userInteractionListener = null;
    }

    // Close audio context if it exists
    if (this.audioContext) {
      try {
        if (this.audioContext.state !== 'closed') {
          this.audioContext.close();
        }
      } catch (error) {
        // Ignore errors when closing
      }
      this.audioContext = null;
    }

    this.initialized = false;
    this.initializationAttempted = false;
    this.sounds.clear();
    this.activeSources.clear();
  }
}

// Singleton instance
const soundManager = new SoundManager();
export default soundManager;


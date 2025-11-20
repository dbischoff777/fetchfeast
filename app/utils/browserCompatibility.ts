"use client";

/**
 * Browser Compatibility Utility
 * Provides feature detection and browser-specific handling
 */

export interface BrowserInfo {
  name: string;
  version: string;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isEdge: boolean;
  supportsWebAudio: boolean;
  supportsLocalStorage: boolean;
  supportsTouch: boolean;
}

/**
 * Detect browser information
 */
export const getBrowserInfo = (): BrowserInfo => {
  if (typeof window === 'undefined') {
    return {
      name: 'unknown',
      version: '0',
      isMobile: false,
      isIOS: false,
      isAndroid: false,
      isSafari: false,
      isChrome: false,
      isFirefox: false,
      isEdge: false,
      supportsWebAudio: false,
      supportsLocalStorage: false,
      supportsTouch: false,
    };
  }

  const ua = navigator.userAgent;
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  const isAndroid = /Android/.test(ua);

  // Browser detection
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua) || isIOS;
  const isChrome = /Chrome/.test(ua) && !/Edg/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  const isEdge = /Edg/.test(ua);

  // Extract version (simplified)
  const versionMatch = ua.match(/(?:Chrome|Safari|Firefox|Edge)\/(\d+)/);
  const version = versionMatch ? versionMatch[1] : '0';

  // Feature detection
  const supportsWebAudio = !!(window.AudioContext || (window as any).webkitAudioContext);
  const supportsLocalStorage = (() => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  })();
  const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Determine browser name
  let browserName = 'unknown';
  if (isChrome) browserName = 'Chrome';
  else if (isSafari) browserName = 'Safari';
  else if (isFirefox) browserName = 'Firefox';
  else if (isEdge) browserName = 'Edge';

  return {
    name: browserName,
    version,
    isMobile,
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    isFirefox,
    isEdge,
    supportsWebAudio,
    supportsLocalStorage,
    supportsTouch,
  };
};

/**
 * Check if Web Audio API is supported
 */
export const isWebAudioSupported = (): boolean => {
  return !!(typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext));
};

/**
 * Check if localStorage is available
 */
export const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get browser-specific recommendations
 */
export const getBrowserRecommendations = (): string[] => {
  const info = getBrowserInfo();
  const recommendations: string[] = [];

  if (!info.supportsWebAudio) {
    recommendations.push('Web Audio API is not supported. Audio features will be disabled.');
  }

  if (!info.supportsLocalStorage) {
    recommendations.push('localStorage is not available. Preferences will not be saved.');
  }

  if (info.isIOS && info.isSafari) {
    recommendations.push('iOS Safari: Audio requires user interaction to play.');
  }

  if (info.isAndroid && info.isChrome) {
    recommendations.push('Android Chrome: Audio autoplay may be restricted.');
  }

  return recommendations;
};

/**
 * Log browser compatibility information (development only)
 */
export const logBrowserCompatibility = (): void => {
  if (process.env.NODE_ENV !== 'development') return;

  const info = getBrowserInfo();
  const recommendations = getBrowserRecommendations();

  console.group('🌐 Browser Compatibility Info');
  console.log('Browser:', `${info.name} ${info.version}`);
  console.log('Platform:', info.isMobile ? 'Mobile' : 'Desktop');
  console.log('OS:', info.isIOS ? 'iOS' : info.isAndroid ? 'Android' : 'Other');
  console.log('Features:');
  console.log('  - Web Audio API:', info.supportsWebAudio ? '✅' : '❌');
  console.log('  - localStorage:', info.supportsLocalStorage ? '✅' : '❌');
  console.log('  - Touch Support:', info.supportsTouch ? '✅' : '❌');
  
  if (recommendations.length > 0) {
    console.warn('Recommendations:');
    recommendations.forEach(rec => console.warn('  -', rec));
  }
  
  console.groupEnd();
};

/**
 * Browser compatibility testing checklist
 * This is a reference for manual testing
 */
export const BROWSER_TESTING_CHECKLIST = {
  desktop: {
    chrome: {
      name: 'Chrome (Latest)',
      tests: [
        'Audio plays after user interaction',
        'Sound toggle works correctly',
        'Animations are smooth (60fps)',
        'Touch simulation works',
        'localStorage persists preferences',
      ],
    },
    safari: {
      name: 'Safari (Latest)',
      tests: [
        'Audio plays after user interaction',
        'Sound toggle works correctly',
        'Animations are smooth (60fps)',
        'WebkitAudioContext fallback works',
        'localStorage persists preferences',
      ],
    },
    firefox: {
      name: 'Firefox (Latest)',
      tests: [
        'Audio plays after user interaction',
        'Sound toggle works correctly',
        'Animations are smooth (60fps)',
        'localStorage persists preferences',
      ],
    },
    edge: {
      name: 'Edge (Latest)',
      tests: [
        'Audio plays after user interaction',
        'Sound toggle works correctly',
        'Animations are smooth (60fps)',
        'localStorage persists preferences',
      ],
    },
  },
  mobile: {
    iosSafari: {
      name: 'iOS Safari',
      tests: [
        'Audio plays after user interaction',
        'Sound toggle works correctly',
        'Touch interactions work smoothly',
        'No scrolling during gameplay',
        'Safe area insets work correctly',
        'Animations are smooth (60fps)',
        'localStorage persists preferences',
      ],
    },
    androidChrome: {
      name: 'Android Chrome',
      tests: [
        'Audio plays after user interaction',
        'Sound toggle works correctly',
        'Touch interactions work smoothly',
        'No scrolling during gameplay',
        'Animations are smooth (60fps)',
        'localStorage persists preferences',
      ],
    },
  },
  edgeCases: {
    privateBrowsing: {
      name: 'Private/Incognito Mode',
      tests: [
        'Game works without localStorage',
        'Audio still works',
        'Preferences reset on page reload',
      ],
    },
    autoplayBlocked: {
      name: 'Autoplay Blocked',
      tests: [
        'Game works without audio',
        'User can enable audio via toggle',
        'Audio works after user interaction',
      ],
    },
    noAudioSupport: {
      name: 'No Audio Support',
      tests: [
        'Game is fully playable',
        'Visual feedback works',
        'No errors in console',
      ],
    },
  },
};


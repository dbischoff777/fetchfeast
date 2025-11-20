// Enhanced FPS monitoring with warnings
export const setupFPSMonitoring = (): (() => number) => {
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 0;
  let lowFpsCount = 0;
  const LOW_FPS_THRESHOLD = 55; // Warn if FPS drops below 55

  const countFrame = () => {
    frameCount++;
    const now = performance.now();
    const delta = now - lastTime;

    if (delta >= 1000) {
      fps = Math.round((frameCount * 1000) / delta);
      frameCount = 0;
      lastTime = now;

      // Log warning if FPS is consistently low (only in development)
      if (process.env.NODE_ENV === "development") {
        if (fps < LOW_FPS_THRESHOLD) {
          lowFpsCount++;
          if (lowFpsCount >= 3) {
            // Only warn after 3 consecutive low FPS readings
            console.warn(`Low FPS detected: ${fps} fps (target: 60 fps)`);
            lowFpsCount = 0; // Reset counter after warning
          }
        } else {
          lowFpsCount = 0; // Reset counter if FPS is good
        }
      }
    }

    requestAnimationFrame(countFrame);
  };

  requestAnimationFrame(countFrame);

  return () => fps;
};

// Touch response time monitoring
export const measureTouchResponseTime = (): (() => void) => {
  let touchStartTime = 0;
  const MAX_REASONABLE_RESPONSE_TIME = 5000; // 5 seconds max - anything beyond is likely a calculation error

  const handleTouchStart = () => {
    touchStartTime = performance.now();
  };

  const handleTouchEnd = () => {
    // Only calculate if we have a valid touchStartTime
    if (touchStartTime === 0) {
      return; // No corresponding touchstart - ignore this touchend
    }

    const responseTime = performance.now() - touchStartTime;

    // Reset touchStartTime after calculation
    touchStartTime = 0;

    // Ignore unreasonably large values (likely calculation errors)
    if (responseTime > MAX_REASONABLE_RESPONSE_TIME) {
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`Touch response time: ${responseTime.toFixed(2)}ms`);
    }

    // Alert if response time exceeds threshold
    if (responseTime > 100) {
      console.warn(
        `Touch response time exceeded 100ms: ${responseTime.toFixed(2)}ms`
      );
    }
  };

  // Also handle touchcancel to reset the timer
  const handleTouchCancel = () => {
    touchStartTime = 0;
  };

  document.addEventListener("touchstart", handleTouchStart, { passive: true });
  document.addEventListener("touchend", handleTouchEnd, { passive: true });
  document.addEventListener("touchcancel", handleTouchCancel, { passive: true });

  return () => {
    document.removeEventListener("touchstart", handleTouchStart);
    document.removeEventListener("touchend", handleTouchEnd);
    document.removeEventListener("touchcancel", handleTouchCancel);
  };
};

// Performance optimization utilities
export const optimizeAnimations = (element: HTMLElement): (() => void) => {
  // Add will-change to hint browser about animations
  element.style.willChange = "transform";

  // Use transform instead of top/left for better performance
  element.style.transform = "translateZ(0)"; // Force GPU acceleration

  // Clean up function to remove will-change when animation completes
  return () => {
    element.style.willChange = "auto";
  };
};

// Image optimization
export const optimizeImages = () => {
  // Find all images and add loading="lazy" for images not in viewport
  const images = document.querySelectorAll('img:not([loading])');

  images.forEach((img) => {
    if (!img.hasAttribute("priority")) {
      (img as HTMLImageElement).loading = "lazy";
    }
  });
};

// Memory leak detection (simplified version)
export const detectMemoryLeaks = (): (() => void) => {
  if (process.env.NODE_ENV === "development" && "memory" in performance) {
    const memoryInfo = (performance as any).memory;

    const interval = setInterval(() => {
      console.log(
        `Used JS Heap: ${Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024))}MB / ${Math.round(memoryInfo.jsHeapSizeLimit / (1024 * 1024))}MB`
      );
    }, 5000);

    return () => clearInterval(interval);
  }

  return () => {};
};


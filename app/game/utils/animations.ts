// Function to preload animation assets for better performance
export const preloadAnimations = () => {
  // Preload object animations
  for (let i = 1; i <= 5; i++) {
    const img = new Image();
    img.src = `/assets/animations/try/Object_${i}.gif`;
  }

  // Preload firework animations
  for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = `/assets/animations/fireworks/fireworks animated_${i}.gif`;
  }

  // Preload fail animation
  const failImg = new Image();
  failImg.src = "/assets/animations/fail/fail1.gif";
};

// Function to create a pulse animation effect using CSS
export const createPulseAnimation = (
  element: HTMLElement,
  duration: number = 500
) => {
  // Using CSS transitions for better performance
  element.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1.0)`;
  element.style.transform = "scale(1.1)";

  // Reset after animation completes
  setTimeout(() => {
    element.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.1, 0.25, 1.0)`;
    element.style.transform = "scale(1)";
  }, duration);
};


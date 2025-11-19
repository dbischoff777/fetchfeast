// Function to announce messages to screen readers
export const announceToScreenReader = (message: string) => {
  // Create or get the live region element
  let announcer = document.getElementById("screen-reader-announcer");

  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = "screen-reader-announcer";
    announcer.className = "sr-only";
    announcer.setAttribute("aria-live", "assertive");
    announcer.setAttribute("aria-atomic", "true");
    document.body.appendChild(announcer);
  }

  // Update the content to trigger announcement
  announcer.textContent = "";
  // Use setTimeout to ensure the DOM update is processed
  setTimeout(() => {
    if (announcer) {
      announcer.textContent = message;
    }
  }, 100);
};

// Function to improve focus management
export const manageFocus = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
  }
};

// Function to check contrast ratio (placeholder - in production use a library)
export const checkContrastRatio = (
  foreground: string,
  background: string
) => {
  // Simple implementation - in a real app, use a library like color-contrast
  // This is a placeholder for demonstration
  console.log(`Checking contrast between ${foreground} and ${background}`);
  return true;
};

// Function to add keyboard navigation to the game
export const setupKeyboardNavigation = (
  gameContainerRef: React.RefObject<HTMLDivElement | null>,
  handleInteraction: () => void
): (() => void) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Space or Enter to interact with the current game object
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleInteraction();
    }
  };

  if (gameContainerRef.current) {
    gameContainerRef.current.addEventListener("keydown", handleKeyDown);
  }

  return () => {
    if (gameContainerRef.current) {
      gameContainerRef.current.removeEventListener("keydown", handleKeyDown);
    }
  };
};


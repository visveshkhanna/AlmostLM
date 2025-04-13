import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random gradient for UI elements
 */
export function getRandomGradient(): string {
  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 60; // 60-90%
    const lightness = Math.floor(Math.random() * 15) + 15; // 15-30%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Generate colors for gradient
  const color1 = getRandomColor();
  const color2 = getRandomColor();
  const color3 = getRandomColor();

  return `linear-gradient(135deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`;
}

/**
 * Generates a deterministic gradient based on a seed string (like a notebook ID)
 * This ensures consistent gradients between server and client rendering
 */
export function getDeterministicGradient(seed: string): string {
  // Simple hash function for string to number
  const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  // Check if we're in light mode (client-side only)
  const isLightMode =
    typeof document !== "undefined" &&
    !document.documentElement.classList.contains("dark");

  // Generate deterministic color based on seed
  const getColor = (seedModifier: number): string => {
    const hash = hashString(seed + seedModifier);
    const hue = hash % 360;

    if (isLightMode) {
      // Light mode colors - more saturated, deeper colors
      const saturation = (hash % 20) + 70; // 70-90%
      const lightness = (hash % 20) + 40; // 40-60% - darker in light mode for better contrast
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    } else {
      // Dark mode colors - original implementation
      const saturation = (hash % 30) + 60; // 60-90%
      const lightness = (hash % 15) + 15; // 15-30%
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
  };

  // Generate colors for gradient
  const color1 = getColor(1);
  const color2 = getColor(2);
  const color3 = getColor(3);

  return `linear-gradient(135deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`;
}

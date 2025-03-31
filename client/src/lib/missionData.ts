import { StepOption } from "@shared/schema";

// Character avatar placeholders
export const characterAvatars = {
  genesis: {
    name: "Genesis",
    description: "Your friendly guide to the XO~Dy universe!",
    colorClass: "bg-gradient-to-br from-purple-400 to-primary"
  },
  vaultbot: {
    name: "VaultBot",
    description: "Keeper of secrets and magical treasures!",
    colorClass: "bg-gradient-to-br from-emerald-400 to-emerald-600"
  }
};

// Helper functions for mission interaction
export function parseStepOptions(optionsJson: string | any): StepOption[] {
  if (!optionsJson) {
    return [];
  }
  
  // If already an array, return it
  if (Array.isArray(optionsJson)) {
    return optionsJson;
  }
  
  // If it's a string, try to parse it
  if (typeof optionsJson === 'string') {
    try {
      return JSON.parse(optionsJson);
    } catch (error) {
      console.error("Failed to parse step options string:", error);
      return [];
    }
  }
  
  // If it's an object but not an array, it might be a JSON object 
  // that was automatically parsed by the server or API
  if (typeof optionsJson === 'object') {
    try {
      // Convert back to string and parse again to ensure proper format
      return JSON.parse(JSON.stringify(optionsJson));
    } catch (error) {
      console.error("Failed to process step options object:", error);
      return [];
    }
  }
  
  console.error("Unknown options format:", optionsJson);
  return [];
}

export function calculateProgressPercentage(currentStep: number, totalSteps: number): number {
  if (totalSteps <= 0) return 0;
  return Math.min(Math.round((currentStep / totalSteps) * 100), 100);
}

// Animation variants for reuse
export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const staggerChildren = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const bubbleFloat = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

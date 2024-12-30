import { createContext } from 'react';

export interface AccessibilityContextType {
  reduceMotion: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'x-large';
  toggleReduceMotion: () => void;
  toggleHighContrast: () => void;
  setFontSize: (size: 'normal' | 'large' | 'x-large') => void;
}

export const AccessibilityContext = createContext<AccessibilityContextType | null>(null); 
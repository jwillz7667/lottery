import { create } from 'zustand';

interface AccessibilityState {
  reduceMotion: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'x-large';
  toggleReduceMotion: () => void;
  toggleHighContrast: () => void;
  setFontSize: (size: 'normal' | 'large' | 'x-large') => void;
}

export const useAccessibilityStore = create<AccessibilityState>((set) => ({
  reduceMotion: (() => {
    const stored = localStorage.getItem('reduceMotion');
    return stored ? JSON.parse(stored) : window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  })(),

  highContrast: (() => {
    const stored = localStorage.getItem('highContrast');
    return stored ? JSON.parse(stored) : false;
  })(),

  fontSize: (() => {
    const stored = localStorage.getItem('fontSize');
    return (stored as 'normal' | 'large' | 'x-large') || 'normal';
  })(),

  toggleReduceMotion: () => {
    set(state => {
      const newValue = !state.reduceMotion;
      localStorage.setItem('reduceMotion', JSON.stringify(newValue));
      document.body.classList.toggle('reduce-motion', newValue);
      return { reduceMotion: newValue };
    });
  },

  toggleHighContrast: () => {
    set(state => {
      const newValue = !state.highContrast;
      localStorage.setItem('highContrast', JSON.stringify(newValue));
      document.body.classList.toggle('high-contrast', newValue);
      return { highContrast: newValue };
    });
  },

  setFontSize: (size) => {
    set(() => {
      localStorage.setItem('fontSize', size);
      document.body.classList.remove('text-normal', 'text-large', 'text-x-large');
      document.body.classList.add(`text-${size}`);
      return { fontSize: size };
    });
  },
})); 
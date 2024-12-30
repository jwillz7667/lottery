import React, { ReactNode } from 'react';
import { useAccessibilityStore } from './accessibilityStore';
import { AccessibilityContext } from './accessibilityTypes';

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const {
    reduceMotion,
    highContrast,
    fontSize,
    toggleReduceMotion,
    toggleHighContrast,
    setFontSize,
  } = useAccessibilityStore();

  return (
    <AccessibilityContext.Provider
      value={{
        reduceMotion,
        highContrast,
        fontSize,
        toggleReduceMotion,
        toggleHighContrast,
        setFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
} 
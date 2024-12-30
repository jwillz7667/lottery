import { useContext } from 'react';
import { AccessibilityContext, AccessibilityContextType } from '../context/accessibilityTypes';

export function useAccessibility(): AccessibilityContextType {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
} 
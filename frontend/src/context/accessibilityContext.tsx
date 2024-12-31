import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AccessibilityContextType {
    reduceMotion: boolean;
    highContrast: boolean;
    fontSize: 'normal' | 'large' | 'x-large';
    toggleReduceMotion: () => void;
    toggleHighContrast: () => void;
    setFontSize: (size: 'normal' | 'large' | 'x-large') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [reduceMotion, setReduceMotion] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [fontSize, setFontSize] = useState<'normal' | 'large' | 'x-large'>('normal');

    const toggleReduceMotion = () => {
        setReduceMotion(prev => !prev);
    };

    const toggleHighContrast = () => {
        setHighContrast(prev => !prev);
    };

    return (
        <AccessibilityContext.Provider
            value={{
                reduceMotion,
                highContrast,
                fontSize,
                toggleReduceMotion,
                toggleHighContrast,
                setFontSize
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
}; 
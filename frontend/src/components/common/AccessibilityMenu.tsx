import React from 'react';
import { Menu } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useAccessibility } from '../../context/accessibilityContext';
import { classNames } from '../../utils/styles';

export const AccessibilityMenu: React.FC = () => {
  const {
    reduceMotion,
    highContrast,
    fontSize,
    toggleReduceMotion,
    toggleHighContrast,
    setFontSize
  } = useAccessibility();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className="rounded-full p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Accessibility options"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </Menu.Button>

      <Menu.Items
        as={motion.div}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div className="p-2 space-y-1">
          {/* Reduce Motion */}
          <Menu.Item>
            <button
              className={classNames(
                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                'focus:outline-none focus:bg-gray-100'
              )}
              onClick={toggleReduceMotion}
              role="switch"
              aria-checked={reduceMotion}
            >
              <span className="flex-grow">Reduce Motion</span>
              <span
                className={classNames(
                  'ml-3 inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ease-in-out duration-200',
                  reduceMotion ? 'bg-indigo-600' : 'bg-gray-200'
                )}
              >
                <span
                  className={classNames(
                    'inline-block h-4 w-4 rounded-full bg-white shadow transform transition ease-in-out duration-200',
                    reduceMotion ? 'translate-x-4' : 'translate-x-1'
                  )}
                />
              </span>
            </button>
          </Menu.Item>

          {/* High Contrast */}
          <Menu.Item>
            <button
              className={classNames(
                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                'focus:outline-none focus:bg-gray-100'
              )}
              onClick={toggleHighContrast}
              role="switch"
              aria-checked={highContrast}
            >
              <span className="flex-grow">High Contrast</span>
              <span
                className={classNames(
                  'ml-3 inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ease-in-out duration-200',
                  highContrast ? 'bg-indigo-600' : 'bg-gray-200'
                )}
              >
                <span
                  className={classNames(
                    'inline-block h-4 w-4 rounded-full bg-white shadow transform transition ease-in-out duration-200',
                    highContrast ? 'translate-x-4' : 'translate-x-1'
                  )}
                />
              </span>
            </button>
          </Menu.Item>

          {/* Font Size */}
          <div className="px-2 py-2">
            <p className="text-xs font-medium text-gray-500 mb-2">Font Size</p>
            <div className="flex gap-2">
              {(['normal', 'large', 'x-large'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={classNames(
                    'px-2 py-1 rounded text-sm',
                    fontSize === size
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                  aria-current={fontSize === size}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Menu.Items>
    </Menu>
  );
}; 
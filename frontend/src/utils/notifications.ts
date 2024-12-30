import toast from 'react-hot-toast';

interface NotificationOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

const defaultOptions: NotificationOptions = {
  duration: 3000,
  position: 'top-right',
};

export const notify = {
  success: (message: string, options?: NotificationOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },
  
  error: (message: string, options?: NotificationOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  },
  
  warning: (message: string, options?: NotificationOptions) => {
    toast(message, {
      ...defaultOptions,
      ...options,
      icon: '⚠️',
    });
  },
  
  info: (message: string, options?: NotificationOptions) => {
    toast(message, {
      ...defaultOptions,
      ...options,
      icon: 'ℹ️',
    });
  },
}; 
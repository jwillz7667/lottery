import { Link } from 'react-router-dom';

interface ButtonProps {
    children: React.ReactNode;
    to?: string;
    onClick?: () => void;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
}

export const Button = ({ 
    children, 
    to, 
    onClick, 
    disabled = false,
    fullWidth = false,
    className = ''
}: ButtonProps) => {
    const baseClasses = `
        inline-flex items-center justify-center px-4 py-2
        border border-transparent text-sm font-medium rounded-md
        text-white bg-indigo-600 hover:bg-indigo-700
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${fullWidth ? 'w-full' : ''}
        ${className}
    `;

    if (to) {
        return (
            <Link to={to} className={baseClasses}>
                {children}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={baseClasses}
        >
            {children}
        </button>
    );
}; 
import React, { ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  outlined?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  animation?: 'none' | 'bounce' | 'pulse';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  outlined = false,
  loading = false,
  disabled = false,
  icon,
  animation = 'none',
  className = '',
  ...rest
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 relative z-10';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: outlined
      ? 'border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900'
      : 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700',
    secondary: outlined
      ? 'border border-secondary-500 text-secondary-500 hover:bg-secondary-50 focus:ring-secondary-500 dark:border-secondary-400 dark:text-secondary-400 dark:hover:bg-secondary-900'
      : 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 dark:bg-secondary-600 dark:hover:bg-secondary-700',
    success: outlined
      ? 'border border-green-500 text-green-500 hover:bg-green-50 focus:ring-green-500 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900'
      : 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-700',
    danger: outlined
      ? 'border border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-500 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900'
      : 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 dark:bg-red-600 dark:hover:bg-red-700',
    warning: outlined
      ? 'border border-yellow-500 text-yellow-500 hover:bg-yellow-50 focus:ring-yellow-500 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-900'
      : 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700',
    info: outlined
      ? 'border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900'
      : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700',
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled classes
  const disabledClasses = (disabled || loading) 
    ? 'opacity-60 cursor-not-allowed'
    : 'hover:shadow-md active:shadow-sm cursor-pointer';
  
  // Animation props
  const animationProps: Record<string, any> = {
    none: {},
    bounce: {
      whileTap: { scale: 0.95 },
      whileHover: { y: -2 },
    },
    pulse: {
      whileHover: { 
        scale: 1.05,
        transition: { duration: 0.3, repeat: Infinity, repeatType: 'reverse' }
      },
    },
  };

  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${widthClasses}
    ${disabledClasses}
    ${className}
  `;

  if (animation === 'none') {
    return (
      <button
        className={buttonClasses}
        disabled={disabled || loading}
        style={{ pointerEvents: 'auto' }}
        {...rest}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        
        {icon && !loading && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }

  // Extract motion-specific props
  const animProps = animationProps[animation] || {};
  const { whileHover, whileTap, ...otherAnimProps } = animProps;
  
  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || loading}
      whileHover={whileHover}
      whileTap={whileTap}
      style={{ pointerEvents: 'auto' }}
      {...otherAnimProps as any}
      {...(rest as Omit<HTMLMotionProps<"button">, keyof typeof animationProps[typeof animation]>)}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button; 
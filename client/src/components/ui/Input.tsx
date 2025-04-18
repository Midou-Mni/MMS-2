import React, { InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className = '',
  id,
  ...rest
}) => {
  // Generate a random ID if none is provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base classes
  const baseClasses = 'block w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500';
  
  // Size classes
  const sizeClasses = {
    sm: 'py-1.5 text-sm',
    md: 'py-2 text-base',
    lg: 'py-3 text-lg',
  };
  
  // Padding classes based on icons
  const paddingClasses = {
    left: leftIcon ? 'pl-10' : 'pl-3',
    right: rightIcon ? 'pr-10' : 'pr-3',
  };
  
  // Variant classes
  const variantClasses = {
    default: 'border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500',
    filled: 'border-0 bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500 focus:bg-secondary-50 dark:focus:bg-secondary-600',
    outlined: 'bg-transparent border border-secondary-300 dark:border-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500',
  };
  
  // Error classes
  const errorClasses = error 
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-600 dark:focus:ring-red-600 dark:focus:border-red-600'
    : '';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const inputClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${paddingClasses.left} ${paddingClasses.right}
    ${variantClasses[variant]}
    ${errorClasses}
    ${widthClasses}
    ${className}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-1`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-secondary-500 dark:text-secondary-400 sm:text-sm">
              {leftIcon}
            </span>
          </div>
        )}
        
        <input
          id={inputId}
          className={inputClasses}
          {...rest}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-secondary-500 dark:text-secondary-400 sm:text-sm">
              {rightIcon}
            </span>
          </div>
        )}
      </div>
      
      {hint && !error && (
        <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
          {hint}
        </p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input; 
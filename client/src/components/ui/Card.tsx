import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  className?: string;
  animation?: 'none' | 'fade' | 'slide' | 'zoom';
  bordered?: boolean;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  animation = 'none',
  bordered = false,
  elevation = 'md',
  hover = false,
}) => {
  // Base classes
  const baseClasses = 'overflow-hidden rounded-lg bg-white dark:bg-secondary-800';
  
  // Border classes
  const borderClasses = bordered
    ? 'border border-secondary-200 dark:border-secondary-700'
    : '';
  
  // Elevation classes
  const elevationClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  
  // Hover effect
  const hoverClasses = hover 
    ? 'transition-all duration-300 ease-in-out hover:shadow-lg dark:hover:shadow-secondary-700/20'
    : '';
  
  // Animation variants
  const variants = {
    none: {},
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.5 } },
    },
    slide: {
      hidden: { x: -30, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    },
    zoom: {
      hidden: { scale: 0.9, opacity: 0 },
      visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    },
  };
  
  // Combined classes
  const cardClasses = `
    ${baseClasses}
    ${borderClasses}
    ${elevationClasses[elevation]}
    ${hoverClasses}
    ${className}
  `;

  const CardComponent = animation === 'none' ? (
    <div className={cardClasses}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
          {title && (
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-3 bg-secondary-50 dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700">
          {footer}
        </div>
      )}
    </div>
  ) : (
    <motion.div
      className={cardClasses}
      initial="hidden"
      animate="visible"
      variants={variants[animation]}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-secondary-200 dark:border-secondary-700">
          {title && (
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && (
        <div className="px-6 py-3 bg-secondary-50 dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-700">
          {footer}
        </div>
      )}
    </motion.div>
  );

  return CardComponent;
};

export default Card; 
import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-lg hover:shadow-primary/25",
    secondary: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50 shadow-lg hover:shadow-secondary/25",
    accent: "bg-accent text-black hover:bg-accent/90 focus:ring-accent/50 shadow-lg hover:shadow-accent/25",
outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
    ghost: "text-gray-300 dark:text-gray-300 text-light-text-secondary hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-200 hover:text-white dark:hover:text-white hover:text-light-text-primary focus:ring-gray-500/50",
    success: "bg-success text-white hover:bg-success/90 focus:ring-success/50",
    danger: "bg-error text-white hover:bg-error/90 focus:ring-error/50"
  };
  
  const sizes = {
    small: "px-3 py-2 text-sm h-9",
    medium: "px-4 py-2.5 text-base h-11",
    large: "px-6 py-3 text-lg h-14",
    xl: "px-8 py-4 text-xl h-16"
  };
  
  const iconSizes = {
    small: 16,
    medium: 18,
    large: 20,
    xl: 24
  };

  const isDisabled = disabled || loading;

  const buttonProps = {
    className: `${baseClasses} ${variants[variant]} ${sizes[size]} ${
      isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    } ${className}`,
    onClick: isDisabled ? undefined : onClick,
    disabled: isDisabled,
    ...props
  };

  const content = (
    <>
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSizes[size]} 
          className="animate-spin mr-2" 
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className={children ? 'mr-2' : ''} 
        />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className={children ? 'ml-2' : ''} 
        />
      )}
    </>
  );

  return (
    <motion.button
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      {...buttonProps}
    >
      {content}
    </motion.button>
  );
};

export default Button;
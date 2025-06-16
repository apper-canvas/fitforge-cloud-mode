import React from 'react';

const Text = ({ 
  as: Component = 'p', 
  variant = 'body', 
  size = 'base',
  weight = 'normal',
  color = 'default',
  className = '', 
  children, 
  ...props 
}) => {
  const variants = {
    heading: 'font-display',
    subheading: 'font-sans font-medium',
    body: 'font-sans',
    caption: 'font-sans text-sm',
    overline: 'font-sans text-xs uppercase tracking-wide'
  };

  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl'
  };

  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  const colors = {
    default: 'text-white',
    muted: 'text-gray-400',
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info'
  };

  const classes = `${variants[variant]} ${sizes[size]} ${weights[weight]} ${colors[color]} ${className}`;

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Text;
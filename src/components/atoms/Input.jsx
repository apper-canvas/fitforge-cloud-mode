import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  error,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = "w-full px-4 py-3 bg-surface border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-200";
  
  const errorClasses = error ? "border-error focus:border-error focus:ring-error/20" : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <ApperIcon name={icon} size={20} className="text-gray-400" />
        </div>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${baseClasses} ${errorClasses} ${disabledClasses} ${
          icon ? 'pl-11' : ''
        } ${className}`}
        {...props}
      />
      
      {error && (
        <div className="mt-1 flex items-center text-error text-sm">
          <ApperIcon name="AlertCircle" size={16} className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;
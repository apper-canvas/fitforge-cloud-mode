import React from 'react';
import { motion } from 'framer-motion';
import Text from '@/components/atoms/Text';

const ProgressRing = ({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8,
  color = 'primary',
  showPercentage = true,
  label,
  children,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const colors = {
    primary: '#FF6B35',
    secondary: '#004E89',
    accent: '#00D9FF',
    success: '#00C896',
    warning: '#FFB700',
    error: '#FF3E3E'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#374151"
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}  
            r={radius}
            fill="transparent"
            stroke={colors[color]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children || (
            showPercentage && (
              <Text variant="heading" size="2xl" weight="bold">
                {Math.round(progress)}%
              </Text>
            )
          )}
        </div>
      </div>
      
      {label && (
        <Text size="sm" color="muted" className="mt-2 text-center break-words">
          {label}
        </Text>
      )}
    </div>
  );
};

export default ProgressRing;
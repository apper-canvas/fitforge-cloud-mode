import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const StatCard = ({ 
  icon, 
  label, 
  value, 
  unit = '',
  trend,
  trendValue,
  color = 'primary',
  loading = false,
  className = ''
}) => {
  const colorClasses = {
    primary: 'text-primary border-primary/20',
    secondary: 'text-secondary border-secondary/20',
    accent: 'text-accent border-accent/20',
    success: 'text-success border-success/20',
    warning: 'text-warning border-warning/20',
    error: 'text-error border-error/20'
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-gray-400'
  };

  const trendIcons = {
    up: 'TrendingUp',
    down: 'TrendingDown',
    neutral: 'Minus'
  };

  if (loading) {
    return (
      <div className={`bg-surface rounded-2xl p-6 border border-gray-700 ${className}`}>
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-gray-600 rounded-lg mb-4"></div>
          <div className="w-20 h-6 bg-gray-600 rounded mb-2"></div>
          <div className="w-16 h-4 bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-surface rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gray-800 ${colorClasses[color]}`}>
          <ApperIcon name={icon} size={24} />
        </div>
        
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 ${trendColors[trend]}`}>
            <ApperIcon name={trendIcons[trend]} size={16} />
            <Text size="sm" className={trendColors[trend]}>
              {trendValue}
            </Text>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <Text variant="heading" size="3xl" weight="bold" className="break-words">
          {value}
          {unit && (
            <Text as="span" size="lg" color="muted" className="ml-1">
              {unit}
            </Text>
          )}
        </Text>
        
        <Text color="muted" size="sm" className="break-words">
          {label}
        </Text>
      </div>
    </motion.div>
  );
};

export default StatCard;
import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const ExerciseCard = ({ 
  exercise, 
  onStart, 
  onEdit,
  showStartButton = true,
  completed = false,
  className = ''
}) => {
  const { name, sets, reps, weight, restTime, category } = exercise;
  
  const categoryIcons = {
    chest: 'Dumbbell',
    back: 'ArrowUp',
    legs: 'Activity',
    shoulders: 'Triangle',
    arms: 'Zap',
    core: 'Target',
    cardio: 'Heart'
  };

  const categoryColors = {
    chest: 'text-primary',
    back: 'text-secondary',
    legs: 'text-accent',
    shoulders: 'text-warning',
    arms: 'text-success',
    core: 'text-info',
    cardio: 'text-error'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 ${
        completed ? 'opacity-75' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-gray-800 ${categoryColors[category] || 'text-gray-400'}`}>
            <ApperIcon name={categoryIcons[category] || 'Dumbbell'} size={20} />
          </div>
          
          <div>
            <Text variant="subheading" size="lg" weight="semibold" className="break-words">
              {name}
            </Text>
            {completed && (
              <div className="flex items-center space-x-1 mt-1">
                <ApperIcon name="CheckCircle" size={16} className="text-success" />
                <Text size="sm" color="success">Completed</Text>
              </div>
            )}
          </div>
        </div>
        
        {onEdit && (
          <Button
            variant="ghost"
            size="small"
            icon="Edit3"
            onClick={() => onEdit(exercise)}
            className="opacity-60 hover:opacity-100"
          />
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <Text variant="heading" size="2xl" weight="bold" color="primary">
            {sets}
          </Text>
          <Text size="sm" color="muted">Sets</Text>
        </div>
        
        <div className="text-center">
          <Text variant="heading" size="2xl" weight="bold" color="accent">
            {reps}
          </Text>
          <Text size="sm" color="muted">Reps</Text>
        </div>
        
        {weight > 0 && (
          <div className="text-center">
            <Text variant="heading" size="2xl" weight="bold" color="secondary">
              {weight}
            </Text>
            <Text size="sm" color="muted">lbs</Text>
          </div>
        )}
        
        <div className="text-center">
          <Text variant="heading" size="2xl" weight="bold" color="warning">
            {Math.floor(restTime / 60)}:{(restTime % 60).toString().padStart(2, '0')}
          </Text>
          <Text size="sm" color="muted">Rest</Text>
        </div>
      </div>
      
      {showStartButton && !completed && onStart && (
        <Button
          variant="primary"
          size="large"
          icon="Play"
          onClick={() => onStart(exercise)}
          className="w-full"
        >
          Start Exercise
        </Button>
      )}
    </motion.div>
  );
};

export default ExerciseCard;
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const WorkoutHeader = ({ 
  workout,
  currentExerciseIndex = 0,
  totalExercises = 0,
  duration = 0,
  onEndWorkout,
  showProgress = true,
  className = ''
}) => {
  const navigate = useNavigate();
  
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalExercises > 0 ? ((currentExerciseIndex + 1) / totalExercises) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-b-2xl p-6 border-b border-gray-700 ${className}`}
    >
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="medium"
          icon="ArrowLeft"
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white"
        />
        
        <div className="text-center">
          <Text variant="subheading" size="lg" weight="semibold">
            {workout?.type?.toUpperCase() || 'WORKOUT'}
          </Text>
          <Text size="sm" color="muted">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>
        </div>
        
        {onEndWorkout && (
          <Button
            variant="outline"
            size="medium"
            icon="Square"
            onClick={onEndWorkout}
            className="text-error border-error hover:bg-error hover:text-white"
          />
        )}
      </div>
      
      {/* Workout Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <Text variant="heading" size="2xl" weight="bold" color="primary">
            {formatDuration(duration)}
          </Text>
          <Text size="sm" color="muted">Duration</Text>
        </div>
        
        <div className="text-center">
          <Text variant="heading" size="2xl" weight="bold" color="accent">
            {currentExerciseIndex + 1}/{totalExercises}
          </Text>
          <Text size="sm" color="muted">Exercise</Text>
        </div>
        
        <div className="text-center">
          <Text variant="heading" size="2xl" weight="bold" color="secondary">
            {workout?.exercises?.length || 0}
          </Text>
          <Text size="sm" color="muted">Total</Text>
        </div>
      </div>
      
      {/* Progress Bar */}
      {showProgress && totalExercises > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Text size="sm" color="muted">Progress</Text>
            <Text size="sm" color="primary" weight="semibold">
              {Math.round(progress)}%
            </Text>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WorkoutHeader;
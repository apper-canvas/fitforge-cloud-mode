import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import ProgressRing from './ProgressRing';

const Timer = ({ 
  duration = 180, 
  onComplete, 
  onSkip,
  autoStart = false,
  title = "Rest Timer",
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            if (onComplete) onComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onComplete]);

  const handleStart = () => {
    setIsRunning(true);
    setIsCompleted(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const handleSkip = () => {
    setTimeLeft(0);
    setIsRunning(false);
    setIsCompleted(true);
    if (onSkip) onSkip();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-surface rounded-2xl p-8 border border-gray-700 text-center ${className}`}
    >
      <Text variant="subheading" size="lg" color="muted" className="mb-6">
        {title}
      </Text>
      
      <div className="flex justify-center mb-8">
        <ProgressRing
          progress={progress}
          size={160}
          strokeWidth={12}
          color={isCompleted ? 'success' : 'primary'}
          showPercentage={false}
        >
          <Text variant="heading" size="4xl" weight="bold" className={isCompleted ? 'text-success' : ''}>
            {formatTime(timeLeft)}
          </Text>
        </ProgressRing>
      </div>
      
      {isCompleted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center space-x-2 text-success">
            <ApperIcon name="CheckCircle" size={24} />
            <Text size="lg" weight="semibold" color="success">
              Rest Complete!
            </Text>
          </div>
          
          <Button
            variant="success"
            size="large"
            icon="Play"
            onClick={handleReset}
            className="w-full"
          >
            Start Next Set
          </Button>
        </motion.div>
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <Button
                variant="primary"
                size="large"
                icon="Play"
                onClick={handleStart}
              >
                Start
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="large"
                icon="Pause"
                onClick={handlePause}
              >
                Pause
              </Button>
            )}
            
            <Button
              variant="outline"
              size="large"
              icon="RotateCcw"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="medium"
            icon="FastForward"
            onClick={handleSkip}
            className="text-gray-400 hover:text-white"
          >
            Skip Rest
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default Timer;
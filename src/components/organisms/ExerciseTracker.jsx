import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Timer from '@/components/molecules/Timer';
import { toast } from 'react-toastify';

const ExerciseTracker = ({ 
  exercise,
  onSetComplete,
  onExerciseComplete,
  onNext,
  className = ''
}) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [reps, setReps] = useState(exercise.reps);
  const [weight, setWeight] = useState(exercise.weight);
  const [completedSets, setCompletedSets] = useState([]);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSetComplete = () => {
    const setData = {
      setNumber: currentSet,
      reps: parseInt(reps) || 0,
      weight: parseFloat(weight) || 0,
      timestamp: new Date().toISOString()
    };

    const newCompletedSets = [...completedSets, setData];
    setCompletedSets(newCompletedSets);
    
    if (onSetComplete) {
      onSetComplete(setData);
    }

    toast.success(`Set ${currentSet} completed!`);

    if (currentSet >= exercise.sets) {
      // Exercise completed
      setIsCompleted(true);
      if (onExerciseComplete) {
        onExerciseComplete({
          exercise,
          sets: newCompletedSets
        });
      }
      toast.success(`${exercise.name} completed! 🎉`);
    } else {
      // Show rest timer and prepare for next set
      setShowRestTimer(true);
    }
  };

  const handleRestComplete = () => {
    setShowRestTimer(false);
    setCurrentSet(prev => prev + 1);
    // Reset to suggested values for next set
    setReps(exercise.reps);
    setWeight(weight); // Keep the same weight
  };

  const handleSkipRest = () => {
    setShowRestTimer(false);
    setCurrentSet(prev => prev + 1);
  };

  const adjustWeight = (delta) => {
    setWeight(prev => Math.max(0, (parseFloat(prev) || 0) + delta));
  };

  const adjustReps = (delta) => {
    setReps(prev => Math.max(0, (parseInt(prev) || 0) + delta));
  };

  if (showRestTimer) {
    return (
      <Timer
        duration={exercise.restTime}
        onComplete={handleRestComplete}
        onSkip={handleSkipRest}
        title={`Rest Before Set ${currentSet + 1}`}
        autoStart={true}
        className={className}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-2xl p-6 border border-gray-700 ${className}`}
    >
      {/* Exercise Header */}
      <div className="text-center mb-8">
        <Text variant="heading" size="3xl" weight="bold" className="mb-2 break-words">
          {exercise.name}
        </Text>
        
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <Text size="lg" color="primary" weight="semibold">
              Set {currentSet}
            </Text>
            <Text size="lg" color="muted">
              of {exercise.sets}
            </Text>
          </div>
        </div>
      </div>

      {/* Set Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <Text size="sm" color="muted">Set Progress</Text>
          <Text size="sm" color="primary" weight="semibold">
            {completedSets.length}/{exercise.sets}
          </Text>
        </div>
        
        <div className="flex space-x-2">
          {Array.from({ length: exercise.sets }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-colors duration-300 ${
                i < completedSets.length
                  ? 'bg-success'
                  : i === currentSet - 1
                  ? 'bg-primary'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {!isCompleted ? (
        <>
          {/* Weight Input */}
          {exercise.weight > 0 && (
            <div className="mb-6">
              <Text size="sm" color="muted" className="mb-3">Weight (lbs)</Text>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="large"
                  icon="Minus"
                  onClick={() => adjustWeight(-5)}
                  className="w-16 h-16"
                />
                
                <div className="flex-1">
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="text-center text-2xl font-bold"
                    placeholder="0"
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="large"
                  icon="Plus"
                  onClick={() => adjustWeight(5)}
                  className="w-16 h-16"
                />
              </div>
            </div>
          )}

          {/* Reps Input */}
          <div className="mb-8">
            <Text size="sm" color="muted" className="mb-3">Reps</Text>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="large"
                icon="Minus"
                onClick={() => adjustReps(-1)}
                className="w-16 h-16"
              />
              
              <div className="flex-1">
                <Input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="text-center text-2xl font-bold"
                  placeholder="0"
                />
              </div>
              
              <Button
                variant="outline"
                size="large"
                icon="Plus"
                onClick={() => adjustReps(1)}
                className="w-16 h-16"
              />
            </div>
          </div>

          {/* Complete Set Button */}
          <Button
            variant="primary"
            size="xl"
            icon="Check"
            onClick={handleSetComplete}
            className="w-full"
            disabled={!reps || reps <= 0}
          >
            Complete Set {currentSet}
          </Button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center space-x-2 text-success">
            <ApperIcon name="CheckCircle" size={48} />
          </div>
          
          <div>
            <Text variant="heading" size="2xl" weight="bold" color="success" className="mb-2">
              Exercise Complete!
            </Text>
            <Text color="muted">
              Great job on {exercise.name}
            </Text>
          </div>

          {/* Completed Sets Summary */}
          <div className="bg-gray-800 rounded-xl p-4">
            <Text size="sm" color="muted" className="mb-3">Sets Completed</Text>
            <div className="space-y-2">
              {completedSets.map((set, index) => (
                <div key={index} className="flex justify-between items-center">
                  <Text size="sm">Set {set.setNumber}</Text>
                  <Text size="sm" weight="semibold">
                    {set.reps} reps {set.weight > 0 && `@ ${set.weight} lbs`}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          {onNext && (
            <Button
              variant="accent"
              size="xl"
              icon="ArrowRight"
              onClick={onNext}
              className="w-full"
            >
              Next Exercise
            </Button>
          )}
        </motion.div>
      )}

      {/* Completed Sets List */}
      {completedSets.length > 0 && !isCompleted && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <Text size="sm" color="muted" className="mb-3">Completed Sets</Text>
          <div className="space-y-2">
            <AnimatePresence>
              {completedSets.map((set, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center py-2 px-3 bg-gray-800 rounded-lg"
                >
                  <Text size="sm">Set {set.setNumber}</Text>
                  <Text size="sm" weight="semibold" color="success">
                    {set.reps} reps {set.weight > 0 && `@ ${set.weight} lbs`}
                  </Text>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ExerciseTracker;
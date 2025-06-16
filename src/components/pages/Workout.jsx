import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import WorkoutHeader from '@/components/organisms/WorkoutHeader';
import ExerciseTracker from '@/components/organisms/ExerciseTracker';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { workoutService, workoutLogService } from '@/services';

const Workout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [workout, setWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutLog, setWorkoutLog] = useState(null);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (id) {
      loadWorkout();
    }
  }, [id]);

  // Timer for workout duration
  useEffect(() => {
    let interval = null;
    
    if (workout && !isCompleted) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [workout, isCompleted]);

  const loadWorkout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const workoutData = await workoutService.getById(id);
      if (!workoutData) {
        throw new Error('Workout not found');
      }
      
      setWorkout(workoutData);
      
      // Create initial workout log
      const logData = {
        workoutId: workoutData.id,
        exercises: workoutData.exercises.map(exercise => ({
          exerciseId: exercise.name,
          sets: []
        })),
        duration: 0
      };
      
      const newLog = await workoutLogService.create(logData);
      setWorkoutLog(newLog);
      
    } catch (err) {
      setError(err.message || 'Failed to load workout');
      toast.error('Failed to load workout');
    } finally {
      setLoading(false);
    }
  };

  const handleSetComplete = async (setData) => {
    try {
      const updatedLog = await workoutLogService.addSet(
        workoutLog.id,
        currentExerciseIndex,
        setData
      );
      setWorkoutLog(updatedLog);
    } catch (err) {
      toast.error('Failed to save set data');
    }
  };

  const handleExerciseComplete = async (exerciseData) => {
    // Move to next exercise after a short delay
    setTimeout(() => {
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
      } else {
        // All exercises completed
        handleWorkoutComplete();
      }
    }, 2000);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handleWorkoutComplete = async () => {
    try {
      await workoutService.completeWorkout(workout.id, duration);
      setIsCompleted(true);
      toast.success('Workout completed! Amazing work! 🎉');
      
      // Navigate back to today after celebration
      setTimeout(() => {
        navigate('/today');
      }, 3000);
    } catch (err) {
      toast.error('Failed to complete workout');
    }
  };

  const handleEndWorkout = async () => {
    if (window.confirm('Are you sure you want to end this workout? Your progress will be saved.')) {
      try {
        await workoutService.completeWorkout(workout.id, duration);
        toast.success('Workout ended and progress saved');
        navigate('/today');
      } catch (err) {
        toast.error('Failed to save workout progress');
        navigate('/today');
      }
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse space-y-6">
          <div className="bg-surface p-6">
            <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="h-16 bg-gray-600 rounded"></div>
              <div className="h-16 bg-gray-600 rounded"></div>
              <div className="h-16 bg-gray-600 rounded"></div>
            </div>
            <div className="h-2 bg-gray-600 rounded"></div>
          </div>
          
          <div className="p-6">
            <div className="bg-surface rounded-2xl p-6">
              <div className="h-8 bg-gray-600 rounded w-1/2 mb-6"></div>
              <div className="space-y-4">
                <div className="h-16 bg-gray-600 rounded"></div>
                <div className="h-16 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !workout) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 max-w-md"
        >
          <ApperIcon name="AlertCircle" size={64} className="text-error mx-auto" />
          <Text variant="heading" size="2xl" weight="bold" color="error">
            Workout not found
          </Text>
          <Text color="muted">
            The workout you're looking for doesn't exist or has been removed.
          </Text>
          <Button
            variant="primary"
            onClick={() => navigate('/today')}
            icon="ArrowLeft"
          >
            Back to Today
          </Button>
        </motion.div>
      </div>
    );
  }

  // Workout Completed State
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-md"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2 
            }}
          >
            <ApperIcon name="Trophy" size={96} className="text-accent mx-auto" />
          </motion.div>
          
          <div>
            <Text variant="heading" size="4xl" weight="bold" className="mb-4">
              Workout Complete!
            </Text>
            <Text color="muted" size="lg">
              Amazing work! You completed your {workout.type} workout in{' '}
              {Math.floor(duration / 60)} minutes.
            </Text>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-surface rounded-xl p-4">
              <Text variant="heading" size="2xl" weight="bold" color="primary">
                {workout.exercises.length}
              </Text>
              <Text size="sm" color="muted">Exercises</Text>
            </div>
            
            <div className="bg-surface rounded-xl p-4">
              <Text variant="heading" size="2xl" weight="bold" color="accent">
                {Math.floor(duration / 60)}m
              </Text>
              <Text size="sm" color="muted">Duration</Text>
            </div>
          </div>

          <Text color="muted">
            Redirecting to home in 3 seconds...
          </Text>
        </motion.div>
      </div>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Workout Header */}
      <WorkoutHeader
        workout={workout}
        currentExerciseIndex={currentExerciseIndex}
        totalExercises={workout.exercises.length}
        duration={duration}
        onEndWorkout={handleEndWorkout}
      />

      {/* Current Exercise */}
      <div className="p-4 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExerciseIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <ExerciseTracker
              exercise={currentExercise}
              onSetComplete={handleSetComplete}
              onExerciseComplete={handleExerciseComplete}
              onNext={handleNextExercise}
            />
          </motion.div>
        </AnimatePresence>

        {/* Exercise Navigation */}
        {workout.exercises.length > 1 && (
          <div className="mt-6 flex justify-between items-center">
            <Button
              variant="ghost"
              icon="ChevronLeft"
              onClick={() => setCurrentExerciseIndex(prev => Math.max(0, prev - 1))}
              disabled={currentExerciseIndex === 0}
            >
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {workout.exercises.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentExerciseIndex
                      ? 'bg-primary'
                      : index < currentExerciseIndex
                      ? 'bg-success'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="ghost"
              icon="ChevronRight"
              iconPosition="right"
              onClick={() => setCurrentExerciseIndex(prev => Math.min(workout.exercises.length - 1, prev + 1))}
              disabled={currentExerciseIndex === workout.exercises.length - 1}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workout;
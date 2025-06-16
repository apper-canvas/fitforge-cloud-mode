import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { workoutLogService } from '@/services';

const History = () => {
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWorkoutHistory();
  }, []);

  const loadWorkoutHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const logs = await workoutLogService.getRecentLogs(30);
      setWorkoutLogs(logs);
    } catch (err) {
      setError(err.message || 'Failed to load workout history');
      toast.error('Failed to load workout history');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentWeekDays = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  };

  const hasWorkoutOnDate = (date) => {
    return workoutLogs.some(log => 
      isSameDay(new Date(log.timestamp), date)
    );
  };

  const getWorkoutForDate = (date) => {
    return workoutLogs.find(log => 
      isSameDay(new Date(log.timestamp), date)
    );
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const workout = getWorkoutForDate(date);
    setSelectedLog(workout || null);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedDate(newDate);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded w-1/3 mb-6"></div>
            
            {/* Calendar Skeleton */}
            <div className="bg-surface rounded-2xl p-6">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {Array.from({ length: 7 }, (_, i) => (
                  <div key={i} className="h-12 bg-gray-600 rounded"></div>
                ))}
              </div>
            </div>
            
            {/* Detail Skeleton */}
            <div className="bg-surface rounded-2xl p-6 mt-6">
              <div className="h-6 bg-gray-600 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="h-16 bg-gray-600 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 max-w-md"
        >
          <ApperIcon name="AlertCircle" size={64} className="text-error mx-auto" />
          <Text variant="heading" size="2xl" weight="bold" color="error">
            Failed to load history
          </Text>
          <Text color="muted" className="break-words">
            {error}
          </Text>
          <Button
            variant="primary"
            onClick={loadWorkoutHistory}
            icon="RefreshCw"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  // Empty State
  if (workoutLogs.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Calendar" size={64} className="text-gray-400 mx-auto" />
          </motion.div>
          
          <Text variant="heading" size="2xl" weight="bold">
            No workout history yet
          </Text>
          
          <Text color="muted">
            Complete your first workout to start tracking your fitness journey
          </Text>
          
          <Button
            variant="primary"
            onClick={() => window.location.href = '/today'}
            icon="ArrowRight"
          >
            Start First Workout
          </Button>
        </motion.div>
      </div>
    );
  }

  const weekDays = getCurrentWeekDays();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Text variant="heading" size="4xl" weight="bold" className="mb-2">
            Workout History
          </Text>
          <Text color="muted" size="lg">
            Track your fitness journey and celebrate your progress
          </Text>
        </motion.div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-2xl p-6 border border-gray-700"
        >
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              icon="ChevronLeft"
              onClick={() => navigateWeek(-1)}
            />
            
            <Text variant="subheading" size="lg" weight="semibold">
              {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
            </Text>
            
            <Button
              variant="ghost"  
              icon="ChevronRight"
              onClick={() => navigateWeek(1)}
            />
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => {
              const hasWorkout = hasWorkoutOnDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              
              return (
                <motion.button
                  key={day.toISOString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateSelect(day)}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    isSelected
                      ? 'bg-primary text-white'
                      : hasWorkout
                      ? 'bg-success/20 border border-success text-success hover:bg-success/30'
                      : isToday
                      ? 'bg-gray-700 border border-gray-600 hover:bg-gray-600'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-xs text-gray-400 mb-1">
                    {format(day, 'EEE')}
                  </div>
                  <div className={`text-lg font-bold ${
                    isSelected ? 'text-white' : hasWorkout ? 'text-success' : isToday ? 'text-white' : 'text-gray-300'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  {hasWorkout && (
                    <div className="mt-1">
                      <div className={`w-2 h-2 rounded-full mx-auto ${
                        isSelected ? 'bg-white' : 'bg-success'
                      }`} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Workout Details */}
        <AnimatePresence mode="wait">
          {selectedLog ? (
            <motion.div
              key="workout-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-surface rounded-2xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Text variant="subheading" size="xl" weight="semibold">
                    {format(new Date(selectedLog.timestamp), 'EEEE, MMMM d')}
                  </Text>
                  <Text color="muted">
                    Duration: {Math.floor((selectedLog.duration || 0) / 60)} minutes
                  </Text>
                </div>
                
                <div className="flex items-center space-x-2 text-success">
                  <ApperIcon name="CheckCircle" size={24} />
                  <Text color="success" weight="semibold">Completed</Text>
                </div>
              </div>

              {/* Exercise Summary */}
              <div className="space-y-4">
                <Text variant="subheading" size="lg" weight="medium" className="mb-4">
                  Exercises Completed
                </Text>
                
                {selectedLog.exercises?.map((exercise, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Text weight="semibold" className="break-words">
                        {exercise.exerciseId}
                      </Text>
                      <Text size="sm" color="muted">
                        {exercise.sets?.length || 0} sets
                      </Text>
                    </div>
                    
                    {exercise.sets && exercise.sets.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {exercise.sets.map((set, setIndex) => (
                          <div key={setIndex} className="text-center">
                            <div className="bg-gray-700 rounded-lg p-2">
                              <Text size="sm" color="muted">Set {setIndex + 1}</Text>
                              <Text weight="semibold">
                                {set.reps} reps
                                {set.weight > 0 && (
                                  <Text as="span" size="sm" color="muted" className="block">
                                    @ {set.weight} lbs
                                  </Text>
                                )}
                              </Text>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-workout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-surface rounded-2xl p-8 text-center border border-gray-700"
            >
              <ApperIcon name="Calendar" size={48} className="text-gray-400 mx-auto mb-4" />
              <Text variant="subheading" size="lg" weight="semibold" className="mb-2">
                No workout on {format(selectedDate, 'MMMM d')}
              </Text>
              <Text color="muted">
                Select a different date or complete a workout to add to your history
              </Text>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
            <Text variant="heading" size="2xl" weight="bold" color="primary">
              {workoutLogs.length}
            </Text>
            <Text size="sm" color="muted">Total Workouts</Text>
          </div>
          
          <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
            <Text variant="heading" size="2xl" weight="bold" color="accent">
              {workoutLogs.reduce((total, log) => total + (log.exercises?.length || 0), 0)}
            </Text>
            <Text size="sm" color="muted">Total Exercises</Text>
          </div>
          
          <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
            <Text variant="heading" size="2xl" weight="bold" color="secondary">
              {Math.round(workoutLogs.reduce((total, log) => total + (log.duration || 0), 0) / 60)}
            </Text>
            <Text size="sm" color="muted">Total Minutes</Text>
          </div>
          
          <div className="bg-surface rounded-xl p-4 text-center border border-gray-700">
            <Text variant="heading" size="2xl" weight="bold" color="success">
              {workoutLogs.length > 0 ? Math.round(workoutLogs.reduce((total, log) => total + (log.duration || 0), 0) / 60 / workoutLogs.length) : 0}
            </Text>
            <Text size="sm" color="muted">Avg Duration</Text>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default History;
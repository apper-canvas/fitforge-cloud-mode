import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import StatCard from '@/components/molecules/StatCard';
import ProgressChart from '@/components/organisms/ProgressChart';
import ApperIcon from '@/components/ApperIcon';
import { progressService, workoutLogService } from '@/services';

const Progress = () => {
  const [stats, setStats] = useState(null);
  const [personalRecords, setPersonalRecords] = useState({});
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [weeklyStats, streak, records, logs] = await Promise.all([
        progressService.getWeeklyStats(),
        progressService.getStreak(),
        progressService.getPersonalRecords(),
        workoutLogService.getRecentLogs(90)
      ]);
      
      setStats({ ...weeklyStats, streak });
      setPersonalRecords(records);
      
      // Extract unique exercises
      const exercises = new Set();
      logs.forEach(log => {
        log.exercises?.forEach(exercise => {
          if (exercise.exerciseId) {
            exercises.add(exercise.exerciseId);
          }
        });
      });
      
      const exerciseList = Array.from(exercises).sort();
      setAvailableExercises(exerciseList);
      
      if (exerciseList.length > 0 && !selectedExercise) {
        setSelectedExercise(exerciseList[0]);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to load progress data');
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded w-1/3 mb-6"></div>
            
            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="bg-surface rounded-2xl p-6">
                  <div className="w-8 h-8 bg-gray-600 rounded-lg mb-4"></div>
                  <div className="w-20 h-6 bg-gray-600 rounded mb-2"></div>
                  <div className="w-16 h-4 bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>
            
            {/* Chart Skeleton */}
            <div className="bg-surface rounded-2xl p-6">
              <div className="h-6 bg-gray-600 rounded w-1/4 mb-6"></div>
              <div className="h-64 bg-gray-600 rounded"></div>
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
            Failed to load progress
          </Text>
          <Text color="muted" className="break-words">
            {error}
          </Text>
          <Button
            variant="primary"
            onClick={loadProgressData}
            icon="RefreshCw"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  // Empty State
  if (availableExercises.length === 0) {
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
            <ApperIcon name="TrendingUp" size={64} className="text-gray-400 mx-auto" />
          </motion.div>
          
          <Text variant="heading" size="2xl" weight="bold">
            No progress data yet
          </Text>
          
          <Text color="muted">
            Complete some workouts to start tracking your progress and see your improvements over time
          </Text>
          
          <Button
            variant="primary"
            onClick={() => window.location.href = '/today'}
            icon="ArrowRight"
          >
            Start Your First Workout
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Text variant="heading" size="4xl" weight="bold" className="mb-2">
            Your Progress
          </Text>
          <Text color="muted" size="lg">
            Track your fitness journey and celebrate your achievements
          </Text>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard
            icon="Flame"
            label="Current Streak"
            value={stats?.streak || 0}
            unit="days"
            color="primary"
            trend={stats?.streak > 0 ? 'up' : 'neutral'}
            trendValue={stats?.streak > 0 ? `${stats.streak} days` : 'Start today!'}
          />
          
          <StatCard
            icon="Activity"
            label="This Week"
            value={stats?.workoutsCompleted || 0}
            unit="workouts"
            color="accent"
            trend={stats?.workoutsCompleted > 0 ? 'up' : 'neutral'}
            trendValue={`${stats?.workoutsCompleted || 0}/7`}
          />
          
          <StatCard
            icon="Dumbbell"
            label="Total Volume"
            value={stats?.totalVolume ? Math.round(stats.totalVolume / 1000) : 0}
            unit="k lbs"
            color="secondary"
            trend="up"
            trendValue="+15%"
          />
          
          <StatCard
            icon="Clock"
            label="Avg Duration"
            value={stats?.avgDuration ? Math.round(stats.avgDuration / 60) : 0}
            unit="min"
            color="success"
          />
        </motion.div>

        {/* Exercise Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProgressChart
            exerciseName={selectedExercise}
            days={30}
          />
        </motion.div>

        {/* Exercise Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface rounded-2xl p-6 border border-gray-700"
        >
          <Text variant="subheading" size="lg" weight="semibold" className="mb-4">
            Select Exercise to Track
          </Text>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {availableExercises.map((exercise, index) => (
              <motion.button
                key={exercise}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedExercise(exercise)}
                className={`p-3 rounded-xl text-left transition-all duration-200 border max-w-full overflow-hidden ${
                  selectedExercise === exercise
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white'
                }`}
              >
                <Text size="sm" weight="medium" className="break-words">
                  {exercise}
                </Text>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Personal Records */}
        {Object.keys(personalRecords).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex items-center space-x-2 mb-6">
              <ApperIcon name="Trophy" size={24} className="text-accent" />
              <Text variant="subheading" size="lg" weight="semibold">
                Personal Records
              </Text>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(personalRecords)
                .sort(([, a], [, b]) => new Date(b.date) - new Date(a.date))
                .slice(0, 6)
                .map(([exercise, record], index) => (
                  <motion.div
                    key={exercise}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-xl p-4"
                  >
                    <Text weight="semibold" className="mb-2 break-words">
                      {exercise}
                    </Text>
                    
                    <div className="grid grid-cols-2 gap-3 text-center">
                      {record.maxWeight > 0 && (
                        <div>
                          <Text variant="heading" size="xl" weight="bold" color="primary">
                            {record.maxWeight}
                          </Text>
                          <Text size="sm" color="muted">Max Weight (lbs)</Text>
                        </div>
                      )}
                      
                      {record.maxReps > 0 && (
                        <div>
                          <Text variant="heading" size="xl" weight="bold" color="accent">
                            {record.maxReps}
                          </Text>
                          <Text size="sm" color="muted">Max Reps</Text>
                        </div>
                      )}
                    </div>
                    
                    {record.date && (
                      <Text size="xs" color="muted" className="mt-2">
                        {new Date(record.date).toLocaleDateString()}
                      </Text>
                    )}
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Motivational Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 border border-primary/30 text-center"
        >
          <ApperIcon name="Zap" size={48} className="text-primary mx-auto mb-4" />
          <Text variant="heading" size="2xl" weight="bold" className="mb-2">
            Keep Going Strong! 💪
          </Text>
          <Text color="muted">
            {stats?.streak > 0 
              ? `You've been consistent for ${stats.streak} days. Every workout counts!`
              : 'Start your fitness streak today. Consistency is the key to success!'
            }
          </Text>
        </motion.div>
      </div>
    </div>
  );
};

export default Progress;
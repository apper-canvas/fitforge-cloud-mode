import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import StatCard from '@/components/molecules/StatCard';
import ExerciseCard from '@/components/molecules/ExerciseCard';
import ApperIcon from '@/components/ApperIcon';
import { workoutService, userProfileService, progressService } from '@/services';

const Today = () => {
  const navigate = useNavigate();
  const [todaysWorkout, setTodaysWorkout] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [profile, workout, weeklyStats, streak] = await Promise.all([
        userProfileService.getProfile(),
        workoutService.getTodaysWorkout(),
        progressService.getWeeklyStats(),
        progressService.getStreak()
      ]);
      
      setUserProfile(profile);
      setTodaysWorkout(workout);
      setStats({ ...weeklyStats, streak });
    } catch (err) {
      setError(err.message || 'Failed to load today\'s data');
      toast.error('Failed to load workout data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWorkout = async () => {
    if (!userProfile?.isSetupComplete) {
      navigate('/setup');
      return;
    }

    setGenerating(true);
    try {
      const newWorkout = await workoutService.generateWorkout(userProfile);
      setTodaysWorkout(newWorkout);
      toast.success('New workout generated! 💪');
    } catch (err) {
      toast.error('Failed to generate workout');
    } finally {
      setGenerating(false);
    }
  };

  const handleStartWorkout = (workout) => {
    navigate(`/workout/${workout.id}`);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-surface rounded w-1/2"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="bg-surface rounded-2xl p-6 animate-pulse">
                <div className="w-8 h-8 bg-gray-600 rounded-lg mb-4"></div>
                <div className="w-20 h-6 bg-gray-600 rounded mb-2"></div>
                <div className="w-16 h-4 bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>

          {/* Workout Skeleton */}
          <div className="bg-surface rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-gray-600 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="h-20 bg-gray-600 rounded-xl"></div>
              ))}
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
            Something went wrong
          </Text>
          <Text color="muted" className="break-words">
            {error}
          </Text>
          <Button
            variant="primary"
            onClick={loadTodayData}
            icon="RefreshCw"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  // Setup Required State
  if (!userProfile?.isSetupComplete) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <ApperIcon name="Target" size={64} className="text-primary mx-auto" />
          <div>
            <Text variant="heading" size="3xl" weight="bold" className="mb-2">
              Welcome to FitForge AI!
            </Text>
            <Text color="muted">
              Let's set up your profile to generate personalized workouts
            </Text>
          </div>
          <Button
            variant="primary"
            size="xl"
            onClick={() => navigate('/setup')}
            icon="ArrowRight"
            className="w-full"
          >
            Get Started
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center md:text-left"
        >
          <Text variant="heading" size="4xl" weight="bold" className="mb-2">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
          </Text>
          <Text color="muted" size="lg">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </motion.div>

        {/* Quick Stats */}
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
            trendValue={stats?.streak > 0 ? '+1' : '0'}
          />
          
          <StatCard
            icon="Activity"
            label="This Week"
            value={stats?.workoutsCompleted || 0}
            unit="workouts"
            color="accent"
          />
          
          <StatCard
            icon="Clock"
            label="Avg Duration"
            value={stats?.avgDuration ? Math.round(stats.avgDuration / 60) : 0}
            unit="min"
            color="secondary"
          />
          
          <StatCard
            icon="TrendingUp"
            label="Total Volume"
            value={stats?.totalVolume ? Math.round(stats.totalVolume / 1000) : 0}
            unit="k lbs"
            color="success"
            trend="up"
            trendValue="+12%"
          />
        </motion.div>

        {/* Today's Workout Section */}
        <AnimatePresence mode="wait">
          {todaysWorkout ? (
            <motion.div
              key="workout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <Text variant="heading" size="2xl" weight="bold" className="mb-2">
                    Today's Workout
                  </Text>
                  <Text color="muted">
                    {todaysWorkout.type?.charAt(0).toUpperCase() + todaysWorkout.type?.slice(1)} • {todaysWorkout.difficulty?.charAt(0).toUpperCase() + todaysWorkout.difficulty?.slice(1)}
                  </Text>
                </div>
                
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    icon="RefreshCw"
                    onClick={handleGenerateWorkout}
                    loading={generating}
                    disabled={generating}
                  >
                    New Workout
                  </Button>
                  
                  <Button
                    variant="primary"
                    size="large"
                    icon="Play"
                    onClick={() => handleStartWorkout(todaysWorkout)}
                  >
                    Start Workout
                  </Button>
                </div>
              </div>

              {/* Exercise List */}
              <div className="space-y-4">
                {todaysWorkout.exercises?.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <ExerciseCard
                      exercise={exercise}
                      showStartButton={false}
                    />
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
              transition={{ delay: 0.2 }}
              className="bg-surface rounded-2xl p-8 text-center border border-gray-700"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="mb-6"
              >
                <ApperIcon name="Dumbbell" size={64} className="text-primary mx-auto" />
              </motion.div>
              
              <Text variant="heading" size="2xl" weight="bold" className="mb-4">
                Ready for today's workout?
              </Text>
              
              <Text color="muted" className="mb-8 max-w-md mx-auto">
                Generate a personalized workout based on your goals and available equipment
              </Text>
              
              <Button
                variant="primary"
                size="xl"
                icon="Sparkles"
                onClick={handleGenerateWorkout}
                loading={generating}
                disabled={generating}
                className="w-full md:w-auto"
              >
                {generating ? 'Generating...' : 'Generate Workout'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          <Button
            variant="ghost"
            className="h-20 flex-col space-y-2 bg-surface border border-gray-700 hover:border-gray-600"
            onClick={() => navigate('/history')}
          >
            <ApperIcon name="Calendar" size={24} />
            <Text size="sm">History</Text>
          </Button>
          
          <Button
            variant="ghost"
            className="h-20 flex-col space-y-2 bg-surface border border-gray-700 hover:border-gray-600"
            onClick={() => navigate('/progress')}
          >
            <ApperIcon name="TrendingUp" size={24} />
            <Text size="sm">Progress</Text>
          </Button>
          
          <Button
            variant="ghost"
            className="h-20 flex-col space-y-2 bg-surface border border-gray-700 hover:border-gray-600 col-span-2 md:col-span-1"
            onClick={() => navigate('/settings')}
          >
            <ApperIcon name="Settings" size={24} />
            <Text size="sm">Settings</Text>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Today;
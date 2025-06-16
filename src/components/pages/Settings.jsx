import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { userProfileService } from '@/services';

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goals: [],
    equipment: [],
    experience: 'beginner',
    preferences: {
      units: 'imperial',
      restTimerSound: true,
      voiceCommands: false,
      notifications: true
    }
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const profileData = await userProfileService.getProfile();
      setProfile(profileData);
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        goals: profileData.goals || [],
        equipment: profileData.equipment || [],
        experience: profileData.experience || 'beginner',
        preferences: {
          units: profileData.preferences?.units || 'imperial',
          restTimerSound: profileData.preferences?.restTimerSound ?? true,
          voiceCommands: profileData.preferences?.voiceCommands ?? false,
          notifications: profileData.preferences?.notifications ?? true
        }
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const updatedProfile = await userProfileService.updateProfile(formData);
      setProfile(updatedProfile);
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleEquipmentToggle = (equipment) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const goalOptions = [
    { id: 'strength', label: 'Build Strength', icon: 'Dumbbell' },
    { id: 'muscle_gain', label: 'Muscle Growth', icon: 'TrendingUp' },
    { id: 'weight_loss', label: 'Weight Loss', icon: 'Target' },
    { id: 'endurance', label: 'Endurance', icon: 'Activity' },
    { id: 'flexibility', label: 'Flexibility', icon: 'RotateCcw' }
  ];

  const equipmentOptions = [
    { id: 'barbell', label: 'Barbell', icon: 'Minus' },
    { id: 'dumbbells', label: 'Dumbbells', icon: 'Dumbbell' },
    { id: 'bench', label: 'Bench', icon: 'Square' },
    { id: 'pull-up bar', label: 'Pull-up Bar', icon: 'ArrowUp' },
    { id: 'resistance_bands', label: 'Resistance Bands', icon: 'Zap' },
    { id: 'kettlebells', label: 'Kettlebells', icon: 'Circle' }
  ];

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded w-1/3 mb-6"></div>
            
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="bg-surface rounded-2xl p-6 mb-6">
                <div className="h-6 bg-gray-600 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-12 bg-gray-600 rounded"></div>
                  <div className="h-12 bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
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
            Failed to load settings
          </Text>
          <Text color="muted" className="break-words">
            {error}
          </Text>
          <Button
            variant="primary"
            onClick={loadProfile}
            icon="RefreshCw"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Text variant="heading" size="4xl" weight="bold" className="mb-2">
            Settings
          </Text>
          <Text color="muted" size="lg">
            Customize your FitForge AI experience
          </Text>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-2xl p-6 border border-gray-700"
        >
          <Text variant="subheading" size="lg" weight="semibold" className="mb-6">
            Profile Information
          </Text>
          
          <div className="space-y-4">
            <div>
              <Text size="sm" color="muted" className="mb-2">Name</Text>
              <Input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div>
              <Text size="sm" color="muted" className="mb-2">Email</Text>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Fitness Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface rounded-2xl p-6 border border-gray-700"
        >
          <Text variant="subheading" size="lg" weight="semibold" className="mb-6">
            Fitness Goals
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {goalOptions.map((goal, index) => (
              <motion.button
                key={goal.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGoalToggle(goal.id)}
                className={`p-4 rounded-xl text-left transition-all duration-200 border ${
                  formData.goals.includes(goal.id)
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <ApperIcon 
                    name={goal.icon} 
                    size={20} 
                    className={formData.goals.includes(goal.id) ? 'text-primary' : 'text-gray-400'} 
                  />
                  <Text weight="medium" className="break-words">
                    {goal.label}
                  </Text>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Equipment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface rounded-2xl p-6 border border-gray-700"
        >
          <Text variant="subheading" size="lg" weight="semibold" className="mb-6">
            Available Equipment
          </Text>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {equipmentOptions.map((equipment, index) => (
              <motion.button
                key={equipment.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleEquipmentToggle(equipment.id)}
                className={`p-4 rounded-xl text-center transition-all duration-200 border ${
                  formData.equipment.includes(equipment.id)
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }`}
              >
                <ApperIcon 
                  name={equipment.icon} 
                  size={24} 
                  className={`mx-auto mb-2 ${
                    formData.equipment.includes(equipment.id) ? 'text-accent' : 'text-gray-400'
                  }`} 
                />
                <Text size="sm" weight="medium" className="break-words">
                  {equipment.label}
                </Text>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Experience Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface rounded-2xl p-6 border border-gray-700"
        >
          <Text variant="subheading" size="lg" weight="semibold" className="mb-6">
            Experience Level
          </Text>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {['beginner', 'intermediate', 'advanced'].map((level, index) => (
              <motion.button
                key={level}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange('experience', level)}
                className={`p-4 rounded-xl text-center transition-all duration-200 border ${
                  formData.experience === level
                    ? 'bg-secondary/20 border-secondary text-secondary'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }`}
              >
                <Text weight="medium" className="capitalize">
                  {level}
                </Text>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-surface rounded-2xl p-6 border border-gray-700"
        >
          <Text variant="subheading" size="lg" weight="semibold" className="mb-6">
            Preferences
          </Text>
          
          <div className="space-y-4">
            {/* Units */}
            <div className="flex items-center justify-between">
              <div>
                <Text weight="medium">Units</Text>
                <Text size="sm" color="muted">Choose your preferred measurement system</Text>
              </div>
              <div className="flex space-x-2">
                {['imperial', 'metric'].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => handlePreferenceChange('units', unit)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.preferences.units === unit
                        ? 'bg-primary text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Rest Timer Sound */}
            <div className="flex items-center justify-between">
              <div>
                <Text weight="medium">Rest Timer Sound</Text>
                <Text size="sm" color="muted">Play sound when rest timer completes</Text>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePreferenceChange('restTimerSound', !formData.preferences.restTimerSound)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  formData.preferences.restTimerSound ? 'bg-primary' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{
                    x: formData.preferences.restTimerSound ? 24 : 0
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                />
              </motion.button>
            </div>

            {/* Voice Commands */}
            <div className="flex items-center justify-between">
              <div>
                <Text weight="medium">Voice Commands</Text>
                <Text size="sm" color="muted">Use voice to log sets and reps</Text>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePreferenceChange('voiceCommands', !formData.preferences.voiceCommands)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  formData.preferences.voiceCommands ? 'bg-primary' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{
                    x: formData.preferences.voiceCommands ? 24 : 0
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                />
              </motion.button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <Text weight="medium">Push Notifications</Text>
                <Text size="sm" color="muted">Receive workout reminders and tips</Text>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePreferenceChange('notifications', !formData.preferences.notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  formData.preferences.notifications ? 'bg-primary' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{
                    x: formData.preferences.notifications ? 24 : 0
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="sticky bottom-4"
        >
          <Button
            variant="primary"
            size="xl"
            icon="Save"
            onClick={handleSave}
            loading={saving}
            disabled={saving}
            className="w-full"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </motion.div>

        {/* Profile Stats */}
        {profile?.stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 border border-primary/30"
          >
            <Text variant="subheading" size="lg" weight="semibold" className="mb-4">
              Your FitForge Journey
            </Text>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Text variant="heading" size="2xl" weight="bold" color="primary">
                  {profile.stats.totalWorkouts}
                </Text>
                <Text size="sm" color="muted">Total Workouts</Text>
              </div>
              
              <div className="text-center">
                <Text variant="heading" size="2xl" weight="bold" color="accent">
                  {profile.stats.currentStreak}
                </Text>
                <Text size="sm" color="muted">Current Streak</Text>
              </div>
              
              <div className="text-center">
                <Text variant="heading" size="2xl" weight="bold" color="secondary">
                  {profile.stats.longestStreak}
                </Text>
                <Text size="sm" color="muted">Longest Streak</Text>
              </div>
              
              <div className="text-center">
                <Text variant="heading" size="2xl" weight="bold" color="success">
                  {Math.round(profile.stats.totalVolume / 1000)}k
                </Text>
                <Text size="sm" color="muted">lbs Lifted</Text>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Settings;
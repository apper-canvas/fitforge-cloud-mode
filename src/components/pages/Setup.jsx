import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { userProfileService } from '@/services';

const Setup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    goals: [],
    experience: '',
    equipment: [],
    schedule: {
      daysPerWeek: 3,
      sessionDuration: 60,
      preferredDays: []
    }
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to FitForge AI!',
      description: 'Let\'s create your personalized fitness experience'
    },
    {
      id: 'profile',
      title: 'Tell us about yourself',
      description: 'We\'ll use this to create better workouts for you'
    },
    {
      id: 'goals',
      title: 'What are your fitness goals?',
      description: 'Select all that apply to your current objectives'
    },
    {
      id: 'experience',
      title: 'What\'s your experience level?',
      description: 'This helps us adjust workout difficulty'
    },
    {
      id: 'equipment',
      title: 'What equipment do you have?',
      description: 'We\'ll design workouts based on your available gear'
    },
    {
      id: 'schedule',
      title: 'How often can you work out?',
      description: 'Let\'s plan a sustainable routine'
    },
    {
      id: 'complete',
      title: 'You\'re all set!',
      description: 'Ready to start your AI-powered fitness journey'
    }
  ];

  const goalOptions = [
    { id: 'strength', label: 'Build Strength', icon: 'Dumbbell', color: 'primary' },
    { id: 'muscle_gain', label: 'Muscle Growth', icon: 'TrendingUp', color: 'accent' },
    { id: 'weight_loss', label: 'Weight Loss', icon: 'Target', color: 'secondary' },
    { id: 'endurance', label: 'Endurance', icon: 'Activity', color: 'success' },
    { id: 'flexibility', label: 'Flexibility', icon: 'RotateCcw', color: 'warning' }
  ];

  const experienceOptions = [
    { id: 'beginner', label: 'Beginner', description: 'New to working out', icon: 'Star' },
    { id: 'intermediate', label: 'Intermediate', description: '6+ months experience', icon: 'Award' },
    { id: 'advanced', label: 'Advanced', description: '2+ years experience', icon: 'Trophy' }
  ];

  const equipmentOptions = [
    { id: 'barbell', label: 'Barbell', icon: 'Minus' },
    { id: 'dumbbells', label: 'Dumbbells', icon: 'Dumbbell' },
    { id: 'bench', label: 'Bench', icon: 'Square' },
    { id: 'pull-up bar', label: 'Pull-up Bar', icon: 'ArrowUp' },
    { id: 'resistance_bands', label: 'Resistance Bands', icon: 'Zap' },
    { id: 'kettlebells', label: 'Kettlebells', icon: 'Circle' },
    { id: 'bodyweight', label: 'Bodyweight Only', icon: 'User' }
  ];

  const dayOptions = [
    { id: 'sunday', label: 'Sun' },
    { id: 'monday', label: 'Mon' },
    { id: 'tuesday', label: 'Tue' },
    { id: 'wednesday', label: 'Wed' },
    { id: 'thursday', label: 'Thu' },
    { id: 'friday', label: 'Fri' },
    { id: 'saturday', label: 'Sat' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [field]: value
      }
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        preferredDays: prev.schedule.preferredDays.includes(day)
          ? prev.schedule.preferredDays.filter(d => d !== day)
          : [...prev.schedule.preferredDays, day]
      }
    }));
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'profile':
        return formData.name.trim().length > 0;
      case 'goals':
        return formData.goals.length > 0;
      case 'experience':
        return formData.experience.length > 0;
      case 'equipment':
        return formData.equipment.length > 0;
      case 'schedule':
        return formData.schedule.daysPerWeek > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      await userProfileService.setupProfile(formData);
      toast.success('Profile setup complete! Welcome to FitForge AI! 🎉');
      navigate('/today');
    } catch (err) {
      toast.error('Failed to save profile. Please try again.');
      console.error('Setup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'welcome':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4
              }}
            >
              <ApperIcon name="Sparkles" size={96} className="text-primary mx-auto" />
            </motion.div>
            
            <div>
              <Text variant="heading" size="4xl" weight="bold" className="mb-4">
                Welcome to FitForge AI!
              </Text>
              <Text color="muted" size="lg" className="max-w-md mx-auto">
                Your personalized AI fitness coach is ready to create the perfect workout plan just for you.
              </Text>
            </div>
          </motion.div>
        );

      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <ApperIcon name="User" size={64} className="text-accent mx-auto mb-4" />
            </div>
            
            <div>
              <Text size="sm" color="muted" className="mb-2">What should we call you?</Text>
              <Input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                icon="User"
              />
            </div>
          </motion.div>
        );

      case 'goals':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <ApperIcon name="Target" size={64} className="text-primary mx-auto mb-4" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalOptions.map((goal, index) => (
                <motion.button
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleArrayToggle('goals', goal.id)}
                  className={`p-6 rounded-2xl text-left transition-all duration-200 border ${
                    formData.goals.includes(goal.id)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-surface border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <ApperIcon 
                      name={goal.icon} 
                      size={32}
                      className={formData.goals.includes(goal.id) ? 'text-primary' : 'text-gray-400'} 
                    />
                    <div>
                      <Text weight="semibold" size="lg">
                        {goal.label}
                      </Text>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 'experience':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <ApperIcon name="Award" size={64} className="text-secondary mx-auto mb-4" />
            </div>
            
            <div className="space-y-4">
              {experienceOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('experience', option.id)}
                  className={`w-full p-6 rounded-2xl text-left transition-all duration-200 border ${
                    formData.experience === option.id
                      ? 'bg-secondary/20 border-secondary text-secondary'
                      : 'bg-surface border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <ApperIcon 
                      name={option.icon} 
                      size={32}
                      className={formData.experience === option.id ? 'text-secondary' : 'text-gray-400'} 
                    />
                    <div>
                      <Text weight="semibold" size="lg">
                        {option.label}
                      </Text>
                      <Text size="sm" color="muted">
                        {option.description}
                      </Text>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 'equipment':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <ApperIcon name="Dumbbell" size={64} className="text-accent mx-auto mb-4" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {equipmentOptions.map((equipment, index) => (
                <motion.button
                  key={equipment.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleArrayToggle('equipment', equipment.id)}
                  className={`p-6 rounded-2xl text-center transition-all duration-200 border ${
                    formData.equipment.includes(equipment.id)
                      ? 'bg-accent/20 border-accent text-accent'
                      : 'bg-surface border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <ApperIcon 
                    name={equipment.icon} 
                    size={32}
                    className={`mx-auto mb-3 ${
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
        );

      case 'schedule':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <ApperIcon name="Calendar" size={64} className="text-success mx-auto mb-4" />
            </div>
            
            {/* Days per week */}
            <div>
              <Text weight="semibold" className="mb-4">How many days per week?</Text>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6, 7].map(days => (
                  <button
                    key={days}
                    onClick={() => handleScheduleChange('daysPerWeek', days)}
                    className={`p-4 rounded-xl text-center transition-all duration-200 border ${
                      formData.schedule.daysPerWeek === days
                        ? 'bg-success/20 border-success text-success'
                        : 'bg-surface border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Text weight="bold" size="lg">{days}</Text>
                  </button>
                ))}
              </div>
            </div>

            {/* Session duration */}
            <div>
              <Text weight="semibold" className="mb-4">Session duration (minutes)</Text>
              <div className="grid grid-cols-3 gap-3">
                {[30, 45, 60, 75, 90].map(duration => (
                  <button
                    key={duration}
                    onClick={() => handleScheduleChange('sessionDuration', duration)}
                    className={`p-4 rounded-xl text-center transition-all duration-200 border ${
                      formData.schedule.sessionDuration === duration
                        ? 'bg-warning/20 border-warning text-warning'
                        : 'bg-surface border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Text weight="bold">{duration}m</Text>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred days */}
            <div>
              <Text weight="semibold" className="mb-4">Preferred workout days (optional)</Text>
              <div className="grid grid-cols-7 gap-2">
                {dayOptions.map(day => (
                  <button
                    key={day.id}
                    onClick={() => handleDayToggle(day.id)}
                    className={`p-3 rounded-lg text-center transition-all duration-200 border ${
                      formData.schedule.preferredDays.includes(day.id)
                        ? 'bg-info/20 border-info text-info'
                        : 'bg-surface border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Text size="sm" weight="medium">{day.label}</Text>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3
              }}
            >
              <ApperIcon name="CheckCircle" size={96} className="text-success mx-auto" />
            </motion.div>
            
            <div>
              <Text variant="heading" size="4xl" weight="bold" className="mb-4">
                You're All Set!
              </Text>
              <Text color="muted" size="lg" className="max-w-md mx-auto">
                FitForge AI is ready to create your personalized workouts. Let's start your fitness journey!
              </Text>
            </div>

            {/* Summary */}
            <div className="bg-surface rounded-2xl p-6 text-left max-w-md mx-auto">
              <Text weight="semibold" className="mb-4">Your Profile Summary:</Text>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <Text color="muted">Goals:</Text>
                  <Text>{formData.goals.length} selected</Text>
                </div>
                <div className="flex justify-between">
                  <Text color="muted">Experience:</Text>
                  <Text className="capitalize">{formData.experience}</Text>
                </div>
                <div className="flex justify-between">
                  <Text color="muted">Equipment:</Text>
                  <Text>{formData.equipment.length} items</Text>
                </div>
                <div className="flex justify-between">
                  <Text color="muted">Frequency:</Text>
                  <Text>{formData.schedule.daysPerWeek} days/week</Text>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <Text size="sm" color="muted">
              Step {currentStep + 1} of {steps.length}
            </Text>
            <Text size="sm" color="primary" weight="semibold">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </Text>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
            />
          </div>
        </div>

        {/* Step Header */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Text variant="heading" size="3xl" weight="bold" className="mb-2">
            {steps[currentStep].title}
          </Text>
          <Text color="muted" size="lg">
            {steps[currentStep].description}
          </Text>
        </motion.div>

        {/* Step Content */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={currentStep === 0 ? 'invisible' : ''}
          >
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              variant="primary"
              size="large"
              icon="CheckCircle"
              onClick={handleComplete}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="large"
              icon="ArrowRight"
              iconPosition="right"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === 0 ? 'Get Started' : 'Next'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setup;
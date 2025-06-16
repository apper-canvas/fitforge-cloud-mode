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
    },
    healthInfo: {
      healthIssues: [],
      healthGoals: [],
      targetAreas: [],
      dietaryPreferences: [],
      allergies: [],
      medications: [],
      activityLevel: '',
      sleepHours: 8,
      stressLevel: '',
      injuries: [],
      medicalConditions: [],
      fitnessLimitations: ''
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
      id: 'health_welcome',
      title: 'Health & Wellness Survey',
      description: 'Help us understand your health background for safer, more effective workouts'
    },
    {
      id: 'health_issues',
      title: 'Current Health Concerns',
      description: 'Tell us about any health issues we should consider'
    },
    {
      id: 'health_goals',
      title: 'Health & Wellness Goals',
      description: 'What health outcomes are you hoping to achieve?'
    },
    {
      id: 'target_areas',
      title: 'Target Areas',
      description: 'Which areas of your body do you want to focus on?'
    },
    {
      id: 'dietary_preferences',
      title: 'Dietary Preferences',
      description: 'Help us understand your nutritional needs and restrictions'
    },
    {
      id: 'medical_info',
      title: 'Medical Information',
      description: 'Important medical details for your safety'
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle Factors',
      description: 'Tell us about your daily routine and stress levels'
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

  const healthIssueOptions = [
    { id: 'back_pain', label: 'Back Pain', icon: 'AlertTriangle' },
    { id: 'joint_pain', label: 'Joint Pain', icon: 'Zap' },
    { id: 'high_blood_pressure', label: 'High Blood Pressure', icon: 'Heart' },
    { id: 'diabetes', label: 'Diabetes', icon: 'Activity' },
    { id: 'heart_condition', label: 'Heart Condition', icon: 'Heart' },
    { id: 'respiratory', label: 'Respiratory Issues', icon: 'Wind' },
    { id: 'none', label: 'No Current Issues', icon: 'CheckCircle' }
  ];

  const healthGoalOptions = [
    { id: 'pain_relief', label: 'Pain Relief', icon: 'Shield' },
    { id: 'better_sleep', label: 'Better Sleep', icon: 'Moon' },
    { id: 'stress_reduction', label: 'Stress Reduction', icon: 'Smile' },
    { id: 'energy_boost', label: 'More Energy', icon: 'Zap' },
    { id: 'mobility', label: 'Improved Mobility', icon: 'RotateCcw' },
    { id: 'balance', label: 'Better Balance', icon: 'GitBranch' },
    { id: 'mental_health', label: 'Mental Wellness', icon: 'Brain' }
  ];

  const targetAreaOptions = [
    { id: 'core', label: 'Core/Abs', icon: 'Circle' },
    { id: 'upper_body', label: 'Upper Body', icon: 'ArrowUp' },
    { id: 'lower_body', label: 'Lower Body', icon: 'ArrowDown' },
    { id: 'back', label: 'Back', icon: 'Square' },
    { id: 'arms', label: 'Arms', icon: 'Minus' },
    { id: 'legs', label: 'Legs', icon: 'GitBranch' },
    { id: 'glutes', label: 'Glutes', icon: 'Target' },
    { id: 'full_body', label: 'Full Body', icon: 'User' }
  ];

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', icon: 'Leaf' },
    { id: 'vegan', label: 'Vegan', icon: 'Leaf' },
    { id: 'keto', label: 'Ketogenic', icon: 'Zap' },
    { id: 'paleo', label: 'Paleo', icon: 'Mountain' },
    { id: 'mediterranean', label: 'Mediterranean', icon: 'Sun' },
    { id: 'low_carb', label: 'Low Carb', icon: 'Minus' },
    { id: 'gluten_free', label: 'Gluten Free', icon: 'Shield' },
    { id: 'none', label: 'No Restrictions', icon: 'CheckCircle' }
  ];

  const activityLevelOptions = [
    { id: 'sedentary', label: 'Sedentary', description: 'Desk job, minimal activity', icon: 'Monitor' },
    { id: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week', icon: 'Circle' },
    { id: 'moderately_active', label: 'Moderately Active', description: 'Exercise 3-5 days/week', icon: 'Activity' },
    { id: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week', icon: 'Zap' }
  ];

  const stressLevelOptions = [
    { id: 'low', label: 'Low Stress', icon: 'Smile' },
    { id: 'moderate', label: 'Moderate Stress', icon: 'Meh' },
    { id: 'high', label: 'High Stress', icon: 'Frown' }
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

  const handleHealthInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      healthInfo: {
        ...prev.healthInfo,
        [field]: value
      }
    }));
  };

  const handleHealthArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      healthInfo: {
        ...prev.healthInfo,
        [field]: prev.healthInfo[field].includes(value)
          ? prev.healthInfo[field].filter(item => item !== value)
          : [...prev.healthInfo[field], value]
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
      case 'health_issues':
        return formData.healthInfo.healthIssues.length > 0;
      case 'health_goals':
        return formData.healthInfo.healthGoals.length > 0;
      case 'target_areas':
        return formData.healthInfo.targetAreas.length > 0;
      case 'dietary_preferences':
        return formData.healthInfo.dietaryPreferences.length > 0;
      case 'lifestyle':
        return formData.healthInfo.activityLevel.length > 0 && formData.healthInfo.stressLevel.length > 0;
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
      await userProfileService.completeHealthSurvey(formData.healthInfo);
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

      case 'health_welcome':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4
              }}
            >
              <ApperIcon name="Heart" size={96} className="text-error mx-auto" />
            </motion.div>
            
            <div>
              <Text variant="heading" size="4xl" weight="bold" className="mb-4">
                Health & Wellness Survey
              </Text>
              <Text color="muted" size="lg" className="max-w-md mx-auto">
                Understanding your health background helps us create safer, more effective workouts tailored to your needs.
              </Text>
            </div>
          </motion.div>
        );

      case 'health_issues':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <ApperIcon name="AlertTriangle" size={64} className="text-warning mx-auto mb-4" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthIssueOptions.map((issue, index) => (
                <motion.button
                  key={issue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleHealthArrayToggle('healthIssues', issue.id)}
                  className={`p-6 rounded-2xl text-left transition-all duration-200 border ${
                    formData.healthInfo.healthIssues.includes(issue.id)
                      ? 'bg-warning/20 border-warning text-warning'
                      : 'bg-surface border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <ApperIcon 
                      name={issue.icon} 
                      size={32}
                      className={formData.healthInfo.healthIssues.includes(issue.id) ? 'text-warning' : 'text-gray-400'} 
                    />
                    <div>
                      <Text weight="semibold" size="lg">
                        {issue.label}
                      </Text>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 'health_goals':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <ApperIcon name="Heart" size={64} className="text-success mx-auto mb-4" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthGoalOptions.map((goal, index) => (
                <motion.button
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleHealthArrayToggle('healthGoals', goal.id)}
                  className={`p-6 rounded-2xl text-left transition-all duration-200 border ${
                    formData.healthInfo.healthGoals.includes(goal.id)
                      ? 'bg-success/20 border-success text-success'
                      : 'bg-surface border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <ApperIcon 
                      name={goal.icon} 
                      size={32}
                      className={formData.healthInfo.healthGoals.includes(goal.id) ? 'text-success' : 'text-gray-400'} 
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

      case 'target_areas':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <ApperIcon name="Target" size={64} className="text-primary mx-auto mb-4" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {targetAreaOptions.map((area, index) => (
                <motion.button
                  key={area.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleHealthArrayToggle('targetAreas', area.id)}
                  className={`p-6 rounded-2xl text-center transition-all duration-200 border ${
                    formData.healthInfo.targetAreas.includes(area.id)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-surface border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <ApperIcon 
                    name={area.icon} 
                    size={32}
                    className={`mx-auto mb-3 ${
                      formData.healthInfo.targetAreas.includes(area.id) ? 'text-primary' : 'text-gray-400'
                    }`} 
                  />
                  <Text size="sm" weight="medium" className="break-words">
                    {area.label}
                  </Text>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 'dietary_preferences':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <ApperIcon name="Leaf" size={64} className="text-accent mx-auto mb-4" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dietaryOptions.map((diet, index) => (
                <motion.button
                  key={diet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleHealthArrayToggle('dietaryPreferences', diet.id)}
                  className={`p-6 rounded-2xl text-left transition-all duration-200 border ${
                    formData.healthInfo.dietaryPreferences.includes(diet.id)
                      ? 'bg-accent/20 border-accent text-accent'
                      : 'bg-surface border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <ApperIcon 
                      name={diet.icon} 
                      size={32}
                      className={formData.healthInfo.dietaryPreferences.includes(diet.id) ? 'text-accent' : 'text-gray-400'} 
                    />
                    <div>
                      <Text weight="semibold" size="lg">
                        {diet.label}
                      </Text>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 'medical_info':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <ApperIcon name="Shield" size={64} className="text-info mx-auto mb-4" />
            </div>
            
            <div className="space-y-6">
              <div>
                <Text size="sm" color="muted" className="mb-2">Current medications (optional)</Text>
                <Input
                  type="text"
                  placeholder="List any medications you're taking"
                  value={formData.healthInfo.medications.join(', ')}
                  onChange={(e) => handleHealthInfoChange('medications', e.target.value.split(', ').filter(m => m.trim()))}
                  icon="Pill"
                />
              </div>
              
              <div>
                <Text size="sm" color="muted" className="mb-2">Known allergies (optional)</Text>
                <Input
                  type="text"
                  placeholder="List any allergies or sensitivities"
                  value={formData.healthInfo.allergies.join(', ')}
                  onChange={(e) => handleHealthInfoChange('allergies', e.target.value.split(', ').filter(a => a.trim()))}
                  icon="AlertTriangle"
                />
              </div>
              
              <div>
                <Text size="sm" color="muted" className="mb-2">Injuries or physical limitations (optional)</Text>
                <Input
                  type="text"
                  placeholder="Describe any injuries or limitations"
                  value={formData.healthInfo.fitnessLimitations}
                  onChange={(e) => handleHealthInfoChange('fitnessLimitations', e.target.value)}
                  icon="Ban"
                />
              </div>
            </div>
          </motion.div>
        );

      case 'lifestyle':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <ApperIcon name="Activity" size={64} className="text-secondary mx-auto mb-4" />
            </div>
            
            {/* Activity Level */}
            <div>
              <Text weight="semibold" className="mb-4">Current activity level</Text>
              <div className="space-y-3">
                {activityLevelOptions.map((level, index) => (
                  <motion.button
                    key={level.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleHealthInfoChange('activityLevel', level.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 border ${
                      formData.healthInfo.activityLevel === level.id
                        ? 'bg-secondary/20 border-secondary text-secondary'
                        : 'bg-surface border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <ApperIcon 
                        name={level.icon} 
                        size={24}
                        className={formData.healthInfo.activityLevel === level.id ? 'text-secondary' : 'text-gray-400'} 
                      />
                      <div>
                        <Text weight="semibold">
                          {level.label}
                        </Text>
                        <Text size="sm" color="muted">
                          {level.description}
                        </Text>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Sleep Hours */}
            <div>
              <Text weight="semibold" className="mb-4">Average sleep hours per night</Text>
              <div className="grid grid-cols-4 gap-3">
                {[5, 6, 7, 8, 9, 10].map(hours => (
                  <button
                    key={hours}
                    onClick={() => handleHealthInfoChange('sleepHours', hours)}
                    className={`p-3 rounded-lg text-center transition-all duration-200 border ${
                      formData.healthInfo.sleepHours === hours
                        ? 'bg-info/20 border-info text-info'
                        : 'bg-surface border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <Text weight="bold">{hours}h</Text>
                  </button>
                ))}
              </div>
            </div>

            {/* Stress Level */}
            <div>
              <Text weight="semibold" className="mb-4">Current stress level</Text>
              <div className="grid grid-cols-3 gap-3">
                {stressLevelOptions.map(stress => (
                  <button
                    key={stress.id}
                    onClick={() => handleHealthInfoChange('stressLevel', stress.id)}
                    className={`p-4 rounded-xl text-center transition-all duration-200 border ${
                      formData.healthInfo.stressLevel === stress.id
                        ? 'bg-warning/20 border-warning text-warning'
                        : 'bg-surface border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <ApperIcon 
                      name={stress.icon} 
                      size={24}
                      className={`mx-auto mb-2 ${
                        formData.healthInfo.stressLevel === stress.id ? 'text-warning' : 'text-gray-400'
                      }`} 
                    />
                    <Text size="sm" weight="medium">{stress.label}</Text>
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
                FitForge AI now has everything needed to create personalized, safe workouts tailored to your health and fitness goals!
              </Text>
            </div>

            {/* Summary */}
            <div className="bg-surface rounded-2xl p-6 text-left max-w-md mx-auto">
              <Text weight="semibold" className="mb-4">Your Complete Profile:</Text>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <Text color="muted">Fitness Goals:</Text>
                  <Text>{formData.goals.length} selected</Text>
                </div>
                <div className="flex justify-between">
                  <Text color="muted">Health Goals:</Text>
                  <Text>{formData.healthInfo.healthGoals.length} selected</Text>
                </div>
                <div className="flex justify-between">
                  <Text color="muted">Target Areas:</Text>
                  <Text>{formData.healthInfo.targetAreas.length} selected</Text>
                </div>
                <div className="flex justify-between">
                  <Text color="muted">Experience:</Text>
                  <Text className="capitalize">{formData.experience}</Text>
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
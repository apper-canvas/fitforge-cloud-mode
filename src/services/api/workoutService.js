import workoutsData from '../mockData/workouts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WorkoutService {
  constructor() {
    this.data = [...workoutsData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const workout = this.data.find(w => w.id === id);
    return workout ? { ...workout } : null;
  }

  async getTodaysWorkout() {
    await delay(250);
    const today = new Date().toDateString();
    const todaysWorkout = this.data.find(w => 
      new Date(w.date).toDateString() === today && !w.completed
    );
    return todaysWorkout ? { ...todaysWorkout } : null;
  }

  async generateWorkout(userProfile) {
    await delay(800); // Simulate AI processing time
    
    const exercises = this.generateExercises(userProfile);
    const newWorkout = {
      id: `workout_${Date.now()}`,
      date: new Date().toISOString(),
      exercises,
      duration: 0,
      completed: false,
      type: userProfile.goals?.[0] || 'strength',
      difficulty: userProfile.experience || 'beginner'
    };
    
    this.data.push(newWorkout);
    return { ...newWorkout };
  }

  generateExercises(userProfile) {
    const { goals = [], equipment = [], experience = 'beginner' } = userProfile;
    
    const exercisePool = {
      strength: [
        { name: 'Push-ups', category: 'chest', equipment: 'bodyweight' },
        { name: 'Squats', category: 'legs', equipment: 'bodyweight' },
        { name: 'Deadlifts', category: 'back', equipment: 'barbell' },
        { name: 'Bench Press', category: 'chest', equipment: 'barbell' },
        { name: 'Overhead Press', category: 'shoulders', equipment: 'barbell' },
        { name: 'Pull-ups', category: 'back', equipment: 'pull-up bar' }
      ],
      cardio: [
        { name: 'Jumping Jacks', category: 'cardio', equipment: 'bodyweight' },
        { name: 'Burpees', category: 'cardio', equipment: 'bodyweight' },
        { name: 'Mountain Climbers', category: 'cardio', equipment: 'bodyweight' },
        { name: 'High Knees', category: 'cardio', equipment: 'bodyweight' }
      ]
    };

    const baseReps = experience === 'beginner' ? 8 : experience === 'intermediate' ? 10 : 12;
    const baseSets = experience === 'beginner' ? 3 : 4;

    const selectedExercises = [];
    const primaryGoal = goals[0] || 'strength';
    const availableExercises = exercisePool[primaryGoal] || exercisePool.strength;

    // Filter by available equipment
    const filteredExercises = availableExercises.filter(ex => 
      ex.equipment === 'bodyweight' || equipment.includes(ex.equipment)
    );

    // Select 4-6 exercises
    const numExercises = Math.min(filteredExercises.length, experience === 'beginner' ? 4 : 6);
    for (let i = 0; i < numExercises; i++) {
      const exercise = filteredExercises[i % filteredExercises.length];
      selectedExercises.push({
        id: `ex_${Date.now()}_${i}`,
        name: exercise.name,
        category: exercise.category,
        sets: baseSets,
        reps: baseReps + Math.floor(Math.random() * 4),
        weight: exercise.equipment === 'bodyweight' ? 0 : 45,
        restTime: primaryGoal === 'strength' ? 180 : 60
      });
    }

    return selectedExercises;
  }

  async completeWorkout(id, duration) {
    await delay(300);
    const workout = this.data.find(w => w.id === id);
    if (workout) {
      workout.completed = true;
      workout.duration = duration;
      workout.completedAt = new Date().toISOString();
    }
    return workout ? { ...workout } : null;
  }

  async delete(id) {
    await delay(200);
    this.data = this.data.filter(w => w.id !== id);
    return true;
  }
}

const workoutService = new WorkoutService();
export default workoutService;
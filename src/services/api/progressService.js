import { workoutLogService } from '../index';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProgressService {
  async getStreak() {
    await delay(200);
    const logs = await workoutLogService.getAll();
    
    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    // Check consecutive days working backwards from today
    while (true) {
      const dateStr = currentDate.toDateString();
      const hasWorkout = logs.some(log => 
        new Date(log.timestamp).toDateString() === dateStr
      );
      
      if (hasWorkout) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (streak === 0 && currentDate.toDateString() === today.toDateString()) {
        // Haven't worked out today, check yesterday
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }

  async getWeeklyStats() {
    await delay(300);
    const logs = await workoutLogService.getRecentLogs(7);
    
    const stats = {
      workoutsCompleted: logs.length,
      totalVolume: 0,
      avgDuration: 0,
      personalRecords: 0
    };
    
    logs.forEach(log => {
      // Calculate total volume (weight × reps)
      log.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          if (set.completed) {
            stats.totalVolume += (set.weight || 0) * (set.reps || 0);
          }
        });
      });
      
      // Add duration
      stats.avgDuration += log.duration || 0;
    });
    
    if (logs.length > 0) {
      stats.avgDuration = Math.round(stats.avgDuration / logs.length);
    }
    
    return stats;
  }

  async getProgressChart(exerciseName, days = 30) {
    await delay(400);
    const logs = await workoutLogService.getRecentLogs(days);
    
    const exerciseData = [];
    
    logs.forEach(log => {
      const exercise = log.exercises.find(ex => ex.exerciseId === exerciseName);
      if (exercise) {
        const bestSet = exercise.sets
          .filter(set => set.completed)
          .reduce((best, current) => {
            const currentTotal = (current.weight || 0) * (current.reps || 0);
            const bestTotal = (best.weight || 0) * (best.reps || 0);
            return currentTotal > bestTotal ? current : best;
          }, { weight: 0, reps: 0 });
        
        if (bestSet.weight > 0 || bestSet.reps > 0) {
          exerciseData.push({
            date: new Date(log.timestamp).toISOString().split('T')[0],
            weight: bestSet.weight || 0,
            reps: bestSet.reps || 0,
            volume: (bestSet.weight || 0) * (bestSet.reps || 0)
          });
        }
      }
    });
    
    return exerciseData.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  async getPersonalRecords() {
    await delay(350);
    const logs = await workoutLogService.getAll();
    const records = {};
    
    logs.forEach(log => {
      log.exercises.forEach(exercise => {
        const exerciseName = exercise.exerciseId;
        if (!records[exerciseName]) {
          records[exerciseName] = {
            maxWeight: 0,
            maxReps: 0,
            maxVolume: 0,
            date: null
          };
        }
        
        exercise.sets.forEach(set => {
          if (set.completed) {
            const volume = (set.weight || 0) * (set.reps || 0);
            
            if (set.weight > records[exerciseName].maxWeight) {
              records[exerciseName].maxWeight = set.weight;
              records[exerciseName].date = log.timestamp;
            }
            
            if (set.reps > records[exerciseName].maxReps) {
              records[exerciseName].maxReps = set.reps;
            }
            
            if (volume > records[exerciseName].maxVolume) {
              records[exerciseName].maxVolume = volume;
            }
          }
        });
      });
    });
    
    return records;
  }
}

const progressService = new ProgressService();
export default progressService;
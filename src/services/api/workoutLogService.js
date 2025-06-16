import workoutLogData from '../mockData/workoutLogs.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WorkoutLogService {
  constructor() {
    this.data = [...workoutLogData];
  }

  async getAll() {
    await delay(300);
    return [...this.data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getById(id) {
    await delay(200);
    const log = this.data.find(l => l.id === id);
    return log ? { ...log } : null;
  }

  async getByWorkoutId(workoutId) {
    await delay(250);
    return this.data
      .filter(l => l.workoutId === workoutId)
      .map(l => ({ ...l }));
  }

  async getRecentLogs(days = 30) {
    await delay(300);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return this.data
      .filter(l => new Date(l.timestamp) >= cutoffDate)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map(l => ({ ...l }));
  }

  async create(logData) {
    await delay(400);
    const newLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...logData
    };
    this.data.push(newLog);
    return { ...newLog };
  }

  async updateExerciseSet(logId, exerciseIndex, setIndex, setData) {
    await delay(200);
    const log = this.data.find(l => l.id === logId);
    if (log && log.exercises[exerciseIndex] && log.exercises[exerciseIndex].sets[setIndex]) {
      log.exercises[exerciseIndex].sets[setIndex] = {
        ...log.exercises[exerciseIndex].sets[setIndex],
        ...setData,
        timestamp: new Date().toISOString()
      };
      return { ...log };
    }
    return null;
  }

  async addSet(logId, exerciseIndex, setData) {
    await delay(200);
    const log = this.data.find(l => l.id === logId);
    if (log && log.exercises[exerciseIndex]) {
      const newSet = {
        id: `set_${Date.now()}`,
        reps: setData.reps || 0,
        weight: setData.weight || 0,
        completed: false,
        timestamp: new Date().toISOString()
      };
      log.exercises[exerciseIndex].sets.push(newSet);
      return { ...log };
    }
    return null;
  }

  async delete(id) {
    await delay(200);
    this.data = this.data.filter(l => l.id !== id);
    return true;
  }
}

const workoutLogService = new WorkoutLogService();
export default workoutLogService;
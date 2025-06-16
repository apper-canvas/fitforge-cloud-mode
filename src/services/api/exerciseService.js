import exerciseData from '../mockData/exercises.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ExerciseService {
  constructor() {
    this.data = [...exerciseData];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(150);
    const exercise = this.data.find(e => e.id === id);
    return exercise ? { ...exercise } : null;
  }

  async getByCategory(category) {
    await delay(200);
    return this.data.filter(e => e.category === category).map(e => ({ ...e }));
  }

  async searchByName(query) {
    await delay(250);
    const lowerQuery = query.toLowerCase();
    return this.data
      .filter(e => e.name.toLowerCase().includes(lowerQuery))
      .map(e => ({ ...e }));
  }

  async getFormTips(exerciseId) {
    await delay(300);
    const exercise = this.data.find(e => e.id === exerciseId);
    if (!exercise || !exercise.formTips) {
      return [];
    }
    return [...exercise.formTips];
  }
}

const exerciseService = new ExerciseService();
export default exerciseService;
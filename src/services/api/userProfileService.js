import userProfileData from '../mockData/userProfile.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserProfileService {
  constructor() {
    this.data = JSON.parse(JSON.stringify(userProfileData));
  }

  async getProfile() {
    await delay(200);
    return { ...this.data };
  }

  async updateProfile(updates) {
    await delay(300);
    this.data = { ...this.data, ...updates };
    return { ...this.data };
  }

  async setupProfile(profileData) {
    await delay(400);
    this.data = {
      ...this.data,
      ...profileData,
      isSetupComplete: true,
      createdAt: new Date().toISOString()
    };
    return { ...this.data };
  }

  async isSetupComplete() {
    await delay(100);
    return this.data.isSetupComplete || false;
  }
}

const userProfileService = new UserProfileService();
export default userProfileService;
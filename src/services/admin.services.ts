import databaseService from './database.services';

class AdminServie {
  async getAllActivities() {
    const activities = await databaseService.activities
      .find(
        {},
        {
          projection: {
            _id: 0
            // activityLatitude: 0,
            // activityLongitude: 0
          }
        }
      )
      .toArray();
    return activities;
  }

  async createActivity(activity: any) {
    const result = await databaseService.activities.insertOne(activity);
    return result;
  }
}

const adminService = new AdminServie();
export default adminService;

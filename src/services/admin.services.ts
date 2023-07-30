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

  async getActivityByCode(code: string) {
    const activity = await databaseService.activities.findOne(
      {
        code: code
      },
      {
        projection: {
          _id: 0
        }
      }
    );
    return activity;
  }

  async editActivityByCode(code: string, activity: any) {
    const result = await databaseService.activities.updateOne(
      {
        code: code
      },
      {
        $set: activity
      }
    );
    return result;
  }
  async deleteActivityByCode(code: string) {
    const result = await databaseService.activities.deleteOne({
      code: code
    });
    return result;
  }

  async createActivity(activity: any) {
    const result = await databaseService.activities.insertOne(activity);
    return result;
  }
}

const adminService = new AdminServie();
export default adminService;

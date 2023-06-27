import { ObjectId } from 'mongodb';
interface ActivityType {
  _id?: ObjectId;
  activityName: string;
  code: string;
  startTime: string;
  endTime: string;
  activityLatitude: string;
  activityLongitude: string;
  flexLocation: string;
  score?: number;

  created_at?: Date;
  updated_at?: Date;
}

class Activity {
  _id: ObjectId;
  activityName: string;
  code: string;
  startTime: string;
  endTime: string;
  activityLatitude?: string;
  activityLongitude?: string;
  flexLocation?: string;
  score?: number;
  created_at?: Date;
  updated_at?: Date;

  constructor(activity: ActivityType) {
    const date = new Date();
    this._id = activity._id || new ObjectId();
    this.activityName = activity.activityName || '';
    this.code = activity.code || '';
    this.startTime = activity.startTime || '';
    this.endTime = activity.endTime || '';
    this.activityLatitude = activity.activityLatitude || '';
    this.activityLongitude = activity.activityLongitude || '';
    this.flexLocation = activity.flexLocation || '';
    this.score = activity.score || 0;
    this.created_at = activity.created_at || date;
    this.updated_at = activity.updated_at || date;
  }
}

export default Activity;

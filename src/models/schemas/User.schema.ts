import { ObjectId } from 'mongodb';

enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}
interface UserType {
  _id: ObjectId;
  name: string;
  MSV: string;
  email: string;
  password: string;
  schoolYear: string;
  class: string;
  email_verify_token: string;
  forgot_password_token: string;
  verify: UserVerifyStatus;
  created_at: Date;
  updated_at: Date;

  activities: string[];
  totalScore: number;
}

class User {
  _id: ObjectId;
  name: string;
  MSV: string;
  email: string;
  password: string;
  schoolYear: string;
  class: string;
  email_verify_token: string;
  forgot_password_token: string;
  verify: UserVerifyStatus;
  created_at: Date;
  updated_at: Date;

  activities: string[];
  totalScore: number;
  constructor(user: UserType) {
    this._id = user._id;
    this.name = user.name;
    this.MSV = user.MSV;
    this.email = user.email;
    this.password = user.password;
    this.schoolYear = user.schoolYear;
    this.class = user.class;
    this.email_verify_token = user.email_verify_token;
    this.forgot_password_token = user.forgot_password_token;
    this.verify = user.verify;
    this.created_at = user.created_at;
    this.updated_at = user.updated_at;

    this.activities = user.activities;
    this.totalScore = user.totalScore;
  }
}

export default User;

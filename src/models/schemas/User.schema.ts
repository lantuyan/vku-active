import { ObjectId } from 'mongodb';
import { UserVerifyStatus } from '~/constants/enum';
interface UserType {
  _id?: ObjectId;
  name: string;
  msv: string;
  email: string;
  password: string;
  schoolYear?: string;
  class?: string;
  email_verify_token?: string;
  forgot_password_token?: string;
  verify?: UserVerifyStatus;
  created_at?: Date;
  updated_at?: Date;

  activities?: string[];
  totalScore?: number;

  date_of_birth: Date;
}

class User {
  _id: ObjectId;
  name: string;
  msv: string;
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

  date_of_birth: Date;
  constructor(user: UserType) {
    const date = new Date();
    this._id = user._id || new ObjectId();
    this.name = user.name || '';
    this.msv = user.msv || '';
    this.email = user.email;
    this.password = user.password;
    this.schoolYear = user.schoolYear || '';
    this.class = user.class || '';
    this.email_verify_token = user.email_verify_token || '';
    this.forgot_password_token = user.forgot_password_token || '';
    this.verify = user.verify || UserVerifyStatus.Unverified;
    this.created_at = user.created_at || date;
    this.updated_at = user.updated_at || date;

    this.activities = user.activities || [];
    this.totalScore = user.totalScore || 0;

    this.date_of_birth = user.date_of_birth || new Date();
  }
}

export default User;

import { Request, Response } from 'express';
import { RegisterRequestBody } from '~/models/requests/User.requests';
import User from '~/models/schemas/User.schema';
import databaseService from '~/services/database.services';

class UsersService {
  async register(payload: RegisterRequestBody) {
    // const { email, password } = payload;
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth)
      })
    );
    return result;
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email });
    console.log(user);
    return Boolean(user);
  }
}

const userService = new UsersService();
export default userService;

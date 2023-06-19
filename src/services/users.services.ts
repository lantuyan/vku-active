import { Request, Response } from 'express';
import User from '~/models/schemas/User.schema';
import databaseService from '~/services/database.services';

class UsersService {
  async register(payload: { email: string; password: string }) {
    const { email, password } = payload;
    const result = await databaseService.users.insertOne(
      new User({
        email,
        password
      })
    );
    return result;
  }
}

const userService = new UsersService();
export default userService;

import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ObjectId } from 'mongodb';
import { USERS_MESSAGES } from '~/constants/messages';
import { RegisterRequestBody } from '~/models/requests/User.requests';
import User from '~/models/schemas/User.schema';
import databaseService from '~/services/database.services';
import userService from '~/services/users.services';

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User;
  const user_id = user._id as ObjectId;

  // const user = req.user as User;
  // const user_id = user._id as ObjectId;

  // console.log(_id);
  const result = await userService.login(user_id.toString());
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  });
};

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  // // const { email, password } = req.body;
  // throw new Error('test error');
  const result = await userService.register(req.body);
  console.log(result);
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  });
};

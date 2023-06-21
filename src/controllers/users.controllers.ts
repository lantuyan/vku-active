import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { RegisterRequestBody } from '~/models/requests/User.requests';
import User from '~/models/schemas/User.schema';
import databaseService from '~/services/database.services';
import userService from '~/services/users.services';

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email === 'lantuyan@gmail.com' && password === '123456') {
    return res.status(200).json({
      message: 'login success'
    });
  }
  return res.status(400).json({
    message: 'email or password is wrong'
  });
};

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  // const { email, password } = req.body;
  try {
    const result = await userService.register(req.body);
    console.log(result);
    return res.json({
      message: 'Register success',
      result
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Register failed'
    });
  }
};

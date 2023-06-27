import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ObjectId } from 'mongodb';
import { UserVerifyStatus } from '~/constants/enum';
import HTTP_STATUS from '~/constants/httpStatus';
import { USERS_MESSAGES } from '~/constants/messages';
import {
  LoginRequestBody,
  LogoutRequestBody,
  RegisterRequestBody,
  TokenPayload,
  VerifyEmailRequestBody
} from '~/models/requests/User.requests';
import User from '~/models/schemas/User.schema';
import databaseService from '~/services/database.services';
import userService from '~/services/users.services';
import { getDistance, getPreciseDistance } from 'geolib';

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const user = req.user as User;
  const user_id = user._id as ObjectId;

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

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
  const { refresh_token } = req.body;
  const result = await userService.logout(refresh_token);
  return res.json(result);
};

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload;
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  });
  // Not found user. ==>> status 404
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    });
  }
  // Đã verify. ==>> status OK
  if (user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED
    });
  }
  const result = await userService.verifyEmail(user_id);
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  });
};

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) });
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    });
  }
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED
    });
  }

  const result = await userService.resendVerifyEmail(user_id);
  return res.json(result);
};

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload;
  const user = await userService.getUserInfo(user_id);
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    });
  }
  return res.json({
    message: USERS_MESSAGES.GET_USER_INFO_SUCCESS,
    result: user
  });
};

export const signActivityController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload;

  const { code, userLatitude, userLongitude } = req.body;
  // Check code is exist in user
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id),
    activities: {
      $eq: code
    }
  });
  if (user) {
    return res.json({
      message: USERS_MESSAGES.ACTIVITY_ALREADY_IN_USER
    });
  }
  // Check latitude and longitude equal
  const Location = await databaseService.activities.findOne({
    code: code
  });

  const pointUser = { latitude: userLatitude, longitude: userLongitude };
  const pointActivity = { latitude: Location?.activityLatitude, longitude: Location?.activityLongitude };

  if (Location) {
    console.log(Location.activityLatitude, Location.activityLongitude, userLatitude, userLongitude);
    const distance = getPreciseDistance(
      { lat: parseFloat(pointUser.latitude), lng: parseFloat(pointUser.longitude) },
      { lat: parseFloat(pointActivity.latitude as string), lng: parseFloat(pointActivity.longitude as string) }
    );
    console.log('distance ' + distance);
    if (distance > 100) {
      return res.json({
        message:
          USERS_MESSAGES.USER_NOT_CORRECT_LOCATION +
          `. Bạn đang cách trường ${distance} mét. Vui lòng đến gần trường để hoàn thành hoạt động.`
      });
    }
    // return res.json({
    //   message: USERS_MESSAGES.USER_NOT_CORRECT_LOCATION
    // });
  }

  const result = await userService.signActivity(user_id, code);
  return res.json({
    message: USERS_MESSAGES.SIGN_ACTIVITY_SUCCESS,
    result
  });
};

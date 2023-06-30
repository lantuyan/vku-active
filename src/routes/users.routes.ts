// import express from 'express';
// const usersRouter = express.Router();
import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import {
  verifyEmailController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  getMeController,
  signActivityController,
  forgotPasswordController,
  getActivityInfoController,
  getallActivitiesofUserController
} from '~/controllers/users.controllers';
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  signActivityValidator
} from '~/middlewares/users.middlewares';
import { wrapRequestHandler } from '~/utils/handlers';
const usersRouter = Router();

/**
 * Login a new user
 * Path: /users/login
 * POST
 * Body{
 * email: string,
 * password: string,
 * }
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController));

/**
 * Register a new user
 * Path: /users/register
 * POST
 * Body{
 * name: string,
 * MSV: string,
 * email: string,
 * password: string,
 * confirmPassword: string,
 * date_of_birth: ISO8601,
 * }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController));

/**
 * Logout a user
 * Path: /users/logout
 * POST
 * Header{Authorization: Bearer <access_token>}
 * Body{ refresh_token: string, }
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController));

/**
 * Verify email of a user
 * Path: user/verify-email
 * POST
 * Body{  email_verify_token?: string; }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController));

/**
 * Verify email of a user
 * Path: user/resend-verify-email
 * POST
 * Header{Authorization: Bearer <access_token>}
 * Body{}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController));

/**
 * Submit email to reset password of a user, send email to user
 * Path: user/forgot-password
 * POST
 * Body{email: string}
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController));

/**
 * Get my profile
 * Path: users/userInfo
 * GET
 * Header{Authorization: Bearer <access_token>}
 * Body{}
 */
usersRouter.get('/userInfo', accessTokenValidator, wrapRequestHandler(getMeController));
/**
 * Get activity info
 * Path: users/activityInfo
 * GET
 * Header{Authorization: Bearer <access_token>}
 * Body{code: string}
 */
usersRouter.get('/activityInfo', accessTokenValidator, wrapRequestHandler(getActivityInfoController));

/**
 * Get activity info
 * Path: users/allActivitiesofUser
 * GET
 * Header{Authorization: Bearer <access_token>}
 * Body{}
 */
usersRouter.get('/allActivitiesofUser', accessTokenValidator, wrapRequestHandler(getallActivitiesofUserController));

/**
 * SignActivivy
 * Path: users/signAcitivy
 * POST
 * Header{Authorization: Bearer <access_token>}
 * Body{
 * activity: string,
 * }
 */
usersRouter.post(
  '/signActivity',
  accessTokenValidator,
  signActivityValidator,
  wrapRequestHandler(signActivityController)
);

export default usersRouter;

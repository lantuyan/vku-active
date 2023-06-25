// import express from 'express';
// const usersRouter = express.Router();
import { Router } from 'express';
import {
  emailVerifyController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController
} from '~/controllers/users.controllers';
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
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
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(emailVerifyController));

/**
 * Verify email of a user
 * Path: user/resend-verify-email
 * POST
 * Header{Authorization: Bearer <access_token>}
 * Body{}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController));

export default usersRouter;

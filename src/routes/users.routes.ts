// import express from 'express';
// const usersRouter = express.Router();
import { Router } from 'express';
import { loginController, registerController } from '~/controllers/users.controllers';
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares';
import { wrapRequestHandler } from '~/utils/handlers';
const usersRouter = Router();

/**
 * Register a new user
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
usersRouter.post(
  '/logout',
  accessTokenValidator,
  refreshTokenValidator,
  wrapRequestHandler((req, res) => {
    res.json({ message: 'logout' });
  })
);
export default usersRouter;

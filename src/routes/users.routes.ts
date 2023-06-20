// import express from 'express';
// const usersRouter = express.Router();
import { Router } from 'express';
import { loginController, registerController } from '~/controllers/users.controllers';
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares';
const usersRouter = Router();

usersRouter.post('/login', loginValidator, loginController);

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
usersRouter.post('/register', registerValidator, registerController);
export default usersRouter;

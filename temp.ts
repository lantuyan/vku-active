import { Router } from 'express';
const usersRouter = Router();
//middleware
usersRouter.use(
  (req, res, next) => {
    console.log('Time:', Date.now());
    next();
  },
  (req, res, next) => {
    console.log('Time 2:', Date.now());
    next();
  }
);

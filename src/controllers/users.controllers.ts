import { Request, Response } from 'express';

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

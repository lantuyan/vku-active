import { Request, Response, NextFunction } from 'express';
import { checkSchema } from 'express-validator';
import { validate } from '~/utils/validation';

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: 'email and password are required'
    });
  }
  next();
};

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 3,
          max: 100
        }
      },
      trim: true
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true
    },
    msv: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 6,
          max: 20
        }
      },
      trim: true
    },
    password: {
      notEmpty: true,
      isLength: {
        options: {
          min: 6,
          max: 100
        }
      },
      isStrongPassword: {
        errorMessage:
          'Password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol',
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        }
      }
    },
    confirm_password: {
      notEmpty: true,
      isLength: {
        options: {
          min: 6,
          max: 100
        }
      },
      isStrongPassword: {
        errorMessage:
          'Password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number and 1 symbol',
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        }
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Password confirmation is incorrect');
          }
          return true;
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
);

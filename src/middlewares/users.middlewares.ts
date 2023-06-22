import { Request, Response, NextFunction } from 'express';
import { checkSchema } from 'express-validator';
import { USERS_MESSAGES } from '~/constants/messages';
import { ErrorWithStatus } from '~/models/Errors';
import userService from '~/services/users.services';
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
      notEmpty: {
        errorMessage: USERS_MESSAGES.NAME_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.NAME_MUST_BE_STRING
      },
      isLength: {
        options: {
          min: 3,
          max: 100
        },
        errorMessage: USERS_MESSAGES.NAME_LENGTH
      },
      trim: true
    },
    email: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.EMAIL_REQUIRED
      },
      isEmail: {
        errorMessage: USERS_MESSAGES.EMAIL_INVALID
      },
      trim: true,
      custom: {
        options: async (value) => {
          const isExistEmail = await userService.checkEmailExist(value);
          if (isExistEmail) {
            throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS);
          }
          return true;
        }
      }
    },
    msv: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.MSV_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.MSV_MUST_BE_STRING
      },
      isLength: {
        options: {
          min: 6,
          max: 20
        },
        errorMessage: USERS_MESSAGES.MSV_LENGTH
      },
      trim: true
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.PASSWORD_REQUIRED
      },
      isLength: {
        options: {
          min: 6,
          max: 100
        },
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH
      },
      isStrongPassword: {
        errorMessage: USERS_MESSAGES.PASSWORD_STRONG,
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
      notEmpty: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_REQUIRED
      },
      isLength: {
        options: {
          min: 6,
          max: 100
        },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH
      },
      isStrongPassword: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_STRONG,
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
            throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_MATCH);
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
        },
        errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO08601
      }
    }
  })
);

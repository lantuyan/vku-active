import { Request, Response, NextFunction } from 'express';
import { checkSchema } from 'express-validator';
import { JsonWebTokenError } from 'jsonwebtoken';
import { capitalize } from 'lodash';
import HTTP_STATUS from '~/constants/httpStatus';
import { USERS_MESSAGES } from '~/constants/messages';
import { ErrorWithStatus } from '~/models/Errors';
import databaseService from '~/services/database.services';
import userService from '~/services/users.services';
import { hashPassword } from '~/utils/crypto';
import { verifyToken } from '~/utils/jwt';
import { validate } from '~/utils/validation';

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            // const user = await databaseService.users.findOne({ email: value });
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            });
            if (user === null) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT);
            }
            req.user = user;
            return true;
          }
        }
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
        }
        // isStrongPassword: {
        //   errorMessage: USERS_MESSAGES.PASSWORD_STRONG,
        //   options: {
        //     minLength: 8,
        //     minLowercase: 1,
        //     minUppercase: 1,
        //     minNumbers: 1,
        //     minSymbols: 1
        //   }
        // }
        // custom: {
        //   options: async (value) => {
        //     const user = await databaseService.users.findOne({ email: value, password: hashPassword(req.body.password) });
        //     if (isExistEmail) {
        //       throw new Error(USERS_MESSAGES.USER_NOT_FOUND);
        //     }
        //     return true;
        //   }
        // }
      }
    },
    ['body']
  )
);

export const registerValidator = validate(
  checkSchema(
    {
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
    },
    ['body']
  )
);

export const accessTokenValidator = validate(
  checkSchema(
    {
      authorization: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.ACCESS_TOKEN_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1];
            if (!access_token) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              });
            }
            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              });
              (req as Request).decoded_authorization = decoded_authorization;
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HTTP_STATUS.UNAUTHORIZED
              });
            }

            return true;
          }
        }
      }
    },
    ['headers']
  )
);

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.REFRESH_TOKEN_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
                databaseService.refreshTokens.findOne({ token: value })
              ]);
              // const decoded_refresh_token = await verifyToken({ token: value });
              // await databaseService.refreshTokens.findOne({ token: value });
              // req.decoded_refresh_token = decoded_refresh_token;
              if (!refresh_token) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.REFRESH_TOKEN_USED_OR_NOT_EXISTS,
                  status: HTTP_STATUS.UNAUTHORIZED
                });
              }
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize((error as JsonWebTokenError).message),
                  status: HTTP_STATUS.UNAUTHORIZED
                });
              }
              throw error;
            }

            return true;
          }
        }
      }
    },
    ['body']
  )
);

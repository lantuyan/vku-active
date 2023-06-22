import express from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema';
import HTTP_STATUS from '~/constants/httpStatus';
import { EntityError, ErrorWithStatus } from '~/models/Errors';
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validations.run(req);
    const errors = validationResult(req);
    // If not empty ==> next
    if (errors.isEmpty()) {
      return next();
    }

    const errorsObject = errors.mapped();
    console.log(errorsObject);
    const entityError = new EntityError({ errors: {} });

    for (const key in errorsObject) {
      const { msg } = errorsObject[key];
      // Trả về lỗi không phải của validation
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg);
      }
      entityError.errors[key] = errorsObject[key];
    }

    // res.status(422).json({ errors: errors.mapped() });
    // Trả về lỗi của validation
    next(entityError);
  };
};

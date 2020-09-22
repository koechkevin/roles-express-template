import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const validationMiddleware = (dataSchema: any, property: string) => {
  return (request: Request, response: Response, next: NextFunction) => {
    // @ts-ignore
    Joi.validate(request[property], dataSchema, (err, value) => {
      if (err) {
        response.status(422).json([{
          field: err.details[0].context.key,
          message: err.details[0].message,
        }]);
      } else {
        next();
      }
    });
  };
};

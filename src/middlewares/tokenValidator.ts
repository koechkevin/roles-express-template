import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export const tokenMiddleware = (request: Request, response: Response, next: NextFunction) => {
  let token = request.header('authorization');

  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    verify(token, process.env.SECRET_KEY, (error, decoded) => {
      if (error) {
        response.status(401).json({ message: 'Invalid token provided' });
      } else {
        request.app.locals.userData = decoded;
        next();
      }
    });
  } else {
    response.status(403).json({ message: 'No auth token provided' });
  }
};

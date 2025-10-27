import { NextFunction, Request, Response } from 'express';
import { ServiceUnavailableException, UnauthorizedException } from '../common/error';
import { getEnvOrThrow } from '../common/util';
import Logger from '../common/logger';
import jwt from 'jsonwebtoken';

const logger = new Logger("UserAuth");

interface UserJWTPayload {
  id: string;
  email: string;
}

export default async (req: Request, _: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedException("Authorization token missing"));
  }

  try {
    const decoded = jwt.verify(token, getEnvOrThrow('JWT_SECRET')) as UserJWTPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email
    };
    return next();
  } catch (error) {
    if (error instanceof ServiceUnavailableException) {
      // this is an internal error
      return next(error); 
    }
    return next(new UnauthorizedException("Invalid or expired token"));
  }
};
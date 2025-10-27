import { NextFunction, Request, Response } from 'express';
import { ServiceUnavailableException, UnauthorizedException } from '../common/error';
import { getEnvOrThrow } from '../common/util';
import { timingSafeEqual } from 'crypto';
import Logger from '../common/logger';
import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

const logger = new Logger("InternalAuth");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 requests per minute
  message: () => ({
    status: StatusCodes.TOO_MANY_REQUESTS,
    message: "Too many requests, please try again later.",
    data: null
  }),
});

const compareKeys = (a: string, b: string): boolean => {
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
};

export default [limiter, async (req: Request, _: Response, next: NextFunction) => {
  try {
    const internalKey = getEnvOrThrow("INTERNAL_SERVICE_KEY");
    const keyFromHeader = req.headers['x-barnksforte-client-key'] as string;

    if (!keyFromHeader) {
      logger.error(`Missing internal key header from IP: ${req.ip}`);
      return next(new UnauthorizedException("Missing internal key header"));
    }


    if (!compareKeys(internalKey, keyFromHeader)) {
      logger.error(`Invalid internal key attempt from IP: ${req.ip}`);
      return next(new UnauthorizedException("Invalid internal key"));
    }

    return next();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal auth failed";
    
    logger.error(message);
    if (error instanceof ServiceUnavailableException) {
      // this is an internal error
      return next(error); 
    }
    return next(new UnauthorizedException(message));
  }
}];
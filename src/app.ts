import express, { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'express-validation'
import helmet from 'helmet'
import cors from "cors";
import hpp from "hpp";
import compression from "compression";
import { StatusCodes } from 'http-status-codes'
import { ServiceError, UnauthorizedException } from './common/error'
import dotenv from 'dotenv';
import routes from '.'

dotenv.config();

const setupMiddleware = (app: express.Application) => {
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  }));
  app.use(hpp());
  app.use(compression({
    level: 6,
    threshold: 100 * 1024 // Only compress responses larger than 100kb
  }));
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
}

const app = express();

setupMiddleware(app);

app.get('/', (_: Request, res: Response) => {
  res.send('<h1>I am okay 👍</h1>')
})

app.use('/v1/', routes)

app.get('/health', async (_req, res, _next) => {
  const healthcheck = {
    uptime: process.uptime(),
    responsetime: process.hrtime()?.[0],
    message: 'OK',
    status: StatusCodes.OK,
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    security: {
      cors: true,
      helmet: true,
      rateLimit: true,
      inputValidation: true
    }
  };

  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error instanceof Error ? error.message : "";
    res.status(StatusCodes.SERVICE_UNAVAILABLE).send();
  }
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ValidationError) {
    const errors = Object.values(err.details)
    .flat()
    .map((detail) => ({
      field: detail.context?.key,
      description: detail?.message,
    }))

    return res.status(err.statusCode).json({
      status: StatusCodes.BAD_REQUEST,
      message: errors?.[0]?.description,
      data: null
    })
  }

  if (err instanceof ServiceError) {
    if(err instanceof UnauthorizedException) {
      return res.status(err.code).json({
        status: err.code,
        message: err.message,
        data: null
      });
    }

    return res.status(err.code).json({
      status: err.code,
      message: err.message,
      data: null
    });
  }

  if (err instanceof Error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      message: err.message,
      data: null
    })
  }

  return res.status(StatusCodes.BAD_REQUEST).json({
    status: StatusCodes.BAD_REQUEST,
    message: 'Something went wrong while processing request',
    data: null
  })
})

export default app
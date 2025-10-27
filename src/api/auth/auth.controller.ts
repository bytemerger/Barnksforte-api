import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import AuthService from './auth.service';

export default class AuthController {
  private service = new AuthService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.service.register(req.body);

      res.status(StatusCodes.CREATED).json({
        status: StatusCodes.CREATED,
        message: 'User registered successfully',
        data: response || null 
      })
    } catch (err) {
      next(err)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.service.login(req.body);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Login successful',
        data: response || null 
      })
    } catch (err) {
      next(err)
    }
  }
}
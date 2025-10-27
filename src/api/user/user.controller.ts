import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import UserService from './user.service';

export default class UserController {
  private service = new UserService();

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.service.getUsers();

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Users retrieved successfully',
        data: response || null 
      })
    } catch (err) {
      next(err)
    }
  }
  
  updateUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.service.updateUserPassword(req.params.id, req.body);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Password updated successfully',
        data: response || null 
      })
    } catch (err) {
      next(err)
    }
  }

  createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.service.createPost(req.params.id, req.body);

      res.status(StatusCodes.CREATED).json({
        status: StatusCodes.CREATED,
        message: 'Post created successfully',
        data: response || null 
      })
    } catch (err) {
      next(err)
    }
  }

  getUserPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.service.getUserPosts(req.params.id);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'User posts retrieved successfully',
        data: response || null 
      })
    } catch (err) {
      next(err)
    }
  }

  getUserPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.service.getUserPost(req.params.id, req.params.postId);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Post retrieved successfully',
        data: response || null 
      })
    } catch (err) {
      next(err)
    }
  }

  deleteUserPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteUserPost(req.params.id, req.params.postId);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Post deleted successfully',
        data: null 
      })
    } catch (err) {
      next(err)
    }
  }

  getUserSharedPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await this.service.getUserSharedPosts(req.params.id);

      res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Shared posts retrieved successfully',
        data: response || null 
      })
    } catch (err) {
      next(err)
    }
  }
}
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ConflictException, UnauthorizedException } from "../../common/error";
import User from "../../models/user";
import Logger from "../../common/logger";
import { ILogin, IRegister } from "./auth.interface";
import { getEnvOrThrow } from '../../common/util';
import redis from "../../common/redis";

export default class AuthService {
  private logger = new Logger(this.constructor.name);
  private readonly MAX_ATTEMPTS = 3

  async register(payload: IRegister) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const salt = bcrypt.genSaltSync(12);
    const password = bcrypt.hashSync(payload.password, salt);

    const user = await User.create({
      email: payload.email,
      password: password,
    });

    this.logger.info(`New user registered: ${user.email}`);
    
    return user;
  }

  async login(payload: ILogin) {
    const user = await User.findOne({ email: payload.email });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (user?.block.isBlocked) {
      throw new UnauthorizedException(`Your user account is blocked. Please contact support.`); 
    }

    const isPasswordValid = bcrypt.compareSync(payload.password, user.password);
    if (!isPasswordValid) {
      const key = `login_attempts:${payload.email}`;
      const attempts = await redis.incr(key);

      if (attempts === 1) {
        await redis.expire(key, 60 * 60); // expire in 1 hour
      }

      if (attempts >= this.MAX_ATTEMPTS) {
        user.block = {
          isBlocked: true,
          reason: 'Too many failed login attempts',
          blockedAt: new Date()
        };
        await user.save();
        await redis.del(key);
      }

      throw new UnauthorizedException(`Invalid email or password. You have ${this.MAX_ATTEMPTS - attempts} more attempts`);
    }

    await redis.del(`login_attempts:${payload.email}`);

    // Generate JWT token
    const token = jwt.sign({ 
      sub: user.email, 
      id: user.id 
    }, getEnvOrThrow('JWT_SECRET'), { 
      expiresIn: '30min' 
    });  

    return {
      authToken: token,
      user: {
        id: user.id,
        email: user.email
      }
    };
  }
}
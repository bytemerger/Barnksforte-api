import * as bcrypt from 'bcryptjs';
import { BadRequestException, NotFoundException } from "../../common/error";
import User from "../../models/user";
import Post, { IPost } from "../../models/post";
import Logger from "../../common/logger";
import { 
  IUpdateUserPasswordPayload,
  ICreatePostPayload,
} from "./user.interface";
import { Types } from "mongoose";
import Mail from '../../common/mail';

export default class UserService {
  private logger = new Logger(this.constructor.name);

  async getUsers() {
    const users = await User.find();
    return users;
  }

  async updateUserPassword(userId: string, payload: IUpdateUserPasswordPayload) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isPasswordValid = bcrypt.compareSync(payload.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException("Invalid current password");
    }
    
    const salt = bcrypt.genSaltSync(12);
    const password = bcrypt.hashSync(payload.newPassword, salt);

    await User.findByIdAndUpdate(userId, { password });

    return { success: "Password updated successfully" };
  }

  async createPost(userId: string, payload: ICreatePostPayload) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const post = await Post.create({
      content: payload.content,
      author: new Types.ObjectId(userId),
      sharedWith: payload.sharedWith ? payload.sharedWith.map(id => new Types.ObjectId(id)) : [],
    });

    // If shared users are specified, validate they exist
    if (payload.sharedWith && payload.sharedWith.length > 0) {
      const sharedUsers = await User.find({ _id: { $in: payload.sharedWith } });
      if (sharedUsers.length !== payload.sharedWith.length) {
        throw new BadRequestException("One or more shared users not found");
      }

      // TODO: Implement email notifications
      // await this.sendEmailNotifications(post, payload.sharedWith);
    }

    this.logger.info(`Created post ${post._id} by user ${userId}`);
    return post;
  }

  async getUserPosts(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
    return posts;
  }

  async getUserPost(userId: string, postId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const post = await Post.findOne({ _id: postId, author: userId });
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return post;
  }

  async deleteUserPost(userId: string, postId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const post = await Post.findOneAndDelete({ _id: postId, author: userId });
    if (!post) {
      throw new NotFoundException("Post not found");
    }

    this.logger.info(`Deleted post ${postId} by user ${userId}`);
    return { success: "Post deleted successfully" };
  }

  async getUserSharedPosts(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const sharedPosts = await Post.find({ 
      sharedWith: userId 
    })
    .populate('author', 'email')
    .sort({ createdAt: -1 });

    return sharedPosts;
  }

  private async sendEmailNotifications(post: IPost, sharedUserIds: string[]) {
    const sharedUsers = await User.find({ _id: { $in: sharedUserIds } });
    const emails = sharedUsers.map(user => user.email);
    await Mail.sendSharedPostEmail(emails, post);
  }
}
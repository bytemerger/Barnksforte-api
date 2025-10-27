import { validate } from "express-validation";
import { Joi } from "express-validation";
import { IUpdateUserPasswordPayload, ICreatePostPayload } from "./user.interface";

export const updateUserPassword = validate({
  body: Joi.object<IUpdateUserPasswordPayload>({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  })
})

export const createPost = validate({
  body: Joi.object<ICreatePostPayload>({
    content: Joi.string().min(1).max(280).required(),
    sharedWith: Joi.array().items(Joi.string()).optional(),
  })
})
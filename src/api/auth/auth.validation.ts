import { validate } from "express-validation";
import { Joi } from "express-validation";
import { ILogin, IRegister } from "./auth.interface";

export const login = validate({
  body: Joi.object<ILogin>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  })
})

export const register = validate({
  body: Joi.object<IRegister>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  })
})
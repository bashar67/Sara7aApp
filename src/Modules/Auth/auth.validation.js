import joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";

export const signupSchema = {
  body: joi.object({
    firstName: generalFields.firstName.required(),
    lastName: generalFields.lastName.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword,
    gender: generalFields.gender,
    phone: generalFields.phone,
  }),
};

export const loginSchema = {
  body: joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  }),
};

export const confirmEmailSchema = {
  body: joi.object({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
  }),
};

export const forgetPasswordSchema = {
  body: joi.object({
    email: generalFields.email.required(),
  }),
};

export const resetPasswordSchema = {
  body: joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword,
    otp: generalFields.otp.required(),
  }),
};

export const updatePasswordSchema = {
  body: joi.object({
    oldPassword: joi.string().required(),
    newPassword: generalFields.password.required(),
    confirmPassword: joi.ref("newPassword"),
  }),
};

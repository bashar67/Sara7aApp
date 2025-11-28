import joi from "joi";
import { Types } from "mongoose";
import { genderEnum } from "../DB/models/user.model.js";

export const validate = (schema) => {
  return (req, res, next) => {
    const validationErrors = [];

    for (const key of Object.keys(schema)) {
      const validationResults = schema[key].validate(req[key], {
        abortEarly: false,
      });

      if (validationResults.error) {
        validationErrors.push({
          key,
          details: validationResults.error.details,
        });
      }

      if (validationErrors.length) {
        return res.status(400).json({
          status: "fail",
          message: "validation error",
          details: validationErrors,
        });
      }
    }
    return next();
  };
};

export const generalFields = {
  firstName: joi.string().min(2).max(20).messages({
    "string.min": "First name should have at least 2 characters",
    "string.max": "First name should have at most 20 characters",
    "any.required": "First name is mandatory",
  }),
  lastName: joi.string().min(2).max(20).messages({
    "string.min": "Last name should have at least 2 characters",
    "string.max": "Last name should have at most 20 characters",
    "any.required": "Last name is mandatory",
  }),
  email: joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 5,
    tlds: { allow: ["com", "net", "org", "io"] },
  }),
  password: joi.string(),
  confirmPassword: joi.ref("password"),
  gender: joi
    .string()
    .valid(...Object.values(genderEnum))
    .default("MALE"),
  phone: joi.string().pattern(/^[0-9]{10,15}$/),
  otp: joi.string(),
  id: joi.string().custom((value, helper) => {
    return Types.ObjectId.isValid(value) || helper.message("Invalid ID format");
  }),
  file: {
    fieldname: joi.string(),
    originalname: joi.string(),
    encoding: joi.string(),
    mimetype: joi.string(),
    destination: joi.string(),
    filename: joi.string(),
    finalPath: joi.string(),
    path: joi.string(),
    size: joi.number().positive(),
  },
};

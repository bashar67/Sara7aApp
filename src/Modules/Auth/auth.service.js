import UserModel from "../../DB/models/user.model.js";
import TokenModel from "../../DB/models/token.model.js";
import { successResponse } from "../../Utils/successResponse.utils.js";
import * as dbService from "../../DB/dbService.js";
import {
  asymmetricEncrypt,
  encrypt,
} from "../../Utils/Encryption/encryption.utils.js";
import { compareHash, hash } from "../../Utils/Hashing/hashing.utils.js";
import { eventEmitter } from "../../Utils/Events/email.event.utils.js";
import { customAlphabet } from "nanoid";
import { generateToken, verifyToken } from "../../Utils/Tokens/token.utils.js";
import { v4 as uuid } from "uuid";

export const signup = async (req, res, next) => {
  const { firstName, lastName, email, password, gender, phone } = req.body;

  // check if user already exists
  const existingUser = await dbService.findOne({
    model: UserModel,
    filter: { email },
  }); // null  or document(truthy value)

  if (existingUser)
    return next(new Error("User already exists", { cause: 409 }));

  // generate otp
  const otp = customAlphabet("1234567890hjnxkzlpqrak", 6)();

  const newUser = await dbService.create({
    model: UserModel,
    data: [
      {
        firstName,
        lastName,
        email,
        password: await hash({ plainText: password }),
        phone: asymmetricEncrypt(phone),
        confirmEmailOTP: await hash({ plainText: otp }),
        gender,
      },
    ],
  });

  // emit confirm email event
  eventEmitter.emit("confirmEmail", { to: email, otp, firstName });

  return successResponse({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: { newUser },
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // check if user already exists
  const existingUser = await dbService.findOne({
    model: UserModel,
    filter: { email },
  });

  if (!existingUser) return next(new Error("User not exists", { cause: 404 }));
  if (
    !(await compareHash({ plainText: password, hash: existingUser.password }))
  )
    return next(new Error("Invalid password or email", { cause: 400 }));

  if (!existingUser.confirmEmail)
    return next(new Error("Please confirm your email first", { cause: 400 }));

  const accessToken = generateToken({
    payload: { id: existingUser._id, email: existingUser.email },
    secretKey: process.env.JWT_SECRET_KEY,
    options: {
      expiresIn: parseInt(process.env.JWT_EXPIRES_IN),
      issuer: "http://localhost:3000",
      audience: "http://localhost:4000",
      jwtid: uuid(), // use for revoke token
    },
  });

  const refreshToken = generateToken({
    payload: { id: existingUser._id, email: existingUser.email },
    secretKey: process.env.JWT_REFRESH_KEY,
    options: {
      expiresIn: parseInt(process.env.REFRESH_JWT_EXPIRES_IN),
      issuer: "http://localhost:3000",
      audience: "http://localhost:4000",
      jwtid: uuid(), // use for revoke token
    },
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "User LoggedIn successfully",
    data: { accessToken, refreshToken },
  });
};

export const confirmEmail = async (req, res, next) => {
  const { email, otp } = req.body;

  // check if user already exists
  const existingUser = await dbService.findOne({
    model: UserModel,
    filter: {
      email,
      confirmEmail: { $exists: false },
      confirmEmailOTP: { $exists: true },
    },
  });

  if (!existingUser)
    return next(
      new Error("User Not Found or email already confirmed", { cause: 404 })
    );
  if (
    !(await compareHash({ plainText: otp, hash: existingUser.confirmEmailOTP }))
  )
    return next(new Error("Invalid otp", { cause: 400 }));

  // update user confirmEmail fields
  await dbService.updateOne({
    model: UserModel,
    filter: { email },
    data: {
      confirmEmail: Date.now(),
      $unset: { confirmEmailOTP: true },
      $inc: { __v: 1 },
    },
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Email Confirmed successfully",
  });
};

export const logout = async (req, res, next) => {
  await dbService.create({
    model: TokenModel,
    data: [
      {
        jwtid: req.decodedToken.jti,
        expiresIn: new Date(req.decodedToken.exp * 1000),
        userId: req.decodedToken._id,
      },
    ],
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Logged out successfully",
  });
};

export const refreshToken = async (req, res, next) => {
  const { refreshtoken } = req.headers;

  const decodedToken = verifyToken({
    token: refreshtoken,
    secretKey: process.env.JWT_REFRESH_KEY,
  });

  const accessToken = generateToken({
    payload: { id: decodedToken.id, email: decodedToken.email },
    secretKey: process.env.JWT_SECRET_KEY,
    options: {
      expiresIn: parseInt(process.env.JWT_EXPIRES_IN),
      jwtid: uuid(),
    },
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Token Refreshed  successfully",
    data: { accessToken },
  });
};

import UserModel, { providerEnum } from "../../DB/models/user.model.js";
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
import { OAuth2Client } from "google-auth-library";

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
      jwtid: uuid(), // use for revoke token
    },
  });

  const refreshToken = generateToken({
    payload: { id: existingUser._id, email: existingUser.email },
    secretKey: process.env.JWT_REFRESH_KEY,
    options: {
      expiresIn: parseInt(process.env.REFRESH_JWT_EXPIRES_IN),
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
        // userId: req.decodedToken._id,
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

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  const otp = customAlphabet("1234567890hjnxkzlpqrak", 6)();

  const user = await dbService.findOneAndUpdate({
    model: UserModel,
    filter: {
      email,
      confirmEmail: { $exists: true },
    },
    data: {
      forgetPasswordOTP: {
        code: await hash({ plainText: otp }),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // expires in 5 minutes
      },
    },
  });

  if (!user)
    return next(
      new Error("User Not Found or email not confirmed", { cause: 404 })
    );
  // emit forget password event
  eventEmitter.emit("forgetPassword", {
    to: email,
    otp,
    firstName: user.firstName,
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Forget password OTP sent to email successfully",
  });
};

export const updatePassword = async (req, res, next) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;

  // verify old password
  if (!(await compareHash({ plainText: oldPassword, hash: user.password })))
    return next(
      new Error("old password not correct please insert the write password", {
        cause: 400,
      })
    );

  // check if new password is different from old password
  if (await compareHash({ plainText: newPassword, hash: user.password }))
    return next(new Error("New password must be different", { cause: 400 }));

  await dbService.updateOne({
    model: UserModel,
    filter: { _id: user._id },
    data: {
      password: await hash({ plainText: newPassword }),
      $inc: { __v: 1 },
    },
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Password Updated successfully",
  });
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;

  const user = await dbService.findOne({
    model: UserModel,
    filter: {
      email,
      confirmEmail: { $exists: true },
    },
  });
  if (!user)
    return next(
      new Error("User Not Found or email not confirmed", { cause: 404 })
    );

  if (
    !(await compareHash({ plainText: otp, hash: user.forgetPasswordOTP.code }))
  )
    return next(new Error("Invalid otp", { cause: 400 }));

  // check if otp expired and remove it from database if expired
  if (user.forgetPasswordOTP.expiresAt < Date.now()) {
    await dbService.updateOne({
      model: UserModel,
      filter: { email },
      data: {
        $unset: { forgetPasswordOTP: true },
        $inc: { __v: 1 },
      },
    });

    return next(new Error("OTP expired", { cause: 400 }));
  }

  await dbService.updateOne({
    model: UserModel,
    filter: { email },
    data: {
      password: await hash({ plainText: password }),
      $unset: { forgetPasswordOTP: true },
      $inc: { __v: 1 },
    },
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Your Password reset successfully",
  });
};

async function verifyGoogleAccount({ idToken }) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  return payload;
}

export const loginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;

  const { email, email_verified, given_name, family_name, picture } =
    await verifyGoogleAccount({ idToken });

  if (!email_verified) {
    return next(new Error("Google account email not verified", { cause: 400 }));
  }

  const user = await dbService.findOne({ model: UserModel, filter: { email } });
  if (user) {
    if (user.providers === providerEnum.GOOGLE) {
      const accessToken = generateToken({
        payload: { id: user._id, email: user.email },
        secretKey: process.env.JWT_SECRET_KEY,
        options: {
          expiresIn: parseInt(process.env.JWT_EXPIRES_IN),
          jwtid: uuid(), // use for revoke token
        },
      });

      const refreshToken = generateToken({
        payload: { id: user._id, email: user.email },
        secretKey: process.env.JWT_REFRESH_KEY,
        options: {
          expiresIn: parseInt(process.env.REFRESH_JWT_EXPIRES_IN),
          jwtid: uuid(), // use for revoke token
        },
      });

      return successResponse({
        res,
        statusCode: 200,
        message: "User LoggedIn successfully",
        data: { accessToken, refreshToken },
      });
    }
  }

  const newUser = await dbService.create({
    model: UserModel,
    data: [
      {
        firstName: given_name,
        lastName: family_name,
        email,
        // profilePic: picture,
        confirmEmail: Date.now(),
        providers: providerEnum.GOOGLE,
      },
    ],
  });

  const accessToken = generateToken({
    payload: { id: newUser._id, email: newUser.email },
    secretKey: process.env.JWT_SECRET_KEY,
    options: {
      expiresIn: parseInt(process.env.JWT_EXPIRES_IN),
      jwtid: uuid(), // use for revoke token
    },
  });

  const refreshToken = generateToken({
    payload: { id: newUser._id, email: newUser.email },
    secretKey: process.env.JWT_REFRESH_KEY,
    options: {
      expiresIn: parseInt(process.env.REFRESH_JWT_EXPIRES_IN),
      jwtid: uuid(), // use for revoke token
    },
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Login  successfully",
    data: { accessToken, refreshToken },
  });
};

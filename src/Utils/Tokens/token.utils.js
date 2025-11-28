import jwt from "jsonwebtoken";
import { roleEnum } from "../../DB/models/user.model.js";
import { v4 as uuid } from "uuid";

export const signatureEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const generateToken = ({
  payload,
  secretKey = process.env.JWT_SECRET_KEY,
  options = { expiresIn: process.env.JWT_EXPIRES_IN },
}) => {
  return jwt.sign(payload, secretKey, options);
};

export const verifyToken = ({
  token,
  secretKey = process.env.JWT_SECRET_KEY,
}) => {
  return jwt.verify(token, secretKey);
};

export const getSignature = ({ signatureLevel = signatureEnum.USER }) => {
  let signature = { accessSignature: undefined, refreshSignature: undefined };

  switch (signatureLevel) {
    case signatureEnum.ADMIN:
      signature.accessSignature = process.env.JWT_SECRET_ADMIN_KEY;
      signature.refreshSignature = process.env.JWT_REFRESH_ADMIN_KEY;
      break;
    default:
      signature.accessSignature = process.env.JWT_SECRET_USER_KEY;
      signature.refreshSignature = process.env.JWT_REFRESH_USER_KEY;
      break;
  }

  return signature;
};

export const getNewLoginCredentials = async (user) => {
  const signature = await getSignature({
    signatureLevel:
      user.role != roleEnum.USER ? signatureEnum.ADMIN : signatureEnum.USER,
  });

  const jwtid = uuid();

  const accessToken = generateToken({
    payload: { id: user._id, email: user.email },
    secretKey: signature.accessSignature,
    options: {
      expiresIn: parseInt(process.env.JWT_EXPIRES_IN),
      jwtid, // use for revoke token
    },
  });

  const refreshToken = generateToken({
    payload: { id: user._id, email: user.email },
    secretKey: signature.refreshSignature,
    options: {
      expiresIn: parseInt(process.env.REFRESH_JWT_EXPIRES_IN),
      jwtid, // use for revoke token
    },
  });

  return { accessToken, refreshToken };
};

import jwt from "jsonwebtoken";

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

import { verifyToken } from "../Utils/Tokens/token.utils.js";
import * as dbService from "../DB/dbService.js";
import TokenModel from "../DB/models/token.model.js";
import UserModel from "../DB/models/user.model.js";

export const authentication = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(new Error("Authorization token is missing", { cause: 400 }));
  }
  if (!authorization.startsWith(process.env.TOKEN_PREFIX)) {
    return next(new Error("Invalid authorization format", { cause: 400 }));
  }

  const token = authorization.split(" ")[1];

  const decodedToken = verifyToken({
    token,
    secretKey: process.env.JWT_SECRET_KEY,
  });
  if (!decodedToken.jti)
    return next(new Error("Invalid token", { cause: 401 }));

  const revokedToken = await dbService.findOne({
    model: TokenModel,
    filter: { jwtid: decodedToken.jti },
  });
  if (revokedToken)
    return next(
      new Error("Token is revoked, please login again", { cause: 401 })
    );

  // find the user
  const user = await dbService.findById({
    model: UserModel,
    id: decodedToken.id,
  });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  req.user = user;
  req.decodedToken = decodedToken;
  next();
};

import * as dbService from "../../DB/dbService.js";
import UserModel from "../../DB/models/user.model.js";
import TokenModel from "../../DB/models/token.model.js";
import {
  decrypt,
  asymmetricDecrypt,
} from "../../Utils/Encryption/encryption.utils.js";
import { successResponse } from "../../Utils/successResponse.utils.js";
import { verifyToken } from "../../Utils/Tokens/token.utils.js";

export const getAllUsers = async (req, res, next) => {
  let users = await dbService.find({
    model: UserModel,
  });

  users = users.map((user) => {
    return { ...user._doc, phone: asymmetricDecrypt(user.phone) };
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Users fetched successfully",
    data: { users },
  });
};

export const updateUserProfile = async (req, res, next) => {
  const { firstName, lastName, gender } = req.body;

  const user = await dbService.findByIdAndUpdate({
    model: UserModel,
    id: req.decodedToken.id,
    data: {
      firstName,
      lastName,
      gender,
      $inc: { __v: 1 },
    },
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Users fetched successfully",
    data: { user },
  });
};

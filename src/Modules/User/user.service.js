import * as dbService from "../../DB/dbService.js";
import UserModel, { roleEnum } from "../../DB/models/user.model.js";
import {
  decrypt,
  asymmetricDecrypt,
} from "../../Utils/Encryption/encryption.utils.js";
import { successResponse } from "../../Utils/successResponse.utils.js";
import { cloudinaryConfig } from "../../Utils/multer/cloudinary.config.js";

export const getAllUsers = async (req, res, next) => {
  let users = await dbService.find({
    model: UserModel,
    populate: [{ path: "messages", select: "content -_id -receiverId" }],
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
    id: req.decoded.id,
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

export const profileImage = async (req, res, next) => {
  const { public_id, secure_url } = await cloudinaryConfig().uploader.upload(
    req.file.path,
    {
      folder: `sara7aApp/Users/${req.user._id}`,
    }
  );

  const user = await dbService.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },
    data: { cloudProfileImage: { public_id, secure_url } },
  });

  // destroy old image from cloudinary
  if (req.user.cloudProfileImage?.public_id) {
    await cloudinaryConfig().uploader.destroy(
      req.user.cloudProfileImage.public_id
    );
  }

  return successResponse({
    res,
    statusCode: 200,
    message: "image updated  successfully",
    data: { user },
  });
};

export const coverImages = async (req, res, next) => {
  const attachment = [];

  for (const file of req.files) {
    const { public_id, secure_url } = await cloudinaryConfig().uploader.upload(
      file.path,
      {
        folder: `sara7aApp/Users/${req.user._id}/coverImages`,
      }
    );
    attachment.push({ public_id, secure_url });
  }

  const user = await dbService.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },
    data: {
      cloudCoverImages: attachment,
    },
  });

  if (req.user.cloudCoverImages?.length > 0) {
    // destroy old images from cloudinary
    for (const img of req.user.cloudCoverImages) {
      await cloudinaryConfig().uploader.destroy(img.public_id);
    }
  }

  return successResponse({
    res,
    statusCode: 200,
    message: "cover image updated  successfully",
    data: { user },
  });
};

export const freezeAccount = async (req, res, next) => {
  const { userId } = req.params;
  if (userId && req.user.role !== roleEnum.ADMIN) {
    return next(new Error("Only admin can freeze other users' accounts"));
  }

  const updatedUser = await dbService.findOneAndUpdate({
    model: UserModel,
    filter: {
      _id: userId || req.user._id,
      freezedAt: { $exists: false },
    },
    data: {
      freezedAt: new Date(),
      freezedBy: req.user._id,
      // remove restore info if exists
      $unset: {
        restoredFromFreezedAt: "",
        restoredFromFreezedBy: "",
      },
    },
  });

  return updatedUser
    ? successResponse({
        res,
        statusCode: 200,
        message: "Account freezed successfully",
        data: { user: updatedUser },
      })
    : next(new Error("Account is already freezed or user not found"));
};

export const restoreFreezedAccount = async (req, res, next) => {
  const { userId } = req.params;

  const frozenUser = await dbService.findById({
    model: UserModel,
    id: userId,
  });

  const userRequestUnfreeze = req.user;

  if (!frozenUser) return next(new Error("User not found"), { cause: 404 });

  // if the user who requested to unfreeze  was not the one who freezed the account
  //he will not be authorized to unfreeze it
  // user => user
  // admin => admin
  if (!frozenUser.freezedBy.equals(userRequestUnfreeze._id)) {
    return next(new Error("You are not authorized to restore this account"), {
      cause: 403,
    });
  } else if (frozenUser.freezedBy.equals(userRequestUnfreeze._id)) {
    const updatedUser = await dbService.findOneAndUpdate({
      model: UserModel,
      filter: {
        _id: userId,
        freezedAt: { $exists: true },
        freezedBy: { $exists: true },
      },
      data: {
        $unset: {
          freezedAt: true,
          freezedBy: true,
        },
        restoredFromFreezedAt: new Date(),
        restoredFromFreezedBy: req.user._id,
      },
    });

    return updatedUser
      ? successResponse({
          res,
          statusCode: 200,
          message: "Account restored successfully",
          data: { user: updatedUser },
        })
      : next(new Error("Account is already freezed or user not found"));
  }
};

// delete user account (soft delete)
export const deleteAccount = async (req, res, next) => {
  const { userId } = req.params;
  if (userId && req.user.role !== roleEnum.ADMIN) {
    return next(new Error("Only admin can delete other users' accounts"));
  }

  const updatedUser = await dbService.findOneAndUpdate({
    model: UserModel,
    filter: {
      _id: userId || req.user._id,
      deletedAt: { $exists: false },
    },
    data: {
      deletedAt: new Date(),
      deletedBy: req.user._id,
      // remove restore info if exists
      $unset: {
        restoredFromDeletedAt: "",
        restoredFromDeletedBy: "",
      },
    },
  });

  return updatedUser
    ? successResponse({
        res,
        statusCode: 200,
        message: "Account Schedule to delete successfully",
        data: { user: updatedUser },
      })
    : next(new Error("Account is already deleted or user not found"));
};

export const restoreDeletedAccount = async (req, res, next) => {
  const { userId } = req.params;

  const deletedUser = await dbService.findById({
    model: UserModel,
    id: userId,
  });

  const userRequestUnDelete = req.user;

  if (!deletedUser) return next(new Error("User not found"), { cause: 404 });

  // if the user who requested to UnDelete  was not the one who freezed the account
  //he will not be authorized to UnDelete it
  // user => user
  // admin => admin
  if (!deletedUser.deletedBy.equals(userRequestUnDelete._id)) {
    return next(new Error("You are not authorized to restore this account"), {
      cause: 403,
    });
  } else if (deletedUser.deletedBy.equals(userRequestUnDelete._id)) {
    const updatedUser = await dbService.findOneAndUpdate({
      model: UserModel,
      filter: {
        _id: userId,
        deletedAt: { $exists: true },
        deletedBy: { $exists: true },
      },
      data: {
        $unset: {
          deletedAt: true,
          deletedBy: true,
        },
        restoredFromDeletedAt: new Date(),
        restoredFromDeletedBy: req.user._id,
      },
    });

    return updatedUser
      ? successResponse({
          res,
          statusCode: 200,
          message: "Account restored successfully",
          data: { user: updatedUser },
        })
      : next(new Error("Account is already deleted or user not found"));
  }
};

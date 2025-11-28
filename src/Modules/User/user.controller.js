import { Router } from "express";
import * as userService from "./user.service.js";
import {
  authentication,
  authorization,
  tokenTypeEnum,
} from "../../Middlewares/auth.middleware.js";
import {
  fileValidation,
  localUploadMulter,
} from "../../Utils/multer/local.multer.js";
import { fileSignatureValidation } from "../../Middlewares/multerSignature.middleware.js";
import { validate } from "../../Middlewares/validation.middleware.js";
import {
  coverImagesSchema,
  deleteAccountSchema,
  freezeAccountSchema,
  profileImageSchema,
  restoreDeletedAccountSchema,
  restoreFreezedAccountSchema,
} from "./user.validation.js";
import { cloudFileUploadMulter } from "../../Utils/multer/cloud.multer.js";
import { roleEnum } from "../../DB/models/user.model.js";
const router = Router();

router.get("/", userService.getAllUsers);

router.patch(
  "/update",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.USER] }),
  userService.updateUserProfile
);

router.patch(
  "/profile-image",
  authentication,
  authorization({ accessRoles: ["ADMIN"] }),
  // localUploadMulter({
  //   customPath: "User",
  // }).single("profileImages"),
  // validate(profileImageSchema),
  cloudFileUploadMulter({ validation: [...fileValidation.Images] }).single(
    "profileImages"
  ),
  //magic number validation
  fileSignatureValidation({ allowedTypes: [...fileValidation.Images] }),
  userService.profileImage
);

router.patch(
  "/cover-images",
  authentication,
  // localUploadMulter({
  //   customPath: "User",
  // }).array("coverImages", 5),
  // fileSignatureValidation({ allowedTypes: [...fileValidation.Images] }),
  // validate(coverImagesSchema),
  cloudFileUploadMulter({ validation: [...fileValidation.Images] }).array(
    "coverImages",
    4
  ),
  //magic number validation
  fileSignatureValidation({ allowedTypes: [...fileValidation.Images] }),
  userService.coverImages
);

//* freeze account

router.patch(
  "{/:userId}/freeze-account",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
  validate(freezeAccountSchema),
  userService.freezeAccount
);

router.patch(
  "/:userId/restore-freezed-account",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
  validate(restoreFreezedAccountSchema),
  userService.restoreFreezedAccount
);

//* deleting  account (soft delete)
router.patch(
  "{/:userId}/delete-account",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
  validate(deleteAccountSchema),
  userService.deleteAccount
);

router.patch(
  "/:userId/restore-deleted-account",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authorization({ accessRoles: [roleEnum.ADMIN, roleEnum.USER] }),
  validate(restoreDeletedAccountSchema),
  userService.restoreDeletedAccount
);

export default router;

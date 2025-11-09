import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication } from "../../Middlewares/auth.middleware.js";
import { localFileUpload } from "../../Utils/multer/local.multer.js";
const router = Router();

router.get("/", userService.getAllUsers);

router.patch("/update", authentication, userService.updateUserProfile);

router.patch(
  "/profile-image",
  authentication,
  localFileUpload().single("profileImages"),
  userService.profileImage
);

export default router;

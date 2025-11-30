import { Router } from "express";
import * as authService from "./auth.service.js";
import {
  authentication,
  tokenTypeEnum,
} from "../../Middlewares/auth.middleware.js";
import { validate } from "../../Middlewares/validation.middleware.js";
import {
  confirmEmailSchema,
  forgetPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  updatePasswordSchema,
} from "./auth.validation.js";

const router = Router();

router.post("/signup", validate(signupSchema), authService.signup);
router.post("/login", validate(loginSchema), authService.login);
router.patch(
  "/confirm-email",
  validate(confirmEmailSchema),
  authService.confirmEmail
);
router.post(
  "/revoke-token",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authService.logout
);
router.post(
  "/refresh-token",
  authentication({ tokenType: tokenTypeEnum.REFRESH }),
  authService.refreshToken
);
router.patch(
  "/forget-password",
  validate(forgetPasswordSchema),
  authService.forgetPassword
);

router.patch(
  "/update-password",
  validate(updatePasswordSchema),
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  authService.updatePassword
);

router.patch(
  "/confirm-reset-password-otp",
  authService.confirmResetPasswordOTP
);

router.patch(
  "/reset-password",
  validate(resetPasswordSchema),
  authService.resetPassword
);

router.post("/social-login", authService.loginWithGmail);

export default router;

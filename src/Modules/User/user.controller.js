import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication } from "../../Middlewares/auth.middleware.js";
const router = Router();

router.get("/", userService.getAllUsers);

router.patch("/update", authentication, userService.updateUserProfile);

export default router;

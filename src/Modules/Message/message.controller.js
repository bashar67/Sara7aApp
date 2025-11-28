import { Router } from "express";
import * as messageService from "./message.service.js";
import { validate } from "../../Middlewares/validation.middleware.js";
import { sendMessageSchema } from "./message.validation.js";
import {
  authentication,
  tokenTypeEnum,
} from "../../Middlewares/auth.middleware.js";

const router = Router();
router.post(
  "/send-message/:receiverId",
  validate(sendMessageSchema),
  messageService.sendMessage
);
router.get(
  "/get-messages",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  messageService.getMessages
);
router.delete(
  "/delete-messages/:messageId",
  authentication({ tokenType: tokenTypeEnum.ACCESS }),
  messageService.deleteMessages
);

export default router;

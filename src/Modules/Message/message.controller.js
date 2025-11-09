import { Router } from "express";
import * as messageService from "./message.service.js";
import { validate } from "../../Middlewares/validation.middleware.js";
import { sendMessageSchema } from "./message.validation.js";

const router = Router();
router.post(
  "/send-message/:receiverId",
  validate(sendMessageSchema),
  messageService.sendMessage
);
router.get("/get-messages", messageService.getMessages);
export default router;

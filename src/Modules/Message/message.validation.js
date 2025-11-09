import Joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";

export const sendMessageSchema = {
  body: Joi.object({
    content: Joi.string().min(2).max(500).required().messages({
      "string.min": "Message content should be at least 2 character",
      "string.max": "Message content should be at most 500 characters",
      "any.required": "Message content is required",
    }),
  }),
  params: Joi.object({
    receiverId: generalFields.id.required(),
  }),
};

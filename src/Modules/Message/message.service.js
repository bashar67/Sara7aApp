import * as dbService from "../../DB/dbService.js";
import UserModel from "../../DB/models/user.model.js";
import MessageModel from "../../DB/models/message.model.js";
import { successResponse } from "../../Utils/successResponse.utils.js";

export const sendMessage = async (req, res, next) => {
  const { content } = req.body;
  const { receiverId } = req.params;

  const user = await dbService.findById({
    model: UserModel,
    id: receiverId,
  });
  if (!user) return next(new Error("User not found"), { cause: 404 });

  const message = await dbService.create({
    model: MessageModel,
    data: [
      {
        content,
        receiverId: user._id,
      },
    ],
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "Message sent successfully",
    data: { message },
  });
};

export const getMessages = async (req, res, next) => {
  const receiverId = req.user.id;

  if (!receiverId)
    return next(new Error("Receiver ID is required"), { cause: 400 });

  const messages = await dbService.find({
    model: MessageModel,
    filter: { receiverId },
    populate: {
      path: "receiverId",
      select: "firstName lastName email gender -_id",
    },
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Message fetched successfully",
    data: { messages },
  });
};

export const deleteMessages = async (req, res, next) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  if (!messageId)
    return next(new Error("Message ID is required"), { cause: 400 });

  const message = await dbService.findOne({
    model: MessageModel,
    filter: { _id: messageId, receiverId: userId },
  });

  if (!message)
    return next(new Error("Message not found or not authorized"), {
      cause: 403,
    });

  await dbService.deleteOne({
    model: MessageModel,
    filter: { _id: messageId },
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "Message deleted successfully",
  });
};

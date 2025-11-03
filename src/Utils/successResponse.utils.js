export const successResponse = ({
  res,
  statusCode = 201,
  message = "done",
  data = {},
}) => {
  return res.status(statusCode).json({ message, data });
};

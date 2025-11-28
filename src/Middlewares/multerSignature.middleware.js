import { fileTypeFromBuffer } from "file-type";
import fs from "fs";

// Middleware to validate file type by magic number (file signatures)
export const fileSignatureValidation = ({ allowedTypes = [] }) => {
  return async (req, res, next) => {
    try {
      const files = req.files || (req.file ? [req.file] : []);
      const invalidFiles = [];

      for (const file of files) {
        const filePath = file.path;

        const buffer = fs.readFileSync(filePath);
        const type = await fileTypeFromBuffer(buffer);

        if (!type || !allowedTypes.includes(type.mime)) {
          invalidFiles.push(filePath);
        }
      }

      for (const path of invalidFiles) {
        fs.unlinkSync(path);
      }

      if (invalidFiles.length > 0) {
        return next(new Error(`Invalid file type: ${invalidFiles.join(", ")}`));
      }

      return next();
    } catch (error) {
      console.error("File validation error:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
        stack: error.stack,
      });
    }
  };
};

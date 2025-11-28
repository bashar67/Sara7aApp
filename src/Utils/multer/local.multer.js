import multer from "multer";
import path from "node:path";
import fs from "node:fs";

export const fileValidation = {
  Images: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
  Video: ["video/mp4", "video/mpeg", "video/quicktime", "video/x-ms-wmv"],
  Audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/aac", "audio/flac"],
  Documents: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

export const localUploadMulter = ({ customPath = "", validation = [] }) => {
  const basePath = `uploads/${customPath}`; // uploads/User
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let userBasePath = basePath;
      if (req.user?._id) userBasePath += `/${req.user._id}`; // uploads/User/_id
      const fullPath = path.resolve(`./src/${userBasePath}`); //get full path for file
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true }); // create folder if not exist

      cb(null, fullPath);
    },

    filename: (req, file, cb) => {
      const uniqueSuffix =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        "-" +
        file.originalname;
      file.finalPath = `${basePath}/${req.user?._id}/${uniqueSuffix}`; // to store in DB
      cb(null, uniqueSuffix);
    },
  });

  // const fileFilter = (req, file, cb) => {
  //   if (validation.includes(file.mimetype)) {
  //     cb(null, true);
  //   } else if (!type || !validation.includes(type.mime)) {
  //     cb(new Error("Invalid file type"), false);
  //   }
  // };

  return multer({ storage });
};

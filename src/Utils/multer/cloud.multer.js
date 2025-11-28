import multer from "multer";

export const cloudFileUploadMulter = ({ validation = [] }) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (validation.includes(file.mimetype)) {
      cb(null, true);
    } else if (!type || !validation.includes(type.mime)) {
      cb(new Error("Invalid file type"), false);
    }
  };

  return multer({ fileFilter, storage });
};

// {
//     "message": "image updated  successfully",
//     "data": {
//         "cloudinary": {
//             "asset_id": "45a98357567b3eb1e910e0ebb7c0e8eb",
//             "public_id": "sara7aApp/Users/690a12105346b03857295564/ewbikhkefuap3fwqdcv1",
//             "version": 1763061573,
//             "version_id": "2bf592f959572d2e1422cd2643643db9",
//             "signature": "3c7863bb6a788963a63ec384f335781d9deedbd6",
//             "width": 3840,
//             "height": 2160,
//             "format": "jpg",
//             "resource_type": "image",
//             "created_at": "2025-11-13T19:19:33Z",
//             "tags": [],
//             "bytes": 2786526,
//             "type": "upload",
//             "etag": "37a32ab67d035ee70ff0dfd5495037a4",
//             "placeholder": false,
//             "url": "http://res.cloudinary.com/dqtuuunsw/image/upload/v1763061573/sara7aApp/Users/690a12105346b03857295564/ewbikhkefuap3fwqdcv1.jpg",
//             "secure_url": "https://res.cloudinary.com/dqtuuunsw/image/upload/v1763061573/sara7aApp/Users/690a12105346b03857295564/ewbikhkefuap3fwqdcv1.jpg",
//             "asset_folder": "sara7aApp/Users/690a12105346b03857295564",
//             "display_name": "ewbikhkefuap3fwqdcv1",
//             "original_filename": "c8f0baa66320cb28c42989e0287a12bd",
//             "api_key": "186396444659751"
//         }
//     }
// }

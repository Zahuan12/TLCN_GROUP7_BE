const multer = require("multer");

// 1. Các định dạng cho phép
const allowedImageMimes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
];

const allowedDocMimes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword"
];

// 2. Magic bytes signatures cho kiểm tra file thật
const magicSignatures = {
  pdf: "25504446",          // %PDF
  docx: "504b0304",         // ZIP
  jpg: "ffd8ffe0",
  jpg_alt: "ffd8ffe1",
  png: "89504e47",
  gif: "47494638",
  webp: "52494646"
};

// 3. Multer dùng memoryStorage
const storage = multer.memoryStorage();

// 4. MIME filter
const fileFilter = (req, file, cb) => {
  const mime = file.mimetype;

  const isImage = allowedImageMimes.includes(mime);
  const isDoc = allowedDocMimes.includes(mime);

  if (!isImage && !isDoc) {
    return cb(new Error("Định dạng file không hợp lệ"), false);
  }

  cb(null, true);
};

// 5. Kiểm tra magic bytes ngay trong buffer
const validateMagicBytes = (req, res, next) => {
  const files = [];

  if (req.files?.images) files.push(...req.files.images);
  if (req.files?.files) files.push(...req.files.files);

  for (const file of files) {
    const header = file.buffer.subarray(0, 4).toString("hex");

    const valid =
      Object.values(magicSignatures).some(sig => header.startsWith(sig));

    if (!valid) {
      return res.status(400).json({
        message: `Magic bytes không hợp lệ cho file: ${file.originalname}`
      });
    }
  }

  next();
};

// 6. Multer config
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

module.exports = {
  uploadFields: upload.fields([
    { name: "images", maxCount: 10 },
    { name: "files", maxCount: 5 }
  ]),
  validateMagicBytes
};

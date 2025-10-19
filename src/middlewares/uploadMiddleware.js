const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImage = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const allowedDoc = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedImage.includes(file.mimetype) || allowedDoc.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Định dạng file không hợp lệ'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // max 20MB per file
});

module.exports = upload.fields([
  { name: 'images', maxCount: 10 }, // multiple images
  { name: 'files', maxCount: 5 }    // multiple docs
]);

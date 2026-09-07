const multer = require('multer');

/**
 * Multer configuration with memory storage
 * Files are stored in memory as Buffer objects for direct Cloudinary upload
 */
const storage = multer.memoryStorage();

/**
 * File filter — allows audio and image files only
 */
const fileFilter = (req, file, cb) => {
  const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac'];
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const allowedTypes = [...allowedAudioTypes, ...allowedImageTypes];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
});

module.exports = upload;

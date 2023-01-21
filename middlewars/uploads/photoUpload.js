const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// storage

const multerStorage = multer.memoryStorage();

// file type cheking

const mutlerFilter = (req, file, cb) => {
  // check file type

  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    //reject file
    cb({ message: "unSpported file format" }, false);
  }
};

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: mutlerFilter,
  limits: {
    fileSize: 1000000,
  },
});

const profilePhotoResize = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));
  next();
};

const postPhotoResize = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(path.join(`public/images/posts/${req.file.filename}`));
  next();
};

module.exports = {
  photoUpload,
  profilePhotoResize,
  postPhotoResize,
};

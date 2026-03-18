const express = require("express");
const router = express.Router();
const movieController = require("./movie.controller");
const prefix = "";
const {
  verifyAuthAdmin,
  verifyToken,
} = require("../../middlewares/AuthMidlleware");
const multer = require("multer");
const cloudinary = require("../../configs/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Movie",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 300, height: 400, crop: "limit" }],
  },
});
const upload = multer({
  storage: storage,
});
router.post(
  `${prefix}/movie`,
  verifyToken,
  verifyAuthAdmin,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  movieController.postMovie
);
router.put(`${prefix}/view`, movieController.putView);
router.get(`${prefix}/movie`, movieController.getMovie);
router.get(`${prefix}/relationMovie`, movieController.getRelationMovie);
router.delete(
  `${prefix}/movie/`,
  verifyToken,
  verifyAuthAdmin,
  movieController.deleteMovie
);
router.put(
  `${prefix}/movie`,
  verifyToken,
  verifyAuthAdmin,
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  movieController.putMovie
);
module.exports = router;

const express = require("express");
const multer = require("multer");
const cloudinary = require("../../configs/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "User",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 300, height: 400, crop: "limit" }],
  },
});
const upload = multer({
  storage: storage,
});
const router = express.Router();
const userController = require("./user.controller");
const prefix = "";
router.post(
  `${prefix}/register`,
  upload.single("avatar"),
  userController.postRegister
);
router.post(`${prefix}/login`, userController.postLogin);
router.get(`${prefix}/auth/google`, userController.getLoginGoogle);
router.get(
  `${prefix}/auth/google/callback`,
  userController.getResultLoginGoogle
);
router.get(`${prefix}/me`, userController.getMe);
router.put(`${prefix}/update`, upload.single("avatar"), userController.putMe);
router.get(`${prefix}/user`, userController.getUser);
router.put(`${prefix}/admin/user`, userController.putStatus);
module.exports = router;

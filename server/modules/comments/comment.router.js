const express = require("express");
const router = express.Router();
const commentController = require("./comment.controller");
const {
  verifyToken,
  verifyAuthAdmin,
} = require("../../middlewares/AuthMidlleware");
const prefix = "";
router.get(`${prefix}/comment`, commentController.getComment);
router.post(`${prefix}/comment`, verifyToken, commentController.postComment);
router.put(`${prefix}/comment`, verifyToken, commentController.putComment);
router.put(
  `${prefix}/admin/comment`,
  verifyToken,
  verifyAuthAdmin,
  commentController.putBanned
);
module.exports = router;

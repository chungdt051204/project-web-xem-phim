const express = require("express");
const router = express.Router();
const commentController = require("./comment.controller");
const prefix = "";
router.get(`${prefix}/comment`, commentController.getComment);
router.post(`${prefix}/comment`, commentController.postComment);
router.put(`${prefix}/comment`, commentController.putComment);
router.put(`${prefix}/admin/comment`, commentController.putBanned);
module.exports = router;

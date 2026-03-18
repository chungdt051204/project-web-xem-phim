const express = require("express");
const router = express.Router();
const ratingController = require("./rating.controller");
const prefix = "";
const {
  verifyAuthAdmin,
  verifyToken,
} = require("../../middlewares/AuthMidlleware");
router.get(`${prefix}/rating`, ratingController.getRatingUser);
router.post(`${prefix}/rating`, verifyToken, ratingController.postRatingUser);
module.exports = router;

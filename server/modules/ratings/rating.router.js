const express = require("express");
const router = express.Router();
const ratingController = require("./rating.controller");
const prefix = "";
router.get(`${prefix}/rating`, ratingController.getRatingUser);
router.post(`${prefix}/rating`, ratingController.postRatingUser);
module.exports = router;

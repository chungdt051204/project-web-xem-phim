const express = require("express");
const router = express.Router();
const genreController = require("./genre.controller");
const {
  verifyAuthAdmin,
  verifyToken,
} = require("../../middlewares/AuthMidlleware");
const prefix = "";
router.get(`${prefix}/genre`, genreController.getGenre);
router.post(
  `${prefix}/genre`,
  verifyToken,
  verifyAuthAdmin,
  genreController.postGenre
);
router.delete(
  `${prefix}/genre`,
  verifyToken,
  verifyAuthAdmin,
  genreController.deleteGenre
);
router.put(
  `${prefix}/genre`,
  verifyToken,
  verifyAuthAdmin,
  genreController.putGenre
);
module.exports = router;

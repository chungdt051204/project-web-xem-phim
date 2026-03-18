const express = require("express");
const router = express.Router();
const favoriteMovieController = require("./favoriteMovie.controller");
const prefix = "";
const {
  verifyToken,
  verifyAuthAdmin,
} = require("../../middlewares/AuthMidlleware");
router.get(
  `${prefix}/favoriteMovie`,

  favoriteMovieController.getFavoriteMovie
);
router.post(
  `${prefix}/favoriteMovie`,
  verifyToken,
  favoriteMovieController.postFavoriteMovie
);
router.delete(
  `${prefix}/favoriteMovie`,
  verifyToken,
  favoriteMovieController.deleteFavoriteMovie
);
module.exports = router;

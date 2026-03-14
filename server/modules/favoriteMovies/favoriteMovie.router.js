const express = require("express");
const router = express.Router();
const favoriteMovieController = require("./favoriteMovie.controller");
const prefix = "";
router.get(`${prefix}/favoriteMovie`, favoriteMovieController.getFavoriteMovie);
router.post(
  `${prefix}/favoriteMovie`,
  favoriteMovieController.postFavoriteMovie
);
router.delete(
  `${prefix}/favoriteMovie`,
  favoriteMovieController.deleteFavoriteMovie
);
module.exports = router;

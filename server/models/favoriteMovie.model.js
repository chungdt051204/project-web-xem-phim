const mongoose = require("mongoose");
const favoriteMovieSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "userEntity",
      required: true,
    },
    movieId: {
      type: mongoose.Schema.ObjectId,
      ref: "movieEntity",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(
  "favoriteMovieEntity",
  favoriteMovieSchema,
  "favorite_movies"
);

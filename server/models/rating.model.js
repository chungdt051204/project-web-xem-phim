const mongoose = require("mongoose");
const ratingSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("ratingEntity", ratingSchema, "ratings");

const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    genre: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "genreEntity",
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    year: {
      type: Number,
      default: 2099,
    },
    duration: {
      type: String,
      default: "0h 0m",
    },
    rating: {
      type: Number,
      default: 0.0,
    },
    view: {
      type: Number,
      default: 0,
    },
    director: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
movieSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("movieEntity", movieSchema, "movie");

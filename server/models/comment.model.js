const mongoosePaginate = require("mongoose-paginate-v2");
const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
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
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "userEntity",
      },
    ], //1 mảng các Object
    comment: {
      type: String,
      required: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
commentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("commentEntity", commentSchema, "comments");

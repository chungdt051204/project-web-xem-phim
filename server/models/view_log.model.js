const mongoose = require("mongoose");
const viewLogSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Types.ObjectId,
      ref: "movieEntity",
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("viewLogEntity", viewLogSchema, "view_logs");

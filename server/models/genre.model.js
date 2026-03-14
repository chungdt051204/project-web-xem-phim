const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});
genreSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("genreEntity", genreSchema, "genres");

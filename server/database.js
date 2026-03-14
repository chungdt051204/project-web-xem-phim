const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/project");
    console.log("Kết nối thành công");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports = connectDB;

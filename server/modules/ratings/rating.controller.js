const ratingEntity = require("../../models/rating.model");
const movieEntity = require("../../models/movie.model");
exports.getRatingUser = async (req, res) => {
  try {
    const ratingUsers = await ratingEntity.find();
    return res.status(200).json({ result: ratingUsers });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getRatingUser");
    res.status(500).json({
      message: "Lấy đánh giá của người dùng thất bại",
      error: error.message,
    });
  }
};
exports.postRatingUser = async (req, res) => {
  try {
    const { body } = req;
    await ratingEntity.create({ ...body });
    let star = 0;
    let averageStar = 0;
    const ratingsWithMovie = await ratingEntity.find({ movieId: body.movieId });
    if (ratingsWithMovie.length > 0) {
      ratingsWithMovie.forEach((value) => {
        star = star + value.rating;
      });
      averageStar = star / ratingsWithMovie.length;
      await movieEntity.updateOne(
        { _id: body.movieId },
        { rating: averageStar }
      );
      return res.status(200).json({ message: "Đánh giá thành công" });
    }
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postRatingUser");
    res.status(500).json({
      message: "Tạo đánh giá của người dùng thất bại",
      error: error.message,
    });
  }
};

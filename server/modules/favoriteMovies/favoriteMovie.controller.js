const favoriteMovieEntity = require("../../models/favoriteMovie.model");
exports.getFavoriteMovie = async (req, res) => {
  try {
    const payload = req.payload;
    let query = {};
    if (payload) {
      query.userId = payload.sub;
    }
    const favoriteMovie = await favoriteMovieEntity
      .find(query)
      .populate("movieId");
    return res.status(200).json({ result: favoriteMovie });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getFavoriteMovie");
    return res.status(500).json({
      message: "Lấy dữ liệu phim yêu thích thất bại",
      error: error.message,
    });
  }
};
exports.postFavoriteMovie = async (req, res) => {
  try {
    const { body } = req;
    await favoriteMovieEntity.create({ ...body });
    return res
      .status(200)
      .json({ message: "Đã thêm phim vào danh sách yêu thích" });
  } catch (error) {}
};
exports.deleteFavoriteMovie = async (req, res) => {
  try {
    const { id } = req.query;
    const result = await favoriteMovieEntity.deleteOne({ _id: id });
    if (result.deletedCount > 0)
      return res
        .status(200)
        .json({ message: "Đã xóa phim khỏi danh sách yêu thích" });
    return res.status(404).json({ message: "Không tìm thấy phim để xóa" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm deleteFavoriteMovie");
    return res.status(500).json({
      message: "Xóa phim khỏi danh sách yêu thích thất bại",
      error: error.message,
    });
  }
};

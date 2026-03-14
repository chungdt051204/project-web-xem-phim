const genreEntity = require("../../models/genre.model");
const movieEntity = require("../../models/movie.model");
exports.getGenre = async (req, res) => {
  try {
    const arrayGenre = await genreEntity.find();
    const { _page = 1, _limit = arrayGenre.length } = req.query;
    const options = {
      page: _page,
      limit: _limit,
    };
    const query = {};
    const { genreId } = req.query;
    if (genreId) {
      const genre = await genreEntity.findOne({ _id: genreId });
      return res.status(200).json({ result: genre });
    }
    const genres = await genreEntity.paginate(query, options);
    return res.status(200).json({ result: genres });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getGenres");
    return res.status(500).json({
      message: "Lấy danh sách thể loại thất bại",
      error: error.message,
    });
  }
};
exports.postGenre = async (req, res) => {
  try {
    const { genreName } = req.body;
    const genre = await genreEntity.findOne({
      name: genreName,
    });
    if (genre)
      return res.status(409).json({ message: "Đã có thể loại này rồi" });
    await genreEntity.create({ name: genreName });
    return res.status(200).json({ message: "Thêm thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postGenre");
    return res.status(500).json({
      message: "Thêm thể loại mới thất bại",
      error: error.message,
    });
  }
};
exports.deleteGenre = async (req, res) => {
  try {
    const { genreId } = req.query;
    const movieWithGenre = await movieEntity.findOne({ genre: genreId });
    if (movieWithGenre !== null)
      return res
        .status(409)
        .json({ message: "Đã có phim thuộc thể loại này, không thể xóa" });
    const result = await genreEntity.deleteOne({ _id: genreId });
    if (result.deletedCount === 0)
      return res
        .status(404)
        .json({ message: "Không tìm thấy thể loại để xóa" });
    return res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm deleteGenre");
    return res.status(500).json({
      message: "Xóa thể loại thất bại",
      error: error.message,
    });
  }
};
exports.putGenre = async (req, res) => {
  try {
    const { genreId } = req.query;
    const { genreName } = req.body;
    await genreEntity.updateOne({ _id: genreId }, { name: genreName });
    return res.status(200).json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm updateGenre");
    return res.status(500).json({
      message: "Cập nhật thể loại thất bại",
      error: error.message,
    });
  }
};

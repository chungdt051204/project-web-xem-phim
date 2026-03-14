const genreEntity = require("../../models/genre.model");
const movieEntity = require("../../models/movie.model");
const viewLogEntity = require("../../models/view_log.model");
const dayjs = require("dayjs");

exports.getMovie = async (req, res) => {
  try {
    const arrayMovie = await movieEntity.find();
    const { id } = req.query;
    const { genre } = req.query;
    const { year } = req.query;
    const { name } = req.query;
    const {
      _page = 1,
      _limit = arrayMovie.length,
      sortBy = "createdAt",
      orderBy,
    } = req.query;
    const options = {
      page: _page,
      limit: _limit,
      sort: orderBy === "desc" ? sortBy : "-" + sortBy, //Dấu - là giảm dần, + là tăng dần
      populate: "genre",
    };
    let query = {};
    if (id) {
      const movie = await movieEntity.findOne({ _id: id }).populate("genre");
      return res.status(200).json({ result: movie });
    }
    if (genre) {
      const genreInDatabase = await genreEntity.findOne({
        name: { $regex: genre, $options: "i" },
      });
      if (genreInDatabase !== null) query.genre = genreInDatabase._id;
    }
    if (year) query.year = year;
    if (name) query.title = { $regex: name, $options: "i" };
    // const movies = await movieEntity.find(query).populate("genre");
    const movies = await movieEntity.paginate(query, options);
    res.status(200).json({ result: movies });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getMovie");
    return res
      .status(500)
      .json({ message: "Lấy dữ liệu phim thất bại", error: error.message });
  }
};
exports.putView = async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      await movieEntity.updateOne({ _id: id }, { $inc: { view: 1 } });
      const movie = await movieEntity.findOne({ _id: id });
      //Khi nào qua ngày khác thì start với end mới thay đổi
      const start = dayjs(movie.updatedAt).startOf("day").toDate();
      const end = dayjs(movie.updatedAt).endOf("day").toDate();
      const viewLog = await viewLogEntity.find({
        $and: [
          { movieId: id },
          {
            createdAt: { $gte: start, $lte: end },
          },
        ],
      });
      if (viewLog?.length === 0) {
        await viewLogEntity.create({ movieId: id, count: 1 });
      } else {
        await viewLogEntity.updateOne(
          {
            movieId: id,
            createdAt: { $gte: start, $lte: end },
          },
          { $inc: { count: 1 } }
        );
      }
      return res.status(200).json({ message: "Đã tăng view" });
    }
    return res.status(404).json({ message: "Không tìn thấy phim" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm putView", {
      error: error.message,
    });
    res
      .status(500)
      .json({ message: "Cập nhật lượt xem thất bại", error: error.message });
  }
};
exports.getRelationMovie = async (req, res) => {
  try {
    const { id, genreId } = req.query;
    const relationMovie = await movieEntity.find({
      $and: [{ _id: { $ne: id } }, { genre: genreId }],
    });
    return res.status(200).json({ result: relationMovie });
  } catch (error) {}
};
exports.postMovie = async (req, res) => {
  try {
    const { title, description, year, duration, director, videoUrl, genre } =
      req.body;
    const poster = req?.files["poster"][0]?.path ?? "";
    const thumbnail = req?.files["thumbnail"][0]?.path ?? "";
    const movie = await movieEntity.findOne({ title });
    if (movie) return res.status(409).json({ message: "Đã có phim này rồi" });
    await movieEntity.create({
      title,
      description,
      year,
      duration,
      director,
      videoUrl,
      genre,
      poster,
      thumbnail,
    });
    return res.status(200).json({ message: "Thêm thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postMovie");
    return res
      .status(500)
      .json({ message: "Thêm thất bại", error: error.message });
  }
};
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.query;
    const result = await movieEntity.deleteOne({ _id: id });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Không tìm thấy phim để xóa" });
    return res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xóa phim", error);
    return res
      .status(500)
      .json({ message: "Xóa phim thất bại", error: error.message });
  }
};
exports.putMovie = async (req, res) => {
  try {
    const { id } = req.query;
    const movie = await movieEntity.findOne({ _id: id });
    if (!movie)
      return res.status(404).json({ message: "Không tìm thấy phim để sửa" });
    const title = req.body.title || movie.title;
    const description = req.body.description || movie.description;
    const year = req.body.year || movie.year;
    const duration = req.body.duration || movie.duration;
    const director = req.body.director || movie.director;
    const videoUrl = req.body.videoUrl || movie.videoUrl;
    const genre = req.body.genre?.length > 0 ? req.body.genre : movie.genre;
    const poster = req?.files["poster"]?.[0]?.path || movie.poster;
    const thumbnail = req?.files["thumbnail"]?.[0]?.path || movie.thumbnail;
    await movieEntity.updateOne(
      { _id: id },
      {
        title,
        description,
        year,
        duration,
        director,
        videoUrl,
        genre,
        poster,
        thumbnail,
      }
    );
    return res.status(200).json({ message: "Cập nhật thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi cập nhật phim", error);
    return res
      .status(500)
      .json({ message: "Cập nhật phim thất bại", error: error.message });
  }
};

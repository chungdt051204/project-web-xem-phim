const viewLogEntity = require("../../models/view_log.model");
const movieEntity = require("../../models/movie.model");
const dayjs = require("dayjs");
exports.getViewLog = async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};
    if (date) {
      const start = dayjs(date).startOf("day").toDate();
      const end = dayjs(date).endOf("day").toDate();
      query.createdAt = { $gte: start, $lte: end };
    }
    const viewLogs = await viewLogEntity.find(query).populate("movieId");
    return res.status(200).json({ result: viewLogs });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getViewLog");
    return res
      .status(500)
      .json({ message: "Lấy dữ liệu view log thất bại", error: error.message });
  }
};

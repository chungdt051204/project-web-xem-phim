const commentEntity = require("../../models/comment.model");
exports.getComment = async (req, res) => {
  try {
    const arrayComments = await commentEntity.find();
    const { _page = 1, _limit = arrayComments?.length, id } = req.query;
    const options = {
      page: _page,
      limit: _limit,
      populate: ["userId", "movieId", "likes"],
    };
    let query = {};
    if (id) query.movieId = id;
    const comments = await commentEntity.paginate(query, options);
    return res.status(200).json({ result: comments });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getComment");
    res.status(500).json({
      message: "Lấy dữ liệu bình luận thất bại",
      error: error.message,
    });
  }
};
exports.postComment = async (req, res) => {
  try {
    const { body } = req;
    await commentEntity.create({ ...body });
    return res.status(200).json({ message: "Đăng bình luận thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postComment");
    res.status(500).json({
      message: "Đăng bình luận thất bại",
      error: error.message,
    });
  }
};
exports.putComment = async (req, res) => {
  try {
    const { commentId, userId, status } = req.body;
    if (status === "liked") {
      await commentEntity.updateOne(
        { _id: commentId },
        {
          $addToSet: {
            likes: userId, //Thêm userId vào mảng likes ko thêm trùng
          },
        }
      );
      return res.status(200).json({ message: "Bạn đã thích bình luận này" });
    } else {
      await commentEntity.updateOne(
        { _id: commentId },
        {
          $pull: {
            likes: userId,
          },
        }
      );
      return res.status(200).json({ message: "Bạn đã bỏ thích bình luận này" });
    }
  } catch (error) {}
};
exports.putBanned = async (req, res) => {
  try {
    const { id } = req.query;
    const { isBanned } = req.body;
    const result = await commentEntity.updateOne(
      { _id: id },
      { $set: { isBanned: isBanned } }
    );
    if (result.modifiedCount === 0)
      return res.status(404).json({
        message: "Không tìm thấy bình luận để thay đổi trạng thái ẩn hiển",
      });
    return res.status(200).json({
      message: "Thay đổi trạng thái ẩn hiện của bình luận này thành công",
    });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm putBanned");
    res.status(500).json({
      message: "Thay đổi trạng thái ẩn hiện của bình luận này thất bại",
      error: error.message,
    });
  }
};

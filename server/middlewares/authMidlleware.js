require("dotenv").config();
const crypto = require("crypto");
const userEntity = require("../models/user.model");
exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.slice(7);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const [encodedHeader, encodedPayload, tokenSignature] = token.split(".");
    //Ký lại và so sánh với chữ ký cũ
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    const hmac = crypto.createHmac("sha256", process.env.JWT_SECRET);
    const signature = hmac.update(tokenData).digest("base64url");
    if (signature === tokenSignature) {
      const payload = JSON.parse(atob(encodedPayload));
      if (payload.exp < Date.now())
        return res.status(401).json({ message: "Token đã hết hạn" });
      req.payload = payload;
      return next();
    }
    return res.status(400).json({ message: "Token không khớp" });
  } catch (error) {
    console.log("Có lỗi xảy ra", { error: error.message });
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};
exports.verifyAuthAdmin = async (req, res, next) => {
  try {
    const { sub } = req.payload;
    const user = await userEntity.findOne({ _id: sub });
    if (!user || user.role !== "admin")
      return res.status(403).json({ message: "Bạn không đủ quyền truy cập" });
    return next();
  } catch (error) {
    console.log("Có lỗi xảy ra", { error: error.message });
    return res
      .status(500)
      .json({ message: "Lối hệ thống", error: error.message });
  }
};

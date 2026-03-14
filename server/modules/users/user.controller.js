require("dotenv").config();
const passport = require("passport");
const userEntity = require("../../models/user.model");
const crypto = require("crypto");
const JWT_SECRET = process.env.JWT_SECRET;
const base64Url = require("../../helper");

exports.postRegister = async (req, res) => {
  try {
    const { fullName, username, email, password, phone, dateOfBirth, gender } =
      req.body;
    const avatar = req?.file?.path || "";
    const error = {};
    const existingUsername = await userEntity.findOne({
      username,
    });
    if (existingUsername) error.username = "Tên đăng nhập này đã được sử dụng";
    const existingEmail = await userEntity.findOne({
      $and: [{ email, loginMethod: "Email thường" }],
    });
    if (existingEmail) error.email = "Email này đã tồn tại";
    if (Object.keys(error).length > 0)
      return res.status(409).json({ message: error });
    const hashPassword = btoa(password);
    await userEntity.create({
      fullName,
      username,
      email,
      password: hashPassword,
      phone,
      dateOfBirth,
      gender,
      avatar,
    });
    return res.status(200).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra trong quá trình đăng ký");
    return res
      .status(500)
      .json({ message: "Đăng ký thất bại, error", error: error.message });
  }
};
exports.postLogin = async (req, res) => {
  try {
    const { input, password } = req.body;
    const hashPassword = btoa(password);
    console.log(input, hashPassword);
    const user = await userEntity.findOne({
      $and: [
        {
          $or: [{ email: input }, { username: input }],
          password: hashPassword,
          loginMethod: "Email thường",
        },
      ],
    });
    if (!user)
      return res
        .status(401)
        .json({ message: "Thông tin đăng nhập không chính xác" });
    if (!user.isActive)
      return res
        .status(401)
        .json({ message: "Tài khoản này đã bị vô hiệu hóa" });
    const header = {
      alg: "HS256",
      typ: "JWT",
    };
    const payload = {
      sub: user._id,
      exp: Date.now() + 3600000, //Hạn 1 tiếng
    };
    //Mã hóa header
    const encodedHeader = base64Url(JSON.stringify(header));
    //Mã hóa payload
    const encodedPayload = base64Url(JSON.stringify(payload));
    //Tạo token data với header và payload vừa mã hóa
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    //Tạo signature
    const hmac = crypto.createHmac("sha256", JWT_SECRET);
    const signature = hmac.update(tokenData).digest("base64url");
    return res.status(200).json({
      message: "Đăng nhập thành công",
      result: user,
      token: tokenData + "." + signature,
    });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm postRegister");
    return res
      .status(500)
      .json({ message: "Đăng nhập thất bại, error", error: error.message });
  }
};
exports.getLoginGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
});
exports.getResultLoginGoogle = [
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const user = req.user;
    if (!user.isActive)
      return res.redirect(`http://localhost:5173/access-denied`);
    const header = {
      alg: "HS256",
      typ: "JWT",
    };
    const payload = {
      sub: user._id,
      exp: Date.now() + 3600000, //Hạn 1 tiếng
    };
    //Mã hóa header
    const encodedHeader = base64Url(JSON.stringify(header));
    //Mã hóa payload
    const encodedPayload = base64Url(JSON.stringify(payload));
    //Tạo token data với header và payload vừa mã hóa
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    //Tạo signature
    const hmac = crypto.createHmac("sha256", JWT_SECRET);
    const signature = hmac.update(tokenData).digest("base64url");
    return res.redirect(
      `http://localhost:5173?token=${tokenData}.${signature}`
    );
  },
];
exports.getMe = async (req, res) => {
  try {
    const token = req.headers.authorization.slice(7);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const [encodedHeader, encodedPayload, tokenSignature] = token.split(".");
    //Ký lại và so sánh với chữ ký cũ
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    const hmac = crypto.createHmac("sha256", JWT_SECRET);
    const signature = hmac.update(tokenData).digest("base64url");
    if (signature === tokenSignature) {
      const payload = JSON.parse(atob(encodedPayload));
      if (payload.exp < Date.now())
        return res.status(401).json({ message: "Token đã hết hạn" });
      const user = await userEntity.findOne({ _id: payload.sub });
      if (!user)
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      return res.status(200).json({ result: user });
    }
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getMe");
    return res.status(500).json({
      message: "Lấy thông tin người dùng thất bại",
      error: error.message,
    });
  }
};
exports.putMe = async (req, res) => {
  try {
    const session = sessions[req.cookies.sessionId];
    const { body } = req;
    if (!session) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    await userEntity.updateOne(
      { _id: session.id },
      { ...body, avatar: req?.file?.path }
    );
    return res.status(200).json({
      message: "Cập nhật thông tin người dùng thành công",
    });
  } catch (error) {
    console.log("Có lỗi xảy ra trong quá trình cập nhật thông tin người dùng");
    return res.status(500).json({
      message: "Cập nhật thông tin người dùng thất bại",
      error: error.message,
    });
  }
};
exports.getUser = async (req, res) => {
  try {
    const arrayUser = await userEntity.find();
    const { _page = 1, _limit = arrayUser?.length, id } = req.query;
    let query = {};
    const options = {
      page: _page,
      limit: _limit,
    };
    if (id) {
      const user = await userEntity.findOne({ _id: id });
      return res.status(200).json({ result: user });
    }
    const users = await userEntity.paginate(query, options);
    return res.status(200).json({ result: users });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm getUser");
    return res.status(500).json({
      message: "Lấy dữ liệu người dùng thất bại",
      error: error.message,
    });
  }
};
exports.putStatus = async (req, res) => {
  try {
    const { id } = req.query;
    const { status } = req.body;
    console.log(status);
    const result = await userEntity.updateOne(
      { _id: id },
      { isActive: status === "inactive" ? false : true }
    );
    if (result === 0)
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng để thay đổi trạng thái" });
    return res
      .status(200)
      .json({ message: "Cập nhật trạng thái người dùng thành công" });
  } catch (error) {
    console.log("Có lỗi xảy ra khi xử lý hàm putStatus");
    return res.status(500).json({
      message: "Cập nhật trạng thái người dùng thất bại",
      error: error.message,
    });
  }
};

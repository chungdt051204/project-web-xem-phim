require("dotenv").config();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./database");
connectDB();
const userEntity = require("./models/user.model");
const userRouter = require("./modules/users/user.router");
const genreRouter = require("./modules/genres/genre.router");
const movieRouter = require("./modules/movies/movie.router");
const favoriteMovieRouter = require("./modules/favoriteMovies/favoriteMovie.router");
const ratingRouter = require("./modules/ratings/rating.router");
const commentRouter = require("./modules/comments/comment.router");
const viewLogRouter = require("./modules/viewLogs/viewLog.router");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userEntity.findOne({
          $and: [{ email: profile.emails[0].value }],
          loginMethod: "Google",
        });
        if (!user) {
          user = await userEntity.create({
            fullName: profile.displayName,
            username:
              profile.displayName +
              " " +
              Math.floor(Math.random() * profile.displayName.length * 10000),
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            loginMethod: "Google",
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
//Thứ tự đặt: cors, cookie-parser, body-parser, router
app.use(
  cors({
    origin: [
      "https://web-xem-phim-co-ban.netlify.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
//Thêm dòng này để sử dụng đc ảnh phía server
app.use(express.static("public"));
app.use("/", userRouter);
app.use("/", genreRouter);
app.use("/", movieRouter);
app.use("/", favoriteMovieRouter);
app.use("/", ratingRouter);
app.use("/", commentRouter);
app.use("/", viewLogRouter);

app.listen(port, () => {
  console.log("Server đang chạy với port:" + port);
});

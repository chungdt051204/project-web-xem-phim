import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef, useMemo } from "react";
import AppContext from "./AppContext";
import ReactPlayer from "react-player";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { url } from "../../App";
import Slider from "./Slider";
import NavBar from "./NavBar";
import Dialog from "./Dialog";
import Footer from "./Footer";
import fetchApi from "../service/api";
import img from "../../../public/liked.jpg";

export default function DetailMovie() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { isLogin, me, favoriteMovies, ratings, refresh, setRefresh } =
    useContext(AppContext);
  const [movie, setMovie] = useState(null);
  const [favoriteWithMovieId, setFavoriteWithMovieId] = useState(null);
  const [userComment, setUserComment] = useState([]);
  const [moviesWithSameGenre, setMoviesWithSameGenre] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [ratingStar, setRatingStar] = useState();
  const input = useRef();
  const dialog = useRef();
  //Tạo mảng có 10 phần tử
  const star = [...Array(10)].map((_, i) => i + 1);
  const getTimeComment = (time) => {
    const now = new Date();
    const past = new Date(time);
    const secondDiff = Math.floor((now - past) / 1000);
    const minuteDiff = Math.floor(secondDiff / 60);
    const hourDiff = Math.floor(minuteDiff / 60);
    const dayDiff = Math.floor(hourDiff / 24);
    const monthDiff = Math.floor(dayDiff / 30);
    const yearDiff = Math.floor(dayDiff / 365);
    if (secondDiff < 60) return secondDiff + " " + "giây";
    else if (minuteDiff < 60) return minuteDiff + " " + "phút";
    else if (hourDiff < 24) return hourDiff + " " + "giờ";
    else if (dayDiff < 30) return dayDiff + " " + "ngày";
    else if (monthDiff < 12) return monthDiff + " " + "tháng";
    else return yearDiff + " " + "năm";
  };
  const totalRatings = useMemo(() => {
    return ratings?.filter((value) => value.movieId === id) || [];
  }, [id, ratings]);
  const userRating = useMemo(() => {
    return (
      ratings?.find(
        (value) => value.userId === me?._id && value.movieId === id
      ) || null
    );
  }, [me, id, ratings]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (id) params.append("id", id);
    fetchApi({ url: `${url}/movie?${params.toString()}`, setData: setMovie });
    fetchApi({ url: `${url}/comment?id=${id}`, setData: setUserComment });
    setFavoriteWithMovieId(
      favoriteMovies?.find(
        (value) => value.movieId._id === id && value.userId === me?._id
      )
    );
    setRatingStar(userRating?.rating);
  }, [me, id, favoriteMovies, userRating, refresh]);
  const handleAddFavoriteMovie = (movie) => {
    fetch(`${url}/favoriteMovie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: me._id, movieId: movie._id }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        alert(message);
      })
      .catch();
  };
  const handleAddRatingStar = (star) => {
    if (!isLogin) {
      alert("Bạn chưa đăng nhập");
      return;
    } else {
      if (userRating) return;
      else {
        setRatingStar(star);
        fetch(`${url}/rating`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: me?._id,
            movieId: id,
            rating: star,
          }),
        })
          .then((res) => {
            if (res.ok) return res.json();
            throw res;
          })
          .then(({ message }) => {
            alert(message);
            setRefresh((prev) => prev + 1);
          })
          .catch();
      }
    }
  };
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!isLogin) {
      alert("Bạn chưa đăng nhập");
    } else {
      fetch(`${url}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: me?._id,
          movieId: id,
          comment: input.current.value,
        }),
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw res;
        })
        .then(({ message }) => {
          alert(message);
          input.current.value = "";
          setRefresh((prev) => prev + 1);
        })
        .catch();
    }
  };
  const toggleLike = (value) => {
    if (!isLogin) {
      alert("Bạn chưa đăng nhập");
      return;
    } else {
      const status = value.likes.includes(me?._id) ? "unliked" : "liked";
      fetch(`${url}/comment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: value._id,
          userId: me?._id,
          status: status,
        }),
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw res;
        })
        .then(({ message }) => {
          console.log(message);

          setRefresh((prev) => prev + 1);
        })
        .catch();
    }
  };
  return (
    <>
      <NavBar isClicked={isClicked} setIsClicked={setIsClicked} />
      <section
        className="flex w-[1100px] h-[1000px] my-[50px] mx-auto rounded-[5px]
       text-white bg-[rgb(15,20,22)]"
      >
        <div className="w-[1000px] my-[40px] mx-auto">
          {movie != null && (
            <div className="flex gap-[30px]">
              <img
                className="rounded-[4px] w-[200px] h-[300px]"
                src={movie.poster}
                alt=""
              />
              <div>
                <h2
                  className="text-[24px]"
                  style={{ color: "rgba(181, 231, 69, 1)" }}
                >
                  {movie.title}
                </h2>
                <p>{movie.description}</p>
                <hr />
                <div className="flex items-center gap-[10px] mt-[20px] mb-[10px] ">
                  <div className="w-[50px] h-[50px]">
                    <CircularProgressbar
                      value={movie.rating * 10}
                      text={`${movie.rating * 10}%`}
                      styles={buildStyles({
                        textSize: "24px",
                        textColor: "white",
                        pathColor: "rgba(181, 231, 69, 1)",
                        trailColor: "white",
                      })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex">
                      {star.map((value, index) => {
                        return (
                          <div key={index}>
                            <i
                              style={{
                                color: index < movie.rating && "yellow",
                              }}
                              className="fa-solid fa-star"
                            ></i>
                          </div>
                        );
                      })}
                      <div className="ms-[50px]">
                        <i className="fa-solid fa-calendar-days"></i>
                        {movie.year}
                      </div>
                    </div>
                    <div>(Đánh giá: {movie.rating}/10)</div>
                    <div>{totalRatings.length + " " + "lượt đánh giá"}</div>
                  </div>
                </div>
                <div className="flex gap-[7px]">
                  <div>Thể loại:</div>
                  {movie?.genre.map((value) => {
                    return (
                      <div key={value._id}>
                        <Link
                          to={`/filter?genre=${encodeURIComponent(value.name)}`}
                        >
                          <h4 style={{ color: "rgba(181, 231, 69, 1)" }}>
                            {value.name}
                          </h4>
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <p>Thời lượng: {movie.duration}</p>
                <p>Đạo diễn: {movie.director}</p>
              </div>
            </div>
          )}
          {favoriteWithMovieId ? (
            <button
              className="bg-red-700 p-[8px] my-[20px] rounded-[3px] cursor-not-allowed"
              disabled={true}
            >
              Đã thêm vào danh sách yêu thích
            </button>
          ) : (
            <button
              className="btn-add my-[20px]"
              onClick={() => handleAddFavoriteMovie(movie)}
            >
              Thêm vào danh sách yêu thích
            </button>
          )}
          <ReactPlayer
            style={{ margin: "auto" }}
            src={movie?.videoUrl}
            //Bật controls để hiển thị thanh thời lượng và setting
            controls
            width={1000}
            height={500}
          />
        </div>
      </section>
      <div>
        {moviesWithSameGenre && (
          <Slider data={moviesWithSameGenre} content="Phim liên quan" />
        )}
      </div>
      <div className="w-[600px] h-[900px] mt-[30px] mx-[40px] p-[20px] rounded-[8px] bg-white">
        <form
          onSubmit={handleAddComment}
          className="max-w-sm p-4 bg-white rounded-xl shadow-md border border-gray-100"
        >
          <div className="text-gray-800 font-medium mb-2">Đánh giá của bạn</div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              {star?.map((_, index) => (
                <div key={index}>
                  <i
                    className="fa-solid fa-star text-2xl transition-all duration-200 cursor-pointer"
                    onClick={() => handleAddRatingStar(index + 1)}
                    style={{
                      color: index <= ratingStar - 1 ? "#facd12" : "#d1d5db",
                      cursor: userRating && "not-allowed",
                    }}
                  ></i>
                </div>
              ))}
            </div>
            {userRating && (
              <button
                type="button"
                className="text-xs text-blue-600 font-medium hover:underline"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              ref={input}
              placeholder="Bình luận của bạn..."
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition-colors shadow-sm"
            >
              Gửi bình luận
            </button>
          </div>
        </form>
        <div className="mt-[30px]">
          {userComment?.map((value, index) => {
            return (
              <div key={index} className="flex gap-3 mb-6 items-start">
                {/* Avatar với bo tròn và hiệu ứng shadow nhẹ */}
                <img
                  src={value.userId.avatar}
                  alt={value.userId.username}
                  width={40}
                  height={40}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100"
                />

                <div className="flex-1">
                  {/* Bong bóng bình luận */}
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none">
                    <div className="font-bold text-sm text-gray-900 mb-1">
                      {value.userId.username}
                    </div>
                    <div className="text-gray-700 text-sm leading-relaxed">
                      {value.comment}
                    </div>
                  </div>

                  {/* Thông tin thời gian và nút tương tác bổ sung */}
                  <div className="flex gap-4 ml-2 mt-1 items-center">
                    <span className="text-xs text-gray-500">
                      {getTimeComment(value.createdAt)}
                    </span>
                    <button
                      onClick={() => toggleLike(value)}
                      style={{
                        color: value.likes.includes(me?._id) ? "blue" : "gray",
                      }}
                      className="text-xs font-semibold hover:underline cursor-pointer"
                    >
                      Thích
                    </button>
                    {value.likes.length > 0 && (
                      <div className="flex">
                        <div>{value.likes.length}</div>
                        <img src={img} alt="" width={20} height={20} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Dialog
        ref={dialog}
        message={
          !isLogin
            ? "Vui lòng đăng nhập để sử dụng chức năng này"
            : "Đã thêm phim vào danh sách yêu thích"
        }
      />
      <Footer />
    </>
  );
}

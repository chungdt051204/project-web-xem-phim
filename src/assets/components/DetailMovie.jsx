import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
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

export default function DetailMovie() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { isLogin, me, favoriteMovies } = useContext(AppContext);
  const [movie, setMovie] = useState(null);
  const [favoriteWithMovieId, setFavoriteWithMovieId] = useState(null);
  const [moviesWithSameGenre, setMoviesWithSameGenre] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const dialog = useRef();
  //Tạo mảng có 10 phần tử
  const star = [...Array(10)].map((_, i) => i + 1);
  useEffect(() => {
    const params = new URLSearchParams();
    if (id) params.append("id", id);
    fetchApi({ url: `${url}/movie?${params.toString()}`, setData: setMovie });
    setFavoriteWithMovieId(
      favoriteMovies?.find(
        (value) => value.movieId._id === id && value.userId === me?._id
      )
    );
  }, [me, id, favoriteMovies]);
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
                                color: index < movie.rating - 1 && "yellow",
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

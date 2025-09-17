import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import AppContext from "./AppContext";
import { baseApi } from "./Register";
import ReactPlayer from "react-player";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Slider from "./Slider";
import NavBar from "./NavBar";
import "./DetailMovie.css";
export default function DetailMovie({ data }) {
  const { isLogin } = useContext(AppContext);
  const [moviesWithSameGenre, setMoviesWithSameGenre] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  //Tạo mảng có 10 phần tử
  const star = [...Array(10)].map((_, i) => i + 1);
  useEffect(() => {
    //Nếu chưa có dữ liệu thì dừng luôn
    if (!data) return;
    fetch(
      `${baseApi}/movies/${data._id}?genre=${encodeURIComponent(data.genre[0])}`
    )
      .then((res) => res.json())
      .then((value) => {
        setMoviesWithSameGenre(value);
      });
  }, [data]);
  const handleClick = (movieId, poster, title, rating) => {
    if (!isLogin) {
      alert("Bạn chưa đăng nhập");
      return;
    }
    fetch(`${baseApi}/favorite-movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          movie_id: movieId,
          poster: poster,
          title: title,
          rating: rating,
        },
      }),
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(({ message }) => {
        alert(message);
      })
      .catch((err) => {
        if (err.status === 401) {
          console.log("Bạn chưa đăng nhập");
        }
      });
  };
  return (
    <>
      <NavBar isClicked={isClicked} setIsClicked={setIsClicked} />
      <section className="movie-detail">
        <div className="movie-detail-wrapper">
          {data && (
            <div className="movie-detail-content">
              <img
                src={`${baseApi}/images/${data.poster}`}
                alt=""
                width={200}
                height={300}
              />
              <div className="movie-detail-info">
                <h2>{data.title}</h2>
                <p>{data.description}</p>
                <hr />
                <div className="movie-detail-stats">
                  <div className="movie-detail-progress">
                    <CircularProgressbar
                      value={data.rating * 10}
                      text={`${data.rating * 10}%`}
                      styles={buildStyles({
                        textSize: "24px",
                        textColor: "white",
                        pathColor: "rgba(181, 231, 69, 1)",
                        trailColor: "white",
                      })}
                    />
                  </div>
                  <div className="movie-detail-rating-year">
                    <div className="movie-detail-rating-year-star">
                      {star.map((value, index) => {
                        return (
                          <div key={index}>
                            <i
                              style={{
                                color: index < data.rating - 1 && "yellow",
                              }}
                              className="fa-solid fa-star"
                            ></i>
                          </div>
                        );
                      })}
                      <div className="movie-detail-year">
                        <i className="fa-solid fa-calendar-days"></i>
                        {data.year}
                      </div>
                    </div>
                    <div>(Đánh giá: {data.rating}/10)</div>
                  </div>
                </div>
                <div className="movie-detail-genre">
                  <div>Thể loại:</div>
                  {data.genre.map((value, index) => {
                    return (
                      <div key={index}>
                        <Link
                          to={`/filter/genre?genre=${encodeURIComponent(
                            value
                          )}`}
                        >
                          {value}
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <p>Thời lượng: {data.duration}</p>
                <p>Đạo diễn: {data.director}</p>
              </div>
            </div>
          )}
          <button
            onClick={() =>
              handleClick(data._id, data.poster, data.title, data.rating)
            }
          >
            Thêm vào danh sách yêu thích
          </button>
          <ReactPlayer
            style={{ margin: "auto" }}
            src={data.videoUrl}
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
    </>
  );
}

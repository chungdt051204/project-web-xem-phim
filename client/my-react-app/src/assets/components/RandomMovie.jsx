import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import AppContext from "./AppContext";
import { api } from "../../App";
import fetchApi from "../service/api";
import { toast } from "react-toastify";

export default function RandomMovie() {
  const { movies, isLogin } = useContext(AppContext);
  const [randomMovie, setRandomMovie] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [onMouse, setOnMouse] = useState(false);
  const handleClick = () => {
    setClicked(true);
    if (!isLogin) {
      toast.warning("Bạn chưa đăng nhập");
      return;
    } else {
      fetchApi({
        url: `${api}/movie?id=${
          movies.docs[Math.floor(Math.random() * movies.docs.length)]._id
        }`,
        setData: setRandomMovie,
      });
    }
  };
  return (
    <section className="mt-[60px]">
      <button className="btn-random ms-[75px]" onClick={handleClick}>
        Xem phim ngẫu nhiên
      </button>
      {clicked && randomMovie !== null && (
        <div
          className="w-[250px] h-[320px] mt-[10px] py-[20px] px-[30px] rounded-[3px]"
          style={{ backgroundColor: "rgba(15, 20, 22, 1)" }}
        >
          <div className="relative flex flex-col gap-[20px] w-[180px] h-[250px]">
            <img
              onMouseEnter={() => setOnMouse(true)}
              onMouseLeave={() => setOnMouse(false)}
              className="w-[150px] h-[200px] rounded-[3px]"
              style={{ opacity: onMouse && 0.5 }}
              src={randomMovie.poster}
              alt=""
            />
            <Link
              to={`/movie/${randomMovie._id}`}
              onMouseEnter={() => setOnMouse(true)}
              onMouseLeave={() => setOnMouse(false)}
            >
              <h4>{randomMovie.title}</h4>
            </Link>
            <div className="rating-star">
              <i className="fa-solid fa-star"></i>
              {randomMovie.rating}
            </div>
            {onMouse && (
              <Link to={`/movie/${randomMovie._id}`}>
                <button
                  className="play"
                  onMouseEnter={() => setOnMouse(true)}
                  onMouseLeave={() => setOnMouse(false)}
                >
                  <i class="fa-solid fa-play"></i>
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

import { useEffect, useState, useContext } from "react";
import AppContext from "./AppContext";
import { baseApi } from "./Register";
import NavBar from "./NavBar";
import "./FavoriteMovies.css";
export default function FavoriteMovies() {
  const { isLogin } = useContext(AppContext);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    fetch(`${baseApi}/user`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setFavoriteMovies(data.watchList);
      });
  }, []);
  const handleDelete = (id) => {
    if (!isLogin) {
      alert("Bạn chưa đăng nhập");
      return;
    }
    setFavoriteMovies(favoriteMovies.filter((item) => item.movie_id !== id));
    fetch(`${baseApi}/favorite-movies/${id}`, {
      method: "DELETE",
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
      .catch();
  };
  return (
    <section className="favorite-movies-container">
      <NavBar isClicked={isClicked} setIsClicked={setIsClicked} />
      <h2>Phim yêu thích</h2>
      <div className="favorite-movies">
        <div className="favorite-movies-track">
          {favoriteMovies && favoriteMovies.length > 0
            ? favoriteMovies.map((value, index) => {
                return (
                  <div className="favorite-movies-item" key={index}>
                    <img
                      src={`${baseApi}/images/${value.poster}`}
                      alt=""
                      width={150}
                      height={200}
                    />
                    <h4>{value.title}</h4>
                    <i
                      onClick={() => handleDelete(value.movie_id)}
                      class="fa-solid fa-trash"
                    ></i>
                  </div>
                );
              })
            : "Danh sách phim yêu thích của bạn hiện tại đang trống"}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState, useContext, useRef } from "react";
import AppContext from "./AppContext";
import { baseApi } from "./Register";
import NavBar from "./NavBar";
import Dialog from "./Dialog";
import Footer from "./Footer";
export default function FavoriteMovies() {
  const { isLogin } = useContext(AppContext);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const dialog = useRef();
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
      dialog.current.showModal();
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
      .then(() => {
        dialog.current.showModal();
      })
      .catch();
  };
  return (
    <section className=" text-white">
      <NavBar isClicked={isClicked} setIsClicked={setIsClicked} />
      <div className="w-[1100px] m-auto">
        <h2 className="text-[28px] mt-[10px]">Phim yêu thích</h2>
        <div
          className="flex flex-col my-[10px] mx-auto p-[20px] rounded-[5px]"
          style={{ backgroundColor: "rgba(15, 20, 22, 1)" }}
        >
          <div className="flex flex-wrap gap-[20px] w-[1000px] m-auto">
            {favoriteMovies && favoriteMovies.length > 0
              ? favoriteMovies.map((value, index) => {
                  return (
                    <div
                      className="flex flex-col justify-around gap-[10px] w-[150px]"
                      key={index}
                    >
                      <img
                        className="w-[150px] h-[200px] rounded-[3px]"
                        src={`${baseApi}/images/${value.poster}`}
                        alt=""
                      />
                      <div className="h-[50px]">{value.title}</div>
                      <i
                        onClick={() => handleDelete(value.movie_id)}
                        className="fa-solid fa-trash"
                      ></i>
                    </div>
                  );
                })
              : "Danh sách phim yêu thích của bạn hiện tại đang trống"}
          </div>
        </div>
      </div>
      <Dialog
        ref={dialog}
        message={
          !isLogin
            ? "Vui lòng đăng nhập để sử dụng chức năng này"
            : "Đã xóa phim khỏi danh sách yêu thích"
        }
      />
      <Footer />
    </section>
  );
}

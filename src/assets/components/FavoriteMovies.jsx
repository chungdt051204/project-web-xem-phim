import { useEffect, useState, useContext } from "react";
import AppContext from "./AppContext";
import { baseApi } from "./Register";
import NavBar from "./NavBar";
import Footer from "./Footer";
import fetchApi from "../service/api";
import { url } from "../../App";
export default function FavoriteMovies() {
  const { isLogin, me } = useContext(AppContext);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    fetchApi({
      url: `${url}/favoriteMovie?userId=${me?._id}`,
      setData: setFavoriteMovies,
    });
  }, [me]);
  const handleDelete = (id) => {
    if (!isLogin) {
      alert("Bạn chưa đăng nhập");
      return;
    }
    fetch(`${url}/favoriteMovie?id=${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        alert(message);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
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
                        src={value.movieId.poster}
                        alt=""
                      />
                      <div className="h-[50px]">{value.movieId.title}</div>
                      <i
                        onClick={() => handleDelete(value._id)}
                        className="fa-solid fa-trash"
                      ></i>
                    </div>
                  );
                })
              : "Danh sách phim yêu thích của bạn hiện tại đang trống"}
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}

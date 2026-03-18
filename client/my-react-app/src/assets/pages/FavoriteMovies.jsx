import { useEffect, useState, useContext } from "react";
import AppContext from "../components/AppContext";
import { api } from "../../App";
import fetchApi from "../service/api";
import { toast } from "react-toastify";
import UserNavBar from "../components/UserNavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function FavoriteMovies() {
  const navigate = useNavigate();
  const { isLoading, refresh, setRefresh, isLogin, me } =
    useContext(AppContext);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    if (!isLoading) {
      if (!isLogin) {
        navigate("/");
        return;
      }
    }
  }, [isLoading, isLogin, me, navigate]);
  useEffect(() => {
    fetchApi({
      url: `${api}/favoriteMovie`,
      setData: setFavoriteMovies,
    });
  }, [me, refresh]);
  const handleDelete = (id) => {
    fetch(`${api}/favoriteMovie?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };
  return (
    <section className=" text-white">
      <UserNavBar isClicked={isClicked} setIsClicked={setIsClicked} />
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

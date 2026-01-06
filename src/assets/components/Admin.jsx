import { Link, useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import AppContext from "./AppContext";
import { baseApi } from "./Register";
import NavBar from "./NavBar";
import AddMovie from "./AddMovie";
import UpdateMovie from "./UpdateMovie";
import Footer from "./Footer";
export default function Admin() {
  const { movies } = useContext(AppContext);
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [id, setId] = useState(null);
  const dialogAddMovie = useRef();
  const dialogUpdateMovie = useRef();
  const handleDelete = (id) => {
    fetch(`${baseApi}/delete/movie/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(({ message }) => {
        navigate("/admin");
        console.log(message);
      });
  };
  return (
    <>
      <NavBar isClicked={isClicked} setIsClicked={setIsClicked} />
      <section
        className="w-[1100px] py-[30px] px-[50px] my-[30px] mx-auto text-white rounded-[5px]"
        style={{ backgroundColor: "rgba(15, 20, 22, 1)" }}
      >
        <div className="flex items-center gap-[20px]">
          <h1 className="text-[24px]">Trang quản lý</h1>
          <Link>
            <button
              className="btn-add"
              onClick={() => dialogAddMovie.current.showModal()}
            >
              Thêm phim
            </button>
          </Link>
        </div>
        <div className="flex flex-wrap gap-[20px] w-[1020px] mt-[20px] mx-auto">
          {movies.length > 0 &&
            movies.map((value, index) => {
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
                  <div className="h-[80px]">{value.title}</div>
                  <div className="flex">
                    <i
                      onClick={() => handleDelete(value._id)}
                      className="fa-solid fa-trash"
                    ></i>
                    <i
                      onClick={() => {
                        setId(value._id);
                        dialogUpdateMovie.current.showModal();
                      }}
                      className="fa-solid fa-pen"
                    ></i>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
      <AddMovie ref={dialogAddMovie} />
      <UpdateMovie ref={dialogUpdateMovie} id={id} />
      <Footer />
    </>
  );
}

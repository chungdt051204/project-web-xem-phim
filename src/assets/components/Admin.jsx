import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import AppContext from "./AppContext";
import { baseApi } from "./Register";
import NavBar from "./NavBar";
import "./Admin.css";
export default function Admin() {
  const { movies } = useContext(AppContext);
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
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
      <section className="admin-container">
        <div className="box">
          <h1>Trang quản lý</h1>
          <Link to="/admin/movie">
            <button>Thêm phim</button>
          </Link>
        </div>
        <div className="myMovies-track">
          {movies.length > 0 &&
            movies.map((value, index) => {
              return (
                <div className="myMovies-item" key={index}>
                  <img
                    src={`${baseApi}/images/${value.poster}`}
                    alt=""
                    width={150}
                    height={200}
                  />
                  <h4>{value.title}</h4>
                  <div style={{ display: "flex" }}>
                    <i
                      onClick={() => handleDelete(value._id)}
                      className="fa-solid fa-trash"
                    ></i>
                    <Link to={`/admin/movie/${value._id}`}>
                      <i className="fa-solid fa-pen"></i>
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </>
  );
}

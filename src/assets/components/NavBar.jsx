import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import AppContext from "./AppContext";
import { baseApi } from "./Register";
import SearchBar from "./SearchBar";
export default function NavBar({ isClicked, setIsClicked }) {
  const navigate = useNavigate();
  const { isLogin, setIsLogin, me, categories, movies } =
    useContext(AppContext);
  const [onMouseGenre, setOnMouseGenre] = useState(false);
  const [onMouseYear, setOnMouseYear] = useState(false);
  const [clicked, setClicked] = useState(false);
  const uniqueYear = [
    ...new Set(
      movies?.map((value) => {
        return value.year;
      })
    ),
  ];
  //Chức năng đăng xuất
  const handleClick = () => {
    setIsLogin(false);
    fetch(`${baseApi}/login`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(({ message }) => {
        console.log(message);
        navigate("/");
      })
      .catch();
  };
  return (
    <section>
      <nav
        className="h-[100px] py-[15px] px-0 text-white"
        style={{ backgroundColor: "rgba(15, 20, 22, 1)" }}
      >
        <ul className="flex justify-around my-[15px]">
          <li>
            <a href="">🎬 StudentMovie</a>
          </li>
          <li className="text-white list-none hover:cursor-pointer">
            <div className="flex gap-[5px]">
              <i className="fa-solid fa-house"></i>
              <div
                onClick={() => {
                  setIsClicked(false);
                  navigate("/");
                }}
              >
                TRANG CHỦ
              </div>
            </div>
          </li>
          <li
            onMouseEnter={() => setOnMouseGenre(true)}
            onMouseLeave={() => setOnMouseGenre(false)}
          >
            <div className="flex">
              <div className="hover:cursor-pointer">THỂ LOẠI</div>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            {onMouseGenre && (
              <div className="filter-dropdown-menu">
                {categories?.map((value) => {
                  return (
                    <div className="filter-dropdown-menu-item" key={value._id}>
                      <Link
                        to={`/filter?genre=${encodeURIComponent(value.name)}`}
                      >
                        <button className="filter-dropdown-menu-button">
                          {value.name}
                        </button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </li>
          <li
            onMouseEnter={() => setOnMouseYear(true)}
            onMouseLeave={() => setOnMouseYear(false)}
          >
            <div className="flex">
              <div className="hover:cursor-pointer">NĂM</div>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            {onMouseYear && (
              <div className="filter-dropdown-menu" style={{ width: "450px" }}>
                {uniqueYear?.map((value, index) => {
                  return (
                    <div className="filter-dropdown-menu-item" key={index}>
                      <Link to={`/filter?year=${encodeURIComponent(value)}`}>
                        <button className="filter-dropdown-menu-button">
                          {value}
                        </button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </li>
          <li>
            <SearchBar isClicked={isClicked} setIsClicked={setIsClicked} />
          </li>
          <li>
            <div className="user">
              {isLogin ? (
                <div className="flex items-start">
                  <img
                    className="w-[50px] h-[50px] border-2 border-blue-500 rounded-[50%]"
                    src={
                      me?.avatar?.includes("https")
                        ? me?.avatar
                        : `${baseApi}/images/${me?.avatar}`
                    }
                    alt=""
                    referrerPolicy="no-referrer"
                    onClick={() => setClicked((prev) => !prev)}
                  />
                  {clicked ? (
                    <i className="fa-solid fa-angle-up"></i>
                  ) : (
                    <i className="fa-solid fa-angle-down"></i>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <button className="btn-nav">Đăng nhập</button>
                </Link>
              )}
            </div>
            {isLogin && clicked && (
              <div
                className="absolute flex flex-col gap-[20px] w-[220px] 
                 p-[20px] end-[75px] rounded-[5px]"
                style={{ backgroundColor: "rgb(30, 30, 30)" }}
              >
                {me.isAdmin && (
                  <Link className="user-dropdown-link" to="/admin">
                    <i className="fa-solid fa-unlock"></i>
                    <strong>Trang quản lý</strong>
                  </Link>
                )}
                <Link className="user-dropdown-link" to="/user/info">
                  <i className="fa-solid fa-user"></i>
                  <strong>Thông tin tài khoản</strong>
                </Link>
                <Link className="user-dropdown-link" to="/user/favorite-movies">
                  <i className="fa-solid fa-heart"></i>
                  <strong>Phim yêu thích</strong>
                </Link>
                <button className="btn-nav" onClick={handleClick}>
                  Đăng xuất
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </section>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import AppContext from "./AppContext";
import { baseApi } from "./Register";
import SearchBar from "./SearchBar";
import "./NavBar.css";
export default function NavBar({ isClicked, setIsClicked }) {
  const navigate = useNavigate();
  const { isLogin, setIsLogin, isAdmin, avatar } = useContext(AppContext);
  const [onMouseGenre, setOnMouseGenre] = useState(false);
  const [onMouseYear, setOnMouseYear] = useState(false);
  const [uniqueGenres, setUniqueGenres] = useState([]);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    //Lấy giá trị thể loại không trùng từ database
    fetch(`${baseApi}/unique-genres`)
      .then((res) => res.json())
      .then((data) => {
        setUniqueGenres(data);
      });
  }, []);
  useEffect(() => {
    //Lấy giá trị năm không trùng từ database
    fetch(`${baseApi}/unique-years`)
      .then((res) => res.json())
      .then((data) => {
        setUniqueYears(data);
      });
  }, []);
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
      })
      .catch();
  };
  return (
    <section>
      <nav>
        <ul>
          <li>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <i className="fa-solid fa-house"></i>
              <strong
                onClick={() => {
                  setIsClicked(false);
                  navigate("/");
                }}
              >
                TRANG CHỦ
              </strong>
            </div>
          </li>
          <li
            onMouseEnter={() => setOnMouseGenre(true)}
            onMouseLeave={() => setOnMouseGenre(false)}
          >
            <div>
              <strong>THỂ LOẠI</strong>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            {uniqueGenres.length > 0 && onMouseGenre && (
              <div className="filter-dropdown-menu">
                {uniqueGenres.map((value, index) => {
                  return (
                    <div className="filter-dropdown-menu-item" key={index}>
                      <Link
                        to={`/filter/genre?genre=${encodeURIComponent(value)}`}
                      >
                        <button> {value}</button>
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
            <div>
              <strong>NĂM</strong>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            {uniqueYears.length > 0 && onMouseYear && (
              <div className="filter-dropdown-menu">
                {uniqueYears.map((value, index) => {
                  return (
                    <div className="filter-dropdown-menu-item" key={index}>
                      <Link
                        to={`/filter/year?year=${encodeURIComponent(value)}`}
                      >
                        <button> {value}</button>
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
                <div className="user-dropdown">
                  <img
                    src={`${baseApi}/images/${avatar}`}
                    alt=""
                    width={50}
                    height={50}
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
              <div className="user-dropdown-menu">
                {isAdmin && (
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
                  <i class="fa-solid fa-heart"></i>
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

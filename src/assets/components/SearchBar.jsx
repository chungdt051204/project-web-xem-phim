import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { baseApi } from "./Register";
import "./SearchBar.css";
export default function SearchBar({ isClicked, setIsClicked }) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [moviesSuggestion, setMoviesSuggestion] = useState([]);
  const valueInput = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsClicked(true);
    navigate(`/search?name=${encodeURIComponent(valueInput.current.value)}`);
  };
  const handleChange = () => {
    setValue(valueInput.current.value);
    //Khi dữ liệu trên thanh input thay đổi sẽ gọi hàm fetch để lấy dữu liệu từ backend
    fetch(`${baseApi}/movies-suggestion?value=${encodeURIComponent(value)}`)
      .then((res) => res.json())
      .then((data) => {
        setMoviesSuggestion(data);
      });
  };
  return (
    <section>
      <form className="form-search" onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="text"
          id="value"
          name="value"
          ref={valueInput}
          placeholder="Nhập tên phim"
          required
        />
        <button>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
      {value && (
        <div className="searchBar-dropdown-menu">
          {moviesSuggestion.length > 0 ? (
            moviesSuggestion.map((value, index) => {
              return (
                <div className="searchBar-dropdown-menu-item" key={index}>
                  <Link to={`/movie/${value._id}`}>
                    <img
                      src={`${baseApi}/images/${value.poster}`}
                      alt=""
                      width={70}
                      height={100}
                    />
                  </Link>
                  <Link to={`/movie/${value._id}`}>
                    <strong>{value.title}</strong>
                  </Link>
                </div>
              );
            })
          ) : (
            <p>Không tìm thấy phim</p>
          )}
        </div>
      )}
    </section>
  );
}

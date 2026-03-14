import { useNavigate, Link } from "react-router-dom";
import { useRef, useState } from "react";
import { api } from "../../App";
import fetchApi from "../service/api";

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
    fetchApi({
      url: `${api}/movie?name=${encodeURIComponent(value)}`,
      setData: setMoviesSuggestion,
    });
  };
  return (
    <section>
      <form className="search relative text-black" onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="text"
          id="value"
          name="value"
          ref={valueInput}
          placeholder="Nhập tên phim"
          required
        />
        <button className="absolute start-[180px] top-[2px] text-black border-0 bg-transparent">
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
      {value && (
        <div
          className="absolute flex flex-col overflow-auto w-[210px] h-[300px] pt-[5px] 
          pb-[30px] px-[10px] text-white rounded-[5px]"
          style={{
            scrollBehavior: "smooth",
            backgroundColor: "rgb(30, 30, 30)",
          }}
        >
          {moviesSuggestion?.docs?.length > 0 ? (
            moviesSuggestion.docs.map((value, index) => {
              return (
                <div
                  className="flex w-[180px] gap-x-[20px] mt-[10px]"
                  key={index}
                >
                  <div className="w-[70px] h-[100px] flex-shrink-0">
                    <Link to={`/movie/detail?id=${value._id}`}>
                      <img src={value.poster} alt="" />
                    </Link>
                  </div>
                  <Link to={`/movie/detail?id=${value._id}`}>
                    <p className="text-[14px]">{value.title}</p>
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

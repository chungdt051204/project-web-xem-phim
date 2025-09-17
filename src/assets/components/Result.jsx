import { Link } from "react-router-dom";
import { useState } from "react";
import { baseApi } from "./Register";
import "./Result.css";
export default function Result({ data, content, buttons }) {
  const [onMouse, setOnMouse] = useState(false);
  const [idx, setIdx] = useState(0);
  return (
    <section className="result-container">
      <h2>{content}</h2>
      <div className="result">
        <div className="result-track">
          {data.length > 0 ? (
            data.map((value, index) => {
              return (
                <div key={index} className="result-item">
                  <Link to={`/movie/${value._id}`}>
                    <img
                      onMouseEnter={() => {
                        setIdx(index);
                        setOnMouse(true);
                      }}
                      onMouseLeave={() => setOnMouse(false)}
                      style={{ opacity: onMouse && index === idx && "0.4" }}
                      src={`${baseApi}/images/${value.poster}`}
                      alt=""
                      width={150}
                      height={200}
                    />
                  </Link>
                  <Link
                    onMouseEnter={() => {
                      setOnMouse(true);
                      setIdx(index);
                    }}
                    onMouseLeave={() => {
                      setOnMouse(false);
                    }}
                    className="link"
                    to={`/movie/${value._id}`}
                  >
                    <h4>{value.title}</h4>
                  </Link>
                  <div className="rating-star">
                    <i className="fa-solid fa-star"></i>
                    {value.rating}
                  </div>
                  {onMouse && index === idx && (
                    <Link to={`/movie/${value._id}`}>
                      <button
                        className="play"
                        onMouseEnter={() => setOnMouse(true)}
                        onMouseLeave={() => setOnMouse(false)}
                      >
                        <i class="fa-solid fa-play"></i>
                      </button>
                    </Link>
                  )}
                </div>
              );
            })
          ) : (
            <p>Không tìm thấy phim để hiển thị</p>
          )}
        </div>
        {buttons}
      </div>
    </section>
  );
}

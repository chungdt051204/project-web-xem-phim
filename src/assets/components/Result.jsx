import { Link } from "react-router-dom";
import { useState } from "react";
import { baseApi } from "./Register";
export default function Result({
  data,
  content,
  containerWidth,
  contentWidth,
  buttons,
}) {
  const [onMouse, setOnMouse] = useState(false);
  const [idx, setIdx] = useState(0);
  return (
    <section
      style={{ width: containerWidth }}
      className="flex flex-col gap-[10px]  mt-[10px] ms-[40px]"
    >
      <h2 className="text-[28px]">{content}</h2>
      <div
        className="flex flex-col gap-[30px] py-[30px] px-0 rounded-[5px]"
        style={{ backgroundColor: "rgba(15, 20, 22, 1)" }}
      >
        <div
          style={{ width: contentWidth }}
          className="flex flex-wrap gap-[20px] mx-auto"
        >
          {data.length > 0 ? (
            data.map((value, index) => {
              return (
                <div
                  key={index}
                  className="relative flex flex-col gap-[10px] w-[150px] h-[300px]"
                >
                  <Link to={`/movie/detail?id=${value._id}`}>
                    <img
                      className="w-[150px] h-[200px] rounded-[3px]"
                      onMouseEnter={() => {
                        setIdx(index);
                        setOnMouse(true);
                      }}
                      onMouseLeave={() => setOnMouse(false)}
                      style={{ opacity: onMouse && index === idx && "0.4" }}
                      src={value.poster}
                      alt=""
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
                    to={`/movie/detail?id=${value._id}`}
                  >
                    <h4>{value.title}</h4>
                  </Link>
                  <div className="rating-star">
                    <i className="fa-solid fa-star"></i>
                    {value.rating}
                  </div>
                  {onMouse && index === idx && (
                    <Link to={`/movie/detail?id=${value._id}`}>
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

import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { baseApi } from "./Register";
import "./Slider.css";
export default function Slider({ data, content }) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [onMouse, setOnMouse] = useState(false);
  const [idx, setIdx] = useState(0);
  const slider = useRef();
  // const handleClick = () => {
  //   navigate(
  //     `/movie?name=${encodeURIComponent(
  //       data[Math.floor(Math.random() * data.length)].title
  //     )}`
  //   );
  // };
  const handleClickLeft = () => {
    const maxScroll = slider.current.scrollWidth - slider.current.clientWidth;
    //maxScroll: giá trị cuộn tối đa
    // scrollWidth: tổng chiều rộng của list phim
    // clientWidth: chiều rộng hiển thị được của container
    const newLength = current - 157; //Mỗi item có width là 160 đặt 157 để trừ hao
    if (newLength <= 0) {
      //quay về cuối
      slider.current.scrollLeft = maxScroll;
      //Thiết lập biến current bằng giá trị cuộn tối đa
      setCurrent(maxScroll);
    } else {
      slider.current.scrollLeft -= 157;
      setCurrent(newLength);
    }
  };
  const handleClickRight = () => {
    const maxScroll = slider.current.scrollWidth - slider.current.clientWidth;
    const newLength = current + 157;
    console.log(newLength);
    if (newLength > maxScroll) {
      // quay về đầu
      slider.current.scrollLeft = 0;
      setCurrent(0);
    } else {
      slider.current.scrollLeft += 157;
      setCurrent(newLength);
    }
  };
  return (
    <section className="slider-container">
      {/* <button onClick={handleClick}>Xem phim ngẫu nhiên</button> */}
      <h2>{content}</h2>
      <div className="slider">
        {slider.current &&
          slider.current.scrollWidth > slider.current.clientWidth && (
            <button
              className="slider-button slider-button-left"
              onClick={handleClickLeft}
            >
              <i className="fa-solid fa-angle-left"></i>
            </button>
          )}
        <div className="slider-track" ref={slider}>
          {data.map((value, index) => {
            return (
              <div key={index} className="slider-item">
                <Link className="link" to={`/movie/${value._id}`}>
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
                      <i className="fa-solid fa-play"></i>
                    </button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
        {slider.current &&
          slider.current.scrollWidth > slider.current.clientWidth && (
            <button
              className="slider-button slider-button-right"
              onClick={handleClickRight}
            >
              <i className="fa-solid fa-angle-right"></i>
            </button>
          )}
      </div>
    </section>
  );
}

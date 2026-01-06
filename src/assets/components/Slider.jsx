import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { baseApi } from "./Register";
export default function Slider({ data, content }) {
  const [current, setCurrent] = useState(0);
  const [onMouse, setOnMouse] = useState(false);
  const [idx, setIdx] = useState(0);
  const slider = useRef();
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
    <section className="w-[1200px] mx-auto">
      <h2 className="text-[28px]">{content}</h2>
      <div
        className="relative flex h-[350px] rounded-[5px]"
        style={{ backgroundColor: "rgba(15, 20, 22, 1)" }}
      >
        {slider.current &&
          slider.current.scrollWidth > slider.current.clientWidth && (
            <button
              className="absolute w-[30px] h-[8%] top-[110px] left-[35px] text-white border-none bg-red-500 z-1"
              onClick={handleClickLeft}
            >
              <i className="fa-solid fa-angle-left"></i>
            </button>
          )}
        <div
          className="flex gap-[10px] w-[1120px] my-[30px] mx-auto overflow-x-auto "
          style={{ scrollBehavior: "smooth" }}
          ref={slider}
        >
          {data.map((value, index) => {
            return (
              <div
                key={index}
                className="relative flex flex-col flex-shrink-0 gap-[15px] w-[150px] "
              >
                <Link className="link" to={`/movie/detail?id=${value._id}`}>
                  <img
                    className="w-[150px] h-[200px] rounded-[3px]"
                    onMouseEnter={() => {
                      setIdx(index);
                      setOnMouse(true);
                    }}
                    onMouseLeave={() => setOnMouse(false)}
                    style={{ opacity: onMouse && index === idx && "0.4" }}
                    src={`${baseApi}/images/${value.poster}`}
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
                  to={`/movie/detail?id=${value._id}`}
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
              className="absolute w-[30px] h-[8%] top-[110px] left-[1125px] text-white border-none bg-red-500 z-1"
              onClick={handleClickRight}
            >
              <i className="fa-solid fa-angle-right"></i>
            </button>
          )}
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { baseApi } from "./Register";
import "./Carousel.css";
export default function Carousel() {
  const [featureMovies, setFeatureMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const carousel = useRef();
  useEffect(() => {
    fetch(`${baseApi}/featureMovies`)
      .then((res) => res.json())
      .then((data) => {
        setFeatureMovies(data);
      });
  }, []);
  useEffect(() => {
    //Nếu chưa có dữ liệu thì bỏ qua
    if (featureMovies.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => {
        //Phải gán biến, useState sẽ không cập nhật giá trị ngay
        let newIndex = prev + 1;
        //Nếu đã đến cuối thì quay về đầu
        if (newIndex >= featureMovies.length) {
          carousel.current.scrollLeft = 0;
          //Khi quay về đầu thì thiết lập vị trí cho chấm dot về 0
          return 0;
        } else {
          carousel.current.scrollLeft += 1000;
          //Khi trượt qua thì gán vị trí cho chấm dot luôn
          return newIndex;
        }
      });
    }, 2000);
    //clear khi unmount(chuyển giao diện, chuyển trang) hoặc khi reload
    return () => clearInterval(timer);
  }, [featureMovies]); //useEffect chạy mỗi khi dữ liệu featureMovies thay đổi
  return (
    <section className="carousel">
      <div className="carousel-track" ref={carousel}>
        {featureMovies.map((value, index) => {
          return (
            <div className="carousel-item" key={index}>
              <Link to={`/movie/${value._id}`}>
                <img
                  src={`${baseApi}/images/${value.thumbnail}`}
                  alt=""
                  width={1000}
                  height={500}
                />
              </Link>
            </div>
          );
        })}
      </div>
      <div className="dots">
        {featureMovies.map((value, idx) => {
          return (
            <div
              className="dot-item"
              key={idx}
              style={{
                backgroundColor: idx === index && "white",
              }}
            ></div>
          );
        })}
      </div>
    </section>
  );
}

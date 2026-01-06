import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import AppContext from "./AppContext";
import { url } from "../../App";

export default function Carousel() {
  const { movies } = useContext(AppContext);
  const [index, setIndex] = useState(0);
  const carousel = useRef();

  useEffect(() => {
    //Nếu chưa có dữ liệu thì bỏ qua
    if (movies.length === 0) return;
    const length = movies?.filter((value) => value.isFeatured).length;
    const timer = setInterval(() => {
      setIndex((prev) => {
        //Phải gán biến, useState sẽ không cập nhật giá trị ngay
        let newIndex = prev + 1;
        //Nếu đã đến cuối thì quay về đầu
        if (newIndex >= length) {
          carousel.current.scrollLeft = 0;
          //Khi quay về đầu thì thiết lập vị trí cho chấm dot về 0
          return 0;
        } else {
          carousel.current.scrollLeft += 1000;
          //Khi trượt qua thì gán vị trí mới cho chấm dot luôn
          return newIndex;
        }
      });
    }, 2000);
    //clear khi unmount(chuyển giao diện, chuyển trang) hoặc khi reload
    return () => clearInterval(timer);
  }, [movies]); //useEffect chạy mỗi khi dữ liệu Movies thay đổi
  return (
    <section className="w-[1000px] my-[50px] mx-auto">
      <div
        className="flex overflow-x-auto"
        style={{ scrollBehavior: "smooth" }}
        ref={carousel}
      >
        {movies.map((value) => {
          if (value.isFeatured) {
            return (
              <div className="flex-shrink-0" key={value._id}>
                <Link to={`/movie/${value._id}`}>
                  <img
                    className="w-[1000px] h-[500px] rounded-[5px]"
                    src={`${url}/images/${value.thumbnail}`}
                  />
                </Link>
              </div>
            );
          }
        })}
      </div>
      <div className="flex gap-[10px] w-[180px] my-[15px] mx-auto">
        {movies
          ?.filter((value) => value.isFeatured)
          .map((value, idx) => {
            return (
              <div
                className="w-[14px] h-[14px] border border-white rounded-[50%]"
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

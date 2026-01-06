import { Link } from "react-router-dom";
import { useState } from "react";

export default function Pagination() {
  //Tạo mảng có 3 phần tử
  const pages = [...Array(3)].map((_, i) => i + 1);
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <>
      <section className="flex gap-[5px] mx-auto">
        <button className="btn-pagination" disabled>
          Trang {currentPage + 1} của {pages.length}
        </button>
        {currentPage >= 1 && (
          <Link to="/">
            <button
              className="btn btn-pagination"
              onClick={() => setCurrentPage(0)}
            >
              Trang đầu
            </button>
          </Link>
        )}
        <div className="flex gap-[5px]">
          {pages.map((value, index) => {
            return (
              <Link
                key={index}
                to={index > 0 ? `/movies-page${index + 1}` : "/"}
              >
                <button
                  className="btn btn-pagination"
                  onClick={() => {
                    setCurrentPage(index);
                  }}
                  style={{
                    backgroundColor: index === currentPage && "red",
                  }}
                >
                  {value}
                </button>
              </Link>
            );
          })}
        </div>
        <Link to={`/movies-page${pages.length}`}>
          <button
            className="btn btn-pagination"
            onClick={() => setCurrentPage(pages.length - 1)}
          >
            Trang cuối
          </button>
        </Link>
      </section>
    </>
  );
}

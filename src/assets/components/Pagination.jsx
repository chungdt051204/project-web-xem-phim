import { Link } from "react-router-dom";
import { useState } from "react";
import "./Pagination.css";
export default function Pagination() {
  //Tạo mảng có 2 phần tử
  const pages = [...Array(2)].map((_, i) => i + 1);
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <>
      <section className="pagination">
        <button>
          Trang {currentPage + 1} của {pages.length}
        </button>
        {currentPage >= 1 && (
          <Link to="/">
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(0)}
            >
              Trang đầu
            </button>
          </Link>
        )}
        <div className="pagination-item">
          {pages.map((value, index) => {
            return (
              <Link
                key={index}
                to={index > 0 ? `/movies-page${index + 1}` : "/"}
              >
                <button
                  className="pagination-button"
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
            className="pagination-button"
            onClick={() => setCurrentPage(pages.length - 1)}
          >
            Trang cuối
          </button>
        </Link>
      </section>
    </>
  );
}

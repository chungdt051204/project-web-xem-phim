import { Link, useSearchParams } from "react-router-dom";

export default function Pagination({ totalPages }) {
  //Tạo mảng có số phần tử bằng tổng số trang
  const [searchParams] = useSearchParams();
  const createUrl = (page) => {
    const newParams = new URLSearchParams(searchParams);
    if (page > 1) newParams.set("page", page);
    else newParams.delete("page");
    return `?${newParams.toString()}`;
  };
  const pages = [...Array(totalPages)].map((_, i) => i + 1);
  const currentPage = Number(searchParams.get("page")) || 1;

  return (
    <>
      <section className="flex gap-[5px] mx-auto">
        <button className="btn-pagination" disabled>
          Trang {currentPage} của {totalPages}
        </button>
        {currentPage >= 1 && (
          <Link to={createUrl(1)}>
            <button className="btn btn-pagination">Trang đầu</button>
          </Link>
        )}
        <div className="flex gap-[5px]">
          {pages.map((value, index) => {
            return (
              <Link key={index} to={createUrl(index + 1)}>
                <button
                  className="btn btn-pagination"
                  style={{
                    backgroundColor: index === currentPage - 1 && "red",
                  }}
                >
                  {value}
                </button>
              </Link>
            );
          })}
        </div>
        <Link to={createUrl(totalPages)}>
          <button className="btn btn-pagination">Trang cuối</button>
        </Link>
      </section>
    </>
  );
}

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { baseApi } from "./Register";
import Result from "./Result";
export default function FilterResultWithYear() {
  const [searchParams] = useSearchParams();
  const year = searchParams.get("year");
  const [filterResultWithYear, setFilterResultWithYear] = useState([]);
  useEffect(() => {
    fetch(`${baseApi}/filter/year?year=${year}`)
      .then((res) => res.json())
      .then((data) => {
        setFilterResultWithYear(data);
      });
  }, [year]);
  return (
    <>
      <section>
        <Result
          data={filterResultWithYear}
          content={`Tìm thấy ${filterResultWithYear.length} phim thuộc năm ${year}`}
        />
      </section>
    </>
  );
}

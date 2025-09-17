import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { baseApi } from "./Register";
import Result from "./Result";
export default function FilterResultWithGenre() {
  const [searchParams] = useSearchParams();
  const genre = searchParams.get("genre");
  const [filterResultWithGenre, setFilterResultWithGenre] = useState([]);
  useEffect(() => {
    fetch(`${baseApi}/filter/genre?genre=${encodeURIComponent(genre)}`)
      .then((res) => res.json())
      .then((data) => {
        setFilterResultWithGenre(data);
      });
  }, [genre]); //useEffect chạy lại mỗi khi thể loại trên URL thay đổi
  return (
    <>
      <section>
        <Result
          data={filterResultWithGenre}
          content={`Tìm thấy ${filterResultWithGenre.length} phim thể loại ${genre}`}
        />
      </section>
    </>
  );
}

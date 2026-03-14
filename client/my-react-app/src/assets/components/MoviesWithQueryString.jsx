import { useEffect, useState, useContext } from "react";
import AppContext from "./AppContext";
import { useSearchParams } from "react-router-dom";
import { api } from "../../App";
import fetchApi from "../service/api";
import MovieList from "./MovieList";
import Pagination from "./Pagination";

export default function MoviesWithQueryString() {
  const { refresh } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const genre = searchParams.get("genre");
  const year = searchParams.get("year");
  const name = searchParams.get("name");
  const page = searchParams.get("page");
  const [moviesWithQueryString, setMoviesWithQueryString] = useState([]);
  const isFiltering = Array.from(searchParams.keys()).some(
    (key) => key !== "page"
  ); //Phải dùng Array.from vì searchParams.key() ko phải là 1 mảng
  useEffect(() => {
    const params = new URLSearchParams();
    if (genre) params.append("genre", genre);
    if (year) params.append("year", year);
    if (name) params.append("name", encodeURIComponent(name));
    if (page) params.append("_page", page);
    fetchApi({
      url: `${api}/movie?${params.toString()}&_limit=8`,
      setData: setMoviesWithQueryString,
    });
  }, [genre, year, name, page, refresh]);
  return (
    <>
      <MovieList
        data={moviesWithQueryString.docs}
        containerWidth={800}
        trackWidth={680}
        content={
          isFiltering
            ? "Tìm thấy" +
              " " +
              moviesWithQueryString?.docs?.length +
              " " +
              "phim"
            : "Tất cả phim"
        }
        button={<Pagination totalPages={moviesWithQueryString.totalPages} />}
      />
    </>
  );
}

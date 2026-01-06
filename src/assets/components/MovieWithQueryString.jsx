import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import fetchApi from "../service/api";
import { url } from "../../App";
import Result from "./Result";

export default function MovieWithQueryString() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genre = searchParams.get("genre");
  const year = searchParams.get("year");
  const [moviesWithQueryString, setMoviesWithQueryString] = useState([]);
  useEffect(() => {
    const params = new URLSearchParams();
    if (genre) params.append("genre", genre);
    if (year) params.append("year", year);
    fetchApi({
      url: `${url}/movie?${params.toString()}`,
      setData: setMoviesWithQueryString,
    });
  }, [genre, year]);
  return (
    <>
      <Result data={moviesWithQueryString} />
    </>
  );
}

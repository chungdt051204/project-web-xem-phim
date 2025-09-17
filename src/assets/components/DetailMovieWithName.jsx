import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { baseApi } from "./Register";
import DetailMovie from "./DetailMovie";
export default function DetailMovieWithName() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const [detailMovieWithName, setDetailMovieWithName] = useState("");
  useEffect(() => {
    fetch(`${baseApi}/movie?name=${encodeURIComponent(name)}`)
      .then((res) => res.json())
      .then((data) => {
        setDetailMovieWithName(data);
      });
  }, [name]);
  return (
    <>
      <DetailMovie data={detailMovieWithName} />
    </>
  );
}

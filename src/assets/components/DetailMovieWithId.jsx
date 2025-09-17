import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseApi } from "./Register";
import DetailMovie from "./DetailMovie";
export default function DetailMovieWithId() {
  const [detailMovieWithId, setDetailMovieWithId] = useState("");
  //Dùng useParams() để lấy id từ trên URL
  const { id } = useParams();
  useEffect(() => {
    fetch(`${baseApi}/movie/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDetailMovieWithId(data);
      });
  }, [id]); //useEffect chạy lại mỗi khi id trên URL thay đổi
  return (
    <>
      <DetailMovie data={detailMovieWithId} />
    </>
  );
}

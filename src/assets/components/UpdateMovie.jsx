import { useEffect, useRef, useState } from "react";
import { baseApi } from "./Register";
export default function UpdateMovie({ ref, id }) {
  const [movie, setMovie] = useState("");
  const title = useRef();
  const description = useRef();
  const thumbnail = useRef();
  const videoUrl = useRef();
  const year = useRef();
  const duration = useRef();
  const rating = useRef();
  const director = useRef();
  const poster = useRef();
  useEffect(() => {
    if (!id) return;
    fetch(`${baseApi}/admin/movie/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMovie(data);
      });
  }, [id]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title.current.value);
    formData.append("description", description.current.value);
    formData.append(
      "thumbnail",
      !thumbnail.current.files[0] ? movie.thumbnail : thumbnail.current.files[0]
    );
    formData.append("videoUrl", videoUrl.current.value);
    formData.append("year", year.current.value);
    formData.append("duration", duration.current.value);
    formData.append("rating", rating.current.value);
    formData.append("director", director.current.value);
    formData.append(
      "poster",
      !poster.current.files[0] ? movie.poster : poster.current.files[0]
    );
    fetch(`${baseApi}/admin/movie/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(({ message }) => {
        console.log(message);
        ref.current.close();
      })
      .catch();
  };
  return (
    <>
      <dialog
        ref={ref}
        className="fixed w-[550px] top-[100px] start-[400px] px-[10px] py-[25px] rounded-[5px] bg-black "
      >
        <form
          method="dialog"
          className="flex justify-evenly w-[510px] m-auto"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label htmlFor="Title">Tiêu đề:</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={movie.title}
              ref={title}
            />
            <label htmlFor="Description">Mô tả:</label>
            <textarea
              id="description"
              name="description"
              defaultValue={movie.description}
              ref={description}
              rows={6}
            ></textarea>
            <label htmlFor="Thumbnail">Thumbnail:</label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              ref={thumbnail}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="VideoUrl">Link Video:</label>
            <input
              type="text"
              id="video-url"
              name="video-url"
              defaultValue={movie.videoUrl}
              ref={videoUrl}
            />
            <label htmlFor="Year">Năm:</label>
            <input
              type="number"
              id="year"
              name="year"
              defaultValue={movie.year}
              ref={year}
              min={2000}
              max={2025}
            />
            <label htmlFor="Duration">Thời lượng:</label>
            <input
              type="text"
              id="duration"
              name="duration"
              defaultValue={movie.duration}
              ref={duration}
            />
            <label htmlFor="Rating">Đánh giá:</label>
            <input
              type="number"
              id="rating"
              name="rating"
              defaultValue={movie.rating}
              ref={rating}
              min={0}
              max={10}
              step={0.1}
            />
            <label htmlFor="Director">Đạo diễn:</label>
            <input
              type="text"
              id="director"
              name="director"
              defaultValue={movie.director}
              ref={director}
            />
            <label htmlFor="Poster">Poster:</label>
            <input type="file" id="poster" name="poster" ref={poster} />
            <button className="btn-form">Cập nhật</button>
          </div>
        </form>
      </dialog>
    </>
  );
}

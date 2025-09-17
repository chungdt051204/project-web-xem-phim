import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseApi } from "./Register";
import NavBar from "./NavBar";
import "./FormManagement.css";
export default function AddMovie() {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [err, setErr] = useState("");
  const title = useRef();
  const description = useRef();
  const thumbnail = useRef();
  const videoUrl = useRef();
  const year = useRef();
  const duration = useRef();
  const rating = useRef();
  const director = useRef();
  const poster = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      title.current.value === "" ||
      !thumbnail.current ||
      videoUrl.current.value === "" ||
      director.current.value === "" ||
      !poster.current
    ) {
      setErr("Vui lòng điền đầy đủ thông tin");
      return;
    }
    const formData = new FormData();
    formData.append("title", title.current.value);
    formData.append("description", description.current.value);
    formData.append("thumbnail", thumbnail.current.files[0]);
    formData.append("videoUrl", videoUrl.current.value);
    formData.append("year", year.current.value);
    formData.append("duration", duration.current.value);
    formData.append("rating", rating.current.value);
    formData.append("director", director.current.value);
    formData.append("poster", poster.current.files[0]);
    fetch(`${baseApi}/admin/movie`, {
      method: "POST",
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
        navigate("/admin");
      })
      .catch();
  };
  return (
    <>
      <NavBar isClicked={isClicked} setIsClicked={setIsClicked} />
      <section className="form-management-container">
        <h2>Thêm phim</h2>
        <div className="form-management">
          <form className="form-management-info">
            <label htmlFor="Title">Tiêu đề:</label>
            <input type="text" id="title" name="title" ref={title} />
            <label htmlFor="Description">Mô tả:</label>
            <textarea
              id="description"
              name="description"
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
            <label htmlFor="VideoUrl">Link Video:</label>
            <input type="text" id="video-url" name="video-url" ref={videoUrl} />
          </form>
          <form className="form-management-info" onSubmit={handleSubmit}>
            <label htmlFor="Year">Năm:</label>
            <input
              type="number"
              id="year"
              name="year"
              ref={year}
              min={2000}
              max={2025}
            />
            <label htmlFor="Duration">Thời lượng:</label>
            <input type="text" id="duration" name="duration" ref={duration} />
            <label htmlFor="Rating">Đánh giá:</label>
            <input
              type="number"
              id="rating"
              name="rating"
              ref={rating}
              min={0}
              max={10}
              step={0.1}
            />
            <label htmlFor="Director">Đạo diễn:</label>
            <input type="text" id="director" name="director" ref={director} />
            <label htmlFor="Poster">Poster:</label>
            <input type="file" id="poster" name="poster" ref={poster} />
            {err && <strong className="error">{err}</strong>}
            <button>Thêm</button>
          </form>
        </div>
      </section>
    </>
  );
}

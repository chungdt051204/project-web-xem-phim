import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../components/AppContext";
import { api } from "../../App";
import { toast } from "react-toastify";
import fetchApi from "../service/api";
import AdminNavBar from "../components/AdminNavBar";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import ConfirmDialog from "../components/ConfirmDialog";

export default function QuanLyPhim() {
  const {
    isLoading,
    isLogin,
    isAdmin,
    refresh,
    setRefresh,
    me,
    movies,
    genres,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");
  const movieId = searchParams.get("movieId");
  const order = searchParams.get("order");
  const year = searchParams.get("year");
  const queryString = new URLSearchParams(searchParams);
  const uniqueYear = [
    ...new Set(
      movies?.docs?.map((value) => {
        return value.year;
      })
    ),
  ];
  const [moviesWithQueryString, setMoviesWithQueryString] = useState([]);
  const [movieWithId, setMovieWithId] = useState(null);
  const [arrayGenre, setArrayGenre] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [err, setErr] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: "",
    duration: "",
    director: "",
    videoUrl: "",
  });
  const poster = useRef();
  const thumbnail = useRef();
  const formDialog = useRef();
  const confirmDialog = useRef();

  //Nhóm kiểm tra quyền
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    if (!isLoading) {
      if (!isLogin || me?.role !== "admin") {
        navigate("/");
        return;
      }
    }
  }, [isLoading, isLogin, me, navigate]);
  //Nhóm lấy danh sách phim theo điều kiện
  useEffect(() => {
    if (isAdmin) {
      const params = new URLSearchParams();
      if (page) params.append("_page", page);
      if (order) params.append("sortBy", "createdAt");
      if (order === "oldest") params.append("orderBy", "desc");
      if (order === "newest") params.append("orderBy", "asc");
      if (year) params.append("year", year);
      fetchApi({
        url: `${api}/movie?${params.toString()}&_limit=8`,
        setData: setMoviesWithQueryString,
      });
    }
  }, [isAdmin, page, refresh, order, year]);
  //Nhóm lấy dữ liệu phim theo id
  useEffect(() => {
    if (isAdmin) {
      if (movieId) {
        setIsEdit(true);
        fetchApi({
          url: `${api}/movie?id=${movieId}`,
          setData: setMovieWithId,
        });
      } else {
        setIsEdit(false);
        setFormData({
          title: "",
          description: "",
          year: "",
          duration: "",
          director: "",
          videoUrl: "",
        });
      }
    }
  }, [isAdmin, movieId]);
  //Nhóm set dữ liệu form
  useEffect(() => {
    if (isEdit && movieWithId) {
      setFormData({
        title: movieWithId?.title,
        description: movieWithId?.description,
        year: movieWithId?.year,
        duration: movieWithId?.duration,
        director: movieWithId?.director,
        videoUrl: movieWithId?.videoUrl,
      });
      const newArrayGenre = movieWithId?.genre?.map((value) => {
        return value._id;
      });
      setArrayGenre(newArrayGenre);
      formDialog.current.showModal();
    }
  }, [isEdit, movieWithId]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErr("");
  };
  const handleSort = (value) => {
    if (value !== "") {
      queryString.set("order", value);
      queryString.delete("page"); //Sắp xếp tất cả
    } else queryString.delete("order");
    navigate(`?${queryString.toString()}`);
  };
  const handleFilterYear = (value) => {
    if (value !== "") {
      queryString.set("year", value);
      queryString.delete("page"); //Lọc toàn bộ dữ liệu
    } else queryString.delete("year");
    navigate(`?${queryString.toString()}`);
  };
  const handleGenreSelected = (genreId) => {
    if (!arrayGenre.includes(genreId))
      setArrayGenre((prev) => [...prev, genreId]);
    else {
      const newArrayGenre = arrayGenre.filter((item) => item !== genreId);
      setArrayGenre(newArrayGenre);
    }
  };
  const handleAddMovie = (e) => {
    e.preventDefault();
    if (arrayGenre.length > 3) {
      alert("Chỉ được chọn tối đa 3 thể loại");
      return;
    } else {
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("description", formData.description);
      dataToSend.append("year", formData.year);
      dataToSend.append("duration", formData.duration);
      dataToSend.append("director", formData.director);
      dataToSend.append("videoUrl", formData.videoUrl);
      //FormData ko thể gửi mảng
      arrayGenre.forEach((id) => {
        dataToSend.append("genre", id);
      });
      dataToSend.append("poster", poster.current.files[0]);
      dataToSend.append("thumbnail", thumbnail.current.files[0]);
      fetch(`${api}/movie`, {
        method: "POST",
        body: dataToSend,
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw res;
        })
        .then(({ message }) => {
          toast.success(message);
          formDialog.current.close();
          setFormData({
            title: "",
            description: "",
            year: "",
            duration: "",
            director: "",
            videoUrl: "",
          });
          setRefresh((prev) => prev + 1);
        })
        .catch(async (err) => {
          if (err.status === 409) {
            const { message } = await err.json();
            setErr(message);
          }
        });
    }
  };
  const handleDeleteMovie = () => {
    fetch(`${api}/movie?id=${movieWithId._id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        confirmDialog.current.close();
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };
  const handleOpenDialog = (id) => {
    setIsEdit(true);
    if (id) queryString.set("movieId", id);
    else queryString.delete("movieId");
    navigate(`?${queryString.toString()}`);
    formDialog.current.showModal();
  };
  const handleOpenConfirmDialog = (movieId) => {
    fetchApi({
      url: `${api}/movie?id=${movieId}`,
      setData: setMovieWithId,
    });
    confirmDialog.current.showModal();
  };
  const handleCloseDialog = () => {
    formDialog.current.close();
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (newParams.has("movieId")) newParams.delete("movieId");
      return newParams;
    });
    setArrayGenre([]);
  };
  const handleUpdateMovie = (e) => {
    console.log(arrayGenre);
    e.preventDefault();
    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("description", formData.description);
    dataToSend.append("year", formData.year);
    dataToSend.append("duration", formData.duration);
    dataToSend.append("director", formData.director);
    dataToSend.append("videoUrl", formData.videoUrl);
    //FormData ko thể gửi mảng
    arrayGenre.forEach((id) => {
      dataToSend.append("genre", id);
    });
    dataToSend.append("poster", poster.current.files[0]);
    dataToSend.append("thumbnail", thumbnail.current.files[0]);
    fetch(`${api}/movie?id=${movieId}`, {
      method: "PUT",
      body: dataToSend,
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          if (newParams.has("movieId")) newParams.delete("movieId");
          return newParams;
        });
        formDialog.current.close();
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };
  return (
    <>
      <AdminNavBar />
      <div className="bg-slate-900 min-h-screen p-8 text-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Quản lý phim</h2>
            <select
              onChange={(e) => handleSort(e.target.value)}
              className="bg-black"
            >
              <option value="">Sắp xếp theo</option>
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
            <select
              onChange={(e) => handleFilterYear(e.target.value)}
              className="bg-black"
            >
              <option value="">Chọn năm</option>
              {uniqueYear?.map((value, index) => {
                return (
                  <option key={index} value={`${value}`}>
                    {value}
                  </option>
                );
              })}
            </select>
            <button
              onClick={() => formDialog.current.showModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <i className="fa-solid fa-plus text-sm"></i>
              Thêm phim
            </button>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-700/50 text-slate-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Phim</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Thể loại
                  </th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {moviesWithQueryString?.docs?.map((value) => (
                  <tr
                    key={value._id}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={value.poster}
                          alt={value.title}
                          className="w-12 h-16 object-cover rounded shadow-md border border-slate-600"
                        />
                        <div>
                          <h4 className="text-white font-semibold text-base mb-1">
                            {value.title}
                          </h4>
                          <small className="text-slate-400 block italic">
                            {value.year} • {value.duration} phút •{" "}
                            {value.director}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap justify-center gap-2">
                        {value.genre?.map((item) => (
                          <span
                            key={item._id}
                            className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-xs font-medium"
                          >
                            {item.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleOpenDialog(value._id)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                          title="Sửa"
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          onClick={() => handleOpenConfirmDialog(value._id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          title="Xóa"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="w-[600px] m-auto">
        <Pagination totalPages={moviesWithQueryString.totalPages} />
      </div>
      <dialog
        ref={formDialog}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-slate-100 rounded-xl shadow-2xl p-0 backdrop:backdrop-blur-sm w-full max-w-2xl outline-none border-none m-0"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">
              {isEdit ? "Chỉnh sửa phim" : "Thêm phim mới"}
            </h2>
            <button
              onClick={handleCloseDialog}
              className="text-slate-400 hover:text-white transition-colors text-2xl font-light"
            >
              ✕
            </button>
          </div>
          <form
            onSubmit={isEdit ? handleUpdateMovie : handleAddMovie}
            className="space-y-5"
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="title"
                className="text-xs uppercase font-semibold text-slate-500 ml-1"
              >
                Tiêu đề
              </label>
              <input
                className="bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                value={formData.title}
                name="title"
                onChange={(e) => {
                  handleChange(e);
                }}
                type="text"
                placeholder="Ví dụ: Chainsaw Man..."
                required
              />
              <span className="error">{err && err}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="description"
                className="text-xs uppercase font-semibold text-slate-500 ml-1"
              >
                Mô tả
              </label>
              <textarea
                className="bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 outline-none transition-all min-h-[100px] resize-none"
                value={formData.description}
                name="description"
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Nhập nội dung mô tả..."
                required
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="duration"
                  className="text-xs uppercase font-semibold text-slate-500 ml-1"
                >
                  Thời lượng
                </label>
                <input
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm"
                  value={formData.duration}
                  name="duration"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  type="text"
                  placeholder="1h 55m"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="year"
                  className="text-xs uppercase font-semibold text-slate-500 ml-1"
                >
                  Năm
                </label>
                <input
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm"
                  value={formData.year}
                  name="year"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  type="number"
                  max={2026}
                  min={2000}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="director"
                  className="text-xs uppercase font-semibold text-slate-500 ml-1"
                >
                  Đạo diễn
                </label>
                <input
                  className="bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 outline-none shadow-sm"
                  value={formData.director}
                  name="director"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  type="text"
                  placeholder="Tên đạo diễn"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase font-semibold text-slate-500 ml-1">
                Thể loại (Chọn tối đa 3 thể loại)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-800/40 p-4 rounded-lg border border-slate-700">
                {genres?.docs?.map((value) => (
                  <label
                    key={value._id}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <input
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-offset-slate-900"
                      checked={arrayGenre.includes(value._id)}
                      onChange={(e) => handleGenreSelected(e.target.value)}
                      type="checkbox"
                      value={value._id}
                    />
                    <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                      {value.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="videoUrl"
                className="text-xs uppercase font-semibold text-slate-500 ml-1"
              >
                Link Video
              </label>
              <input
                className="bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                value={formData.videoUrl}
                name="videoUrl"
                onChange={(e) => {
                  handleChange(e);
                }}
                type="text"
                placeholder="https://youtube.com/..."
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase font-semibold text-slate-500 ml-1">
                  Poster phim
                </label>
                <input
                  ref={poster}
                  type="file"
                  name="poster"
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600 cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase font-semibold text-slate-500 ml-1">
                  Thumbnail
                </label>
                <input
                  ref={thumbnail}
                  type="file"
                  name="thumbnail"
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4">
              <button
                type="button"
                onClick={handleCloseDialog}
                className="px-6 py-2 text-sm font-medium text-slate-400 hover:text-white transition-all underline-offset-4 hover:underline"
              >
                HỦY
              </button>
              <button
                type="submit"
                className="px-10 py-2 rounded font-bold bg-white text-black hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-white/5"
              >
                {isEdit ? "CẬP NHẬT" : "LƯU PHIM"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <ConfirmDialog
        ref={confirmDialog}
        content="Bạn có muốn xóa phim này không ?"
        handleClick={handleDeleteMovie}
      />
      <Footer />
    </>
  );
}

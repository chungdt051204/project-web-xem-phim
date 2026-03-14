import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppContext from "../components/AppContext";
import { api } from "../../App";
import { toast } from "react-toastify";
import fetchApi from "../service/api";
import AdminNavBar from "../components/AdminNavBar";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import ConfirmDialog from "../components/ConfirmDialog";

export default function QuanLyTheLoai() {
  const { isLoading, isLogin, isAdmin, refresh, setRefresh, me } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const genreId = searchParams.get("genreId");
  const page = searchParams.get("page");
  const [genresWithQueryString, setGenresWithQueryString] = useState([]);
  const [genreWithId, setGenreWithId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [err, setErr] = useState("");
  const [genreName, setGenreName] = useState("");
  const formDialog = useRef();
  const confirmDialog = useRef();

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
  useEffect(() => {
    if (isAdmin) {
      const params = new URLSearchParams();
      if (page) params.append("_page", page);
      fetchApi({
        url: `${api}/genre?${params.toString()}&_limit=10`,
        setData: setGenresWithQueryString,
      });
    }
  }, [isAdmin, page, refresh]);
  useEffect(() => {
    if (isAdmin) {
      if (genreId) {
        setIsEdit(true);
        fetchApi({
          url: `${api}/genre?genreId=${genreId}`,
          setData: setGenreWithId,
        });
      } else {
        setIsEdit(false);
        setGenreName("");
      }
    }
  }, [isAdmin, genreId]);
  useEffect(() => {
    if (isEdit && genreWithId) {
      setGenreName(genreWithId?.name);
      formDialog.current.showModal();
    }
  }, [isEdit, genreWithId]);
  const createUrl = (id) => {
    const newParams = new URLSearchParams(searchParams);
    if (id) newParams.set("genreId", id);
    return newParams.toString();
  };
  const handleAddGenre = (e) => {
    e.preventDefault();
    fetch(`${api}/genre`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ genreName: genreName }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        formDialog.current.close();
        setGenreName("");
        setRefresh((prev) => prev + 1);
      })
      .catch(async (err) => {
        if (err.status === 409) {
          const { message } = await err.json();
          setErr(message);
        }
      });
  };
  const handleDeleteGenre = () => {
    fetch(`${api}/genre?genreId=${genreWithId._id}`, {
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
        if (err.status === 409) {
          const { message } = await err.json();
          confirmDialog.current.close();
          toast.error(message);
        }
      });
  };
  const handleOpenUpdateDialog = (genreId) => {
    setIsEdit(true);
    navigate(`?${createUrl(genreId)}`);
    formDialog.current.showModal();
  };
  const handleOpenConfirmDialog = (genreId) => {
    fetchApi({
      url: `${api}/genre?genreId=${genreId}`,
      setData: setGenreWithId,
    });
    confirmDialog.current.showModal();
  };
  const handleCloseDialog = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (newParams.has("genreId")) newParams.delete("genreId");
      return newParams;
    });
    formDialog.current.close();
  };
  const handleUpdateGenre = (e) => {
    e.preventDefault();
    fetch(`${api}/genre?genreId=${genreId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ genreName: genreName }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        formDialog.current.close();
        setRefresh((prev) => prev + 1);
        setSearchParams((prev) => prev.delete("genreId"));
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };
  return (
    <>
      <AdminNavBar />
      <section className="p-6 bg-[#0f1416] min-h-screen text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Quản lý thể loại</h2>
          <button
            onClick={() => {
              formDialog.current.showModal();
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-all"
          >
            + Thêm thể loại
          </button>
        </div>
        <div className="w-full border border-gray-800 rounded">
          <table className="w-full text-left">
            <thead className="bg-[#1a1d21] border-b border-gray-800">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-400">
                  Tên thể loại
                </th>
                <th className="px-4 py-3 font-medium text-gray-400 text-center">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {genresWithQueryString?.docs?.map((value) => (
                <tr key={value._id} className="hover:bg-gray-900/50">
                  <td className="px-4 py-4">{value.name}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-6">
                      <button
                        onClick={() => handleOpenUpdateDialog(value._id)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        onClick={() => handleOpenConfirmDialog(value._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
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
        <dialog
          ref={formDialog}
          className="fixed inset-0 m-auto bg-transparent p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
        >
          <div className="w-[350px] rounded-lg bg-[#1a1d21] text-white p-6 border border-gray-700 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-center">
              {isEdit ? "Chỉnh sửa thể loại" : "Thêm thể loại mới"}
            </h3>
            <form
              className="flex flex-col gap-4"
              onSubmit={isEdit ? handleUpdateGenre : handleAddGenre}
            >
              <div className="flex flex-col gap-2">
                <label className="text-md text-gray-400">Tên thể loại</label>
                <input
                  value={genreName}
                  onChange={(e) => setGenreName(e.target.value)}
                  type="text"
                  required
                  placeholder="Ví dụ: Hành động, Viễn tưởng..."
                  className="rounded border border-gray-700 bg-white px-3 py-2 text-gray-600 text-sm outline-none focus:border-blue-500"
                />
              </div>
              {err && <span className="error">{err}</span>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  className="flex-1 rounded border border-gray-600 py-2 text-sm hover:bg-gray-800"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded bg-blue-600 py-2 text-sm font-medium hover:bg-blue-700"
                >
                  {isEdit ? "Cập nhật" : "Thêm ngay"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </section>
      <div className="w-[450px] m-auto">
        <Pagination totalPages={genresWithQueryString.totalPages} />
      </div>
      <ConfirmDialog
        ref={confirmDialog}
        content="Bạn có muốn xóa thể loại này không ?"
        handleClick={handleDeleteGenre}
      />
      <Footer />
    </>
  );
}

import { useContext, useEffect } from "react";
import AppContext from "../components/AppContext";
import AdminNavBar from "../components/AdminNavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { api } from "../../App";
import { toast } from "react-toastify";
export default function QuanLyBinhLuan() {
  const { isLoading, isLogin, refresh, setRefresh, me, comments } =
    useContext(AppContext);
  const navigate = useNavigate();
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
  const handleToggleBanned = (value) => {
    const isBanned = value.isBanned ? false : true;
    fetch(`${api}/admin/comment?id=${value._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isBanned: isBanned }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
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
      <div className="bg-slate-900 p-6 rounded-lg shadow-lg text-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-white border-b border-slate-700 pb-4">
          Quản lý bình luận
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-semibold">Người dùng</th>
                <th className="px-4 py-3 font-semibold text-center">Phim</th>
                <th className="px-4 py-3 font-semibold">Nội dung</th>
                <th className="px-4 py-3 font-semibold text-center">
                  Lượt thích
                </th>
                <th className="px-4 py-3 font-semibold">Thời gian</th>
                <th className="px-4 py-3 font-semibold text-right">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {comments?.docs?.map((value) => (
                <tr
                  key={value._id}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={value.userId.avatar}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
                        alt="avatar"
                      />
                      <span className="font-medium text-slate-100">
                        {value.username}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <img
                        src={value.movieId.poster}
                        className="w-10 h-14 rounded object-cover shadow-md"
                        alt="poster"
                      />
                      <span className="text-[10px] text-slate-400 text-center max-w-[80px] line-clamp-1">
                        {value.movieId.title}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 max-w-xs">
                    <p className="text-sm text-slate-300 line-clamp-2 italic">
                      "{value.comment}"
                    </p>
                  </td>

                  <td className="px-4 py-4 text-center font-mono text-orange-400">
                    {value.likes.length}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-500">
                    {new Date(value.updatedAt).toLocaleDateString("vi-VN")}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleBanned(value)}
                        className={`px-3 py-1 text-xs font-medium border rounded transition-all hover:cursor-pointer ${
                          value.isBanned
                            ? "text-emerald-400 border-emerald-400/50 hover:bg-emerald-400 hover:text-slate-900" // Trạng thái đang Banned -> "Hiện" (Màu xanh khôi phục)
                            : "text-rose-400 border-rose-400/50 hover:bg-rose-400 hover:text-slate-900" // Trạng thái bình thường -> "Ẩn" (Màu đỏ cảnh báo)
                        }`}
                      >
                        {value.isBanned ? "Hiện" : "Ẩn"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}

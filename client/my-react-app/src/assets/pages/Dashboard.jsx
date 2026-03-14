import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../components/AppContext";
import AdminNavBar from "../components/AdminNavBar";
import Footer from "../components/Footer";
import DailyRevenue from "../components/Chart";
import { api } from "../../App";
import fetchApi from "../service/api";

export default function Dashboard() {
  const { isLogin, isLoading, me, movies, genres, users } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const genre = searchParams.get("genre");
  const params = new URLSearchParams(searchParams);
  const [viewLogs, setViewLog] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [text, setText] = useState("");
  let stt = 0;
  const totalView = () => {
    let sum = 0;
    movies?.docs?.forEach((value) => {
      sum = sum + value.view;
    });
    return sum;
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    if (!isLoading) {
      if (!isLogin || me?.role !== "admin") {
        navigate("/");
        return;
      }
    }
  }, [isLoading, isLogin, me, navigate]);
  useEffect(() => {
    const params = new URLSearchParams();
    if (genre) {
      const item = genres?.docs?.find(
        (value) => encodeURIComponent(value.name) === genre
      );
      if (item) {
        params.append("genre", item._id);
        setText(`Biểu đồ lượt xem các phim thuộc thể loại ${item.name}`);
      }
    } else {
      params.append("date", new Date().toLocaleDateString());
      setText("Biểu đồ lượt xem các phim theo ngày");
    }
    fetchApi({
      url: `${api}/view_log?${params.toString()}`,
      setData: setViewLog,
    });
  }, [genre, genres]);
  useEffect(() => {
    fetchApi({
      url: `${api}/movie?sortBy=view&orderBy=desc&_limit=10`,
      setData: setTopMovies,
    });
  }, []);
  const handleSelectGenre = (genre) => {
    if (genre !== "") {
      params.set("genre", encodeURIComponent(genre));
    } else {
      params.delete("genre");
    }
    navigate(`?${params.toString()}`);
  };
  return (
    <>
      <AdminNavBar />
      <div className="p-6 bg-[#0f172a] text-slate-200">
        <h2 className="text-2xl font-bold mb-8 text-white border-l-4 border-blue-500 pl-4">
          Trang quản trị
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:border-blue-500 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Tổng số phim
                </p>
                <h3 className="text-3xl font-bold mt-1 group-hover:text-blue-400 transition-colors">
                  {movies?.docs?.length || 0}
                </h3>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:border-purple-500 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Tổng thể loại
                </p>
                <h3 className="text-3xl font-bold mt-1 group-hover:text-purple-400 transition-colors">
                  {genres?.docs?.length || 0}
                </h3>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:border-emerald-500 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Tổng lượt xem
                </p>
                <h3 className="text-3xl font-bold mt-1 group-hover:text-emerald-400 transition-colors">
                  {totalView()?.toLocaleString() || 0}
                </h3>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <svg
                  className="w-6 h-6 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl hover:border-orange-500 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                  Tổng người dùng
                </p>
                <h3 className="text-3xl font-bold mt-1 group-hover:text-orange-400 transition-colors">
                  {users?.docs?.length || 0}
                </h3>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#0f172a]">
        <select
          onChange={(e) => handleSelectGenre(e.target.value)}
          className="block mx-6 w-64 px-4 py-2.5 text-sm transition-all duration-200 border rounded-lg cursor-pointer
    bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500
    dark:bg-gray-800 dark:border-gray-600 dark:text-white 
    outline-none focus:ring-2"
        >
          <option value="" className="dark:bg-gray-800">
            Chọn thể loại
          </option>
          {genres?.docs?.map((value) => (
            <option
              key={value._id}
              value={value.name}
              className="dark:bg-gray-800"
            >
              {value.name}
            </option>
          ))}
        </select>
      </div>
      <DailyRevenue view_logs={viewLogs} text={text} />
      <div className="p-4 bg-gray-900 text-gray-100 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-blue-400 flex items-center gap-2">
          <span className="p-2 bg-blue-500/10 rounded-lg">🔥</span>
          Top 10 phim có lượt xem cao nhất
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 uppercase text-sm tracking-wider">
                <th className="px-4 py-4 font-medium">Stt</th>
                <th className="px-4 py-4 font-medium">Thông tin phim</th>
                <th className="px-4 py-4 font-medium">Thể loại</th>
                <th className="px-4 py-4 font-medium text-right">Lượt xem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {topMovies?.docs?.map((value, index) => (
                <tr
                  key={value._id}
                  className="hover:bg-gray-800/50 transition-colors group"
                >
                  <td className="px-4 py-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-sm font-bold group-hover:bg-blue-600 transition-colors">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-4">
                      <img
                        src={value.poster}
                        alt={value.title}
                        className="w-16 h-24 object-cover rounded-md shadow-md border border-gray-700"
                      />
                      <div className="flex flex-col justify-center">
                        <h4 className="font-bold text-gray-100 group-hover:text-blue-400 transition-colors">
                          {value.title}
                        </h4>
                        <div className="text-sm text-gray-400 mt-1 space-y-0.5">
                          <p>
                            {value.year} • {value.duration}
                          </p>
                          <p className="text-xs italic">
                            Đạo diễn: {value.director}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {value.genre?.map((g, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-[10px] font-medium bg-gray-800 text-gray-300 rounded border border-gray-700"
                        >
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-mono font-semibold text-orange-400">
                      {value.view?.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

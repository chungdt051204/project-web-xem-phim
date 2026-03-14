import { useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import AppContext from "./AppContext";
import { toast } from "react-toastify";

export default function AdminNavBar() {
  const navigate = useNavigate();
  const { isLogin, setIsLogin, me } = useContext(AppContext);
  const [clicked, setClicked] = useState(false);

  //Chức năng đăng xuất
  const handleClick = () => {
    localStorage.removeItem("token");
    setIsLogin(false);
    toast.success("Đăng xuất thành công");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  return (
    <>
      <section className="antialiased font-sans">
        <nav
          className="h-16 flex items-center justify-between px-8 text-white shadow-lg sticky top-0 z-50"
          style={{ backgroundColor: "#1a1d21" }}
        >
          <div className="flex items-center gap-2 text-xl font-bold tracking-wider">
            <Link to="" className="hover:text-blue-400 transition-colors">
              🎬 <span className="hidden md:inline">StudentMovie</span>
            </Link>
          </div>
          <ul className="flex items-center gap-8 text-sm font-medium uppercase tracking-tight">
            <li className="hover:text-blue-400 transition-colors">
              <Link to="/admin/dashboard" className="flex items-center gap-2">
                <i className="fa-solid fa-house"></i> Dashboard
              </Link>
            </li>
            <Link to="/admin/genre">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">
                Thể loại
              </li>
            </Link>
            <Link to="/admin/movie">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">
                Phim
              </li>
            </Link>
            <Link to="/admin/user">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">
                Người dùng
              </li>
            </Link>
            <Link to="/admin/comment">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">
                Bình luận
              </li>
            </Link>
          </ul>
          <div className="relative">
            {isLogin ? (
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setClicked((prev) => !prev)}
              >
                <img
                  className="w-10 h-10 object-cover border-2 border-gray-600 rounded-full group-hover:border-blue-500 transition-all"
                  src={me?.avatar}
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                />
                <i
                  className={`fa-solid fa-angle-down text-xs transition-transform ${
                    clicked ? "rotate-180" : ""
                  }`}
                ></i>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md text-sm transition-all">
                  Đăng nhập
                </button>
              </Link>
            )}
            {isLogin && clicked && (
              <div className="absolute right-0 mt-3 w-56 bg-[#252a30] border border-gray-700 rounded-lg shadow-2xl py-2 flex flex-col">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-xs text-gray-400">Xin chào,</p>
                  <p className="text-sm font-bold truncate">
                    {me?.name || "Admin"}
                  </p>
                </div>
                <Link
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 text-sm transition-colors"
                  to="/user/info"
                  onClick={() => setClicked(false)}
                >
                  <i className="fa-solid fa-user text-gray-400 w-4"></i>
                  Thông tin tài khoản
                </Link>
                <button
                  className="flex items-center gap-3 px-4 py-3 hover:bg-red-900/30 text-red-400 text-sm transition-colors text-left"
                  onClick={handleClick}
                >
                  <i className="fa-solid fa-right-from-bracket w-4"></i>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </nav>
      </section>
    </>
  );
}

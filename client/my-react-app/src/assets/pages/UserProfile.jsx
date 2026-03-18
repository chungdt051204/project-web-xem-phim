import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../components/AppContext";
import { api } from "../../App";
import { toast } from "react-toastify";
import UserNavBar from "../components/UserNavBar";
import Footer from "../components/Footer";

export default function UserProfile() {
  const navigate = useNavigate();
  const { isLoading, isLogin, me } = useContext(AppContext);
  const fullName = useRef();
  const password = useRef();
  const avatar = useRef();
  const [isClicked, setIsClicked] = useState(false);
  const [err, setErr] = useState("");
  const d = new Date(me?.createdAt);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    if (!isLoading) {
      if (!isLogin) {
        navigate("/");
        return;
      }
    }
  }, [isLoading, isLogin, me, navigate]);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.current?.value && password.current.value.length < 8) {
      setErr("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }
    if (password.current?.value === me.password) {
      setErr("Mật khẩu mới không được trùng với mật khẩu cũ");
      return;
    }
    const formData = new FormData();
    formData.append(
      "fullName",
      fullName.current?.value ? fullName.current.value : me?.fullName
    );
    formData.append(
      "password",
      password.current?.value === "" ? me?.password : password.current?.value
    );
    formData.append(
      "avatar",
      avatar.current.files[0] ? avatar.current.files[0] : me?.avatar
    );
    fetch(`${api}/update?user_id=${me._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(({ message }) => {
        toast.success(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch(async (err) => {
        const { message } = await err.json();
        console.log(message);
      });
  };
  return (
    <section className="min-h-screen bg-[#0f1416] text-slate-200 pb-10">
      <UserNavBar isClicked={isClicked} setIsClicked={setIsClicked} />

      <div className="max-w-4xl mx-auto px-4 mt-10">
        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight border-b border-slate-800 pb-4">
          THÔNG TIN TÀI KHOẢN
        </h2>

        <div className="bg-[#1a2226] rounded-xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col md:flex-row shadow-cyan-900/10">
          {/* Cột trái: Avatar & Join Date */}
          <div className="md:w-1/3 bg-[#263238] p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-700">
            <div className="relative group">
              <img
                src={me?.avatar}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className="w-32 h-44 object-cover rounded-lg border-2 border-cyan-500/30 group-hover:border-cyan-400 transition-all duration-300 shadow-lg"
              />
              <div className="absolute inset-0 rounded-lg bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                Thành viên từ
              </p>
              <p className="text-cyan-400 font-medium mt-1">
                {`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`}
              </p>
            </div>
          </div>

          {/* Cột phải: Form thông tin */}
          <form
            className="flex-1 p-8 flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Họ tên */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300 ml-1">
                  Họ tên
                </label>
                <input
                  type="text"
                  ref={fullName}
                  defaultValue={me?.fullName ?? ""}
                  className="bg-[#0f1416] border border-slate-700 rounded-lg px-4 py-2.5 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                  autoComplete="off"
                />
              </div>

              {/* Tên đăng nhập */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-400 ml-1">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={me?.username ?? ""}
                  disabled
                  className="bg-[#0f1416]/50 border border-slate-800 text-slate-500 rounded-lg px-4 py-2.5 cursor-not-allowed italic"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-400 ml-1">
                Email liên kết
              </label>
              <input
                type="text"
                value={me?.email ?? ""}
                disabled
                className="bg-[#0f1416]/50 border border-slate-800 text-slate-500 rounded-lg px-4 py-2.5 cursor-not-allowed italic"
              />
            </div>

            {/* Mật khẩu */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300 ml-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                ref={password}
                placeholder="Để trống nếu không đổi"
                className="bg-[#0f1416] border border-slate-700 rounded-lg px-4 py-2.5 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all placeholder:text-slate-600"
                autoComplete="new-password"
              />
            </div>

            {/* File upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300 ml-1">
                Đổi ảnh đại diện
              </label>
              <input
                type="file"
                ref={avatar}
                className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer"
              />
            </div>

            {err && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2">
                <span className="font-bold">⚠️</span> {err}
              </div>
            )}

            <button className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-cyan-900/20">
              CẬP NHẬT THÔNG TIN
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </section>
  );
}

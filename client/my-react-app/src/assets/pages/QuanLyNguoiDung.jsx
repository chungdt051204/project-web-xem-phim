import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../components/AppContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import fetchApi from "../service/api";
import { toast } from "react-toastify";
import { api } from "../../App";
import ConfirmDialog from "../components/ConfirmDialog";
import AdminNavBar from "../components/AdminNavBar";
import Footer from "../components/Footer";

export default function QuanLyNguoiDung() {
  const { refresh, setRefresh, isLoading, isLogin, me, users, setUsers } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const role = searchParams.get("role");
  const id = searchParams.get("id");
  const [userWithId, setUserWithId] = useState("");
  const [formUser, setFormUser] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    gender: "chưa chọn",
    dateOfBirth: "",
    avatar: "",
    status: "active",
    loginMethod: "Email thường",
  });
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
    const params = new URLSearchParams();
    if (role) params.append("role", role);
    fetchApi({
      url: `${api}/user?${params.toString()}`,
      setData: setUsers,
    });
  }, [role, setUsers, refresh]);
  useEffect(() => {
    if (id) {
      fetchApi({
        url: `${api}/user?id=${id}`,
        setData: setUserWithId,
      });
    } else {
      setFormUser({
        fullname: "",
        username: "",
        email: "",
        password: "",
        phone: "",
        role: "user",
        gender: "chưa chọn",
        dateOfBirth: "",
        avatar: "",
        status: "Đang hoạt động",
        loginMethod: "Email thường",
      });
      formDialog.current.close();
    }
  }, [id]);
  useEffect(() => {
    if (userWithId && id) {
      setFormUser({
        fullname: userWithId?.fullName,
        username: userWithId?.username,
        email: userWithId?.email,
        password: userWithId?.password ?? "",
        phone: userWithId?.phone ?? "",
        role: userWithId?.role,
        gender: userWithId?.gender,
        dateOfBirth: userWithId?.dateOfBirth ?? "",
        avatar: userWithId?.avatar,
        status: userWithId?.isActive ? "Đang hoạt động" : "Vô hiệu hóa",
        loginMethod: userWithId?.loginMethod,
        isVerified: userWithId?.isVerified,
      });
      formDialog.current.showModal();
    }
  }, [userWithId, id]);
  const handleRoleSelected = (value) => {
    if (value === "") params.delete("role");
    else params.set("role", value);
    navigate(`?${params.toString()}`);
  };
  const handleOpenDialog = (id) => {
    params.set("id", id);
    navigate(`?${params.toString()}`);
    formDialog.current.showModal();
  };
  const handleOpenConfirmDialog = (id) => {
    fetchApi({
      url: `${api}/user?id=${id}`,
      setData: setUserWithId,
    });
    confirmDialog.current.showModal();
  };
  const handleChangeStatus = () => {
    const status = userWithId?.isActive ? "inactive" : "active";
    fetch(`${api}/admin/user?id=${userWithId._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status }),
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
  return (
    <>
      <AdminNavBar />
      <div className="p-6 bg-zinc-950 min-h-screen text-zinc-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Quản lý người dùng
          </h2>

          <select
            onChange={(e) => handleRoleSelected(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-zinc-600 transition-all cursor-pointer"
          >
            <option value="">Tất cả vai trò</option>
            <option value="user">Người dùng (User)</option>
            <option value="admin">Quản trị viên (Admin)</option>
          </select>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-900/80 text-zinc-400 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Người dùng</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {users?.docs?.map((value) => (
                <tr
                  key={value._id}
                  className="hover:bg-zinc-800/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={value.avatar}
                        alt=""
                        className="w-9 h-9 rounded-full ring-1 ring-zinc-700 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-medium text-zinc-200">
                        {value.fullname}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{value.email}</td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-zinc-500">
                      {value.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          value.isActive ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      ></span>
                      <span
                        className={
                          value.isActive ? "text-emerald-500" : "text-red-500"
                        }
                      >
                        {value.isActive ? "Hoạt động" : "Bị khóa"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleOpenDialog(value._id)}
                        className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800/50 border border-zinc-700 
               rounded-md hover:bg-zinc-700 hover:text-white transition-all active:scale-95"
                      >
                        Chi tiết
                      </button>
                      {value.role === "user" && (
                        <button
                          onClick={() => handleOpenConfirmDialog(value._id)}
                          className={`px-3 py-1.5 text-xs font-medium border rounded-md transition-all active:scale-95 ${
                            value.isActive
                              ? "border-red-900/50 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:border-red-800"
                              : "border-emerald-900/50 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40 hover:border-emerald-800"
                          }`}
                        >
                          {value.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <dialog
        ref={formDialog}
        className="m-auto rounded-2xl border border-zinc-800 p-0 bg-zinc-900 text-zinc-100 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <form className="w-[550px] max-w-full flex flex-col overflow-hidden">
          <div className="flex items-center gap-5 p-6 bg-zinc-800/50 border-b border-zinc-800">
            <img
              src={formUser.avatar}
              alt="Avatar"
              className="w-20 h-24 object-cover rounded-lg border border-zinc-700 shadow-md"
            />
            <div>
              <h3 className="text-xl font-bold text-white">
                {formUser.fullname}
              </h3>
            </div>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            {[
              {
                id: "fullname",
                label: "Họ và tên",
                value: formUser.fullname,
                type: "text",
              },
              {
                id: "username",
                label: "Tên đăng nhập",
                value: formUser.username,
                type: "text",
              },
              {
                id: "email",
                label: "Email",
                value: formUser.email,
                type: "text",
              },
              {
                id: "password",
                label: "Password",
                value: formUser.password,
                type: "password",
              },
              {
                id: "phone",
                label: "Phone",
                value: formUser.phone,
                type: "text",
              },
              {
                id: "role",
                label: "Vai trò",
                value: formUser.role,
                type: "text",
              },
              {
                id: "gender",
                label: "Giới tính",
                value: formUser.gender,
                type: "text",
              },
              {
                id: "dateOfBirth",
                label: "Ngày sinh",
                value:
                  formUser.dateOfBirth &&
                  new Date(formUser.dateOfBirth).toLocaleDateString(),
                type: "text",
              },
              {
                id: "status",
                label: "Trạng thái",
                value: formUser.status,
                type: "text",
              },
              {
                id: "loginMethod",
                label: "Phương thức đăng nhập",
                value: formUser.loginMethod,
                type: "text",
              },
            ].map((item) => (
              <div key={item.id} className="flex flex-col gap-1.5">
                <label
                  htmlFor={item.id}
                  className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider"
                >
                  {item.label}:
                </label>
                <input
                  id={item.id}
                  type={item.type}
                  readOnly
                  value={item.value || ""}
                  className="bg-zinc-800/50 border border-zinc-700 text-zinc-200 text-sm rounded-md px-3 py-2 outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="p-4 bg-zinc-800/30 border-t border-zinc-800 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSearchParams((prev) => {
                  const newParams = new URLSearchParams(prev);
                  if (newParams.has("id")) newParams.delete("id");
                  return newParams;
                });
                formDialog.current.close();
              }}
              className="px-6 py-2 bg-zinc-100 hover:bg-white text-zinc-900 font-bold text-sm rounded-lg transition-all active:scale-95"
            >
              Thoát
            </button>
          </div>
        </form>
      </dialog>
      <ConfirmDialog
        ref={confirmDialog}
        content="Bạn có muốn thay đổi trạng thái người dùng này không ?"
        handleClick={handleChangeStatus}
      />
      <Footer />
    </>
  );
}

import { useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import AppContext from "./AppContext";
import { baseApi } from "./Register";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function UserProfile() {
  const { me } = useContext(AppContext);
  const fullName = useRef();
  const password = useRef();
  const avatar = useRef();
  const [isClicked, setIsClicked] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const d = new Date(me?.createdAt);
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
    fetch(`${baseApi}/update`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(({ message }) => {
        navigate("/");
        alert(message);
      })
      .catch();
  };
  return (
    <section>
      <NavBar isClicked={isClicked} setIsClicked={setIsClicked} />
      <div
        className="w-[1150px] p-[20px] mt-[30px] mx-auto"
        style={{ backgroundColor: "rgba(15, 20, 22, 1)" }}
      >
        <h2 className="text-[20px] font-bold">THÔNG TIN TÀI KHOẢN</h2>
        <div
          className="flex gap-[50px] w-[520px] mt-[10px] p-[20px] rounded-[4px]"
          style={{ backgroundColor: "rgba(38, 50, 56, 1)" }}
        >
          <div className="flex flex-col gap-[5px]">
            <img
              src={me?.avatar}
              alt=""
              referrerPolicy="no-referrer"
              width={150}
              height={200}
            />
            <h3 className="text-white">
              Tham gia:
              {d.getDate() +
                "/" +
                Number(d.getMonth() + 1) +
                "/" +
                d.getFullYear()}
            </h3>
          </div>
          <form className="flex flex-col gap-[5px]" onSubmit={handleSubmit}>
            <label htmlFor="Username">Họ tên:</label>
            <input
              type="text"
              ref={fullName}
              defaultValue={me?.fullName ?? ""}
              autoComplete="off"
            />
            <label htmlFor="Username">Tên đăng nhập:</label>
            <input type="text" value={me?.username ?? ""} disabled={true} />
            <label htmlFor="Email">Email:</label>
            <input type="text" value={me?.email ?? ""} disabled={true} />
            <label htmlFor="Password">Mật khẩu:</label>
            <input
              className="text-[14px]"
              type="password"
              ref={password}
              placeholder="Bỏ trống nếu không muốn đổi"
              autoComplete="new-password"
            />
            {err && <strong className="error">{err}</strong>}
            <label htmlFor="Avatar">Ảnh đại diện:</label>
            <input type="file" ref={avatar} />
            <button className="btn-form">Cập nhật</button>
          </form>
        </div>
      </div>
      <Footer />
    </section>
  );
}

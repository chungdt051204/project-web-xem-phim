import { useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import AppContext from "./AppContext";
import { baseApi } from "./Register";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function User() {
  const { me } = useContext(AppContext);
  const setPassword = useRef();
  const linkFile = useRef();
  const [isClicked, setIsClicked] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const d = new Date(me?.createdAt);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (setPassword.current.value && setPassword.current.value.length < 8) {
      setErr("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }
    if (setPassword.current.value === me?.password) {
      setErr("Mật khẩu mới không được trùng với mật khẩu cũ");
      return;
    }
    const formData = new FormData();
    formData.append(
      "password",
      setPassword.current.value === ""
        ? me?.password
        : setPassword.current.value
    );
    formData.append("file", linkFile.current.files[0]);
    fetch(`${baseApi}/update/user`, {
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
              src={
                me?.avatar?.includes("https")
                  ? me?.avatar
                  : `${baseApi}/images/${me?.avatar}`
              }
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
            <label htmlFor="Username">Username:</label>
            <input type="text" value={me?.name} readOnly />
            <label htmlFor="Email">Email:</label>
            <input type="email" value={me?.email} readOnly />
            <label htmlFor="Password">Password:</label>
            <input
              className="text-[14px]"
              type="text"
              ref={setPassword}
              placeholder="Bỏ trống nếu không muốn đổi"
            />
            {err && <strong className="error">{err}</strong>}
            <label htmlFor="Avatar">Avatar:</label>
            <input type="file" ref={linkFile} />
            <button className="btn-form">Cập nhật</button>
          </form>
        </div>
      </div>
      <Footer />
    </section>
  );
}

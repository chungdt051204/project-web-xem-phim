import { useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import AppContext from "./AppContext";
import { baseApi } from "./Register";
import NavBar from "./NavBar";
import "./FormManagement.css";
export default function User() {
  const { username, email, password, avatar, createdAt } =
    useContext(AppContext);
  const setPassword = useRef();
  const linkFile = useRef();
  const [isClicked, setIsClicked] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const d = new Date(createdAt);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (setPassword.current.value && setPassword.current.value.length < 8) {
      setErr("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }
    if (setPassword.current.value === password) {
      setErr("Mật khẩu mới không được trùng với mật khẩu cũ");
      return;
    }
    const formData = new FormData();
    formData.append(
      "password",
      setPassword.current.value === "" ? password : setPassword.current.value
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
    <>
      <NavBar isClicked={isClicked} setIsClicked={setIsClicked} />
      <section className="form-management-container">
        <h2>THÔNG TIN TÀI KHOẢN</h2>
        <div className="form-management">
          <div>
            <img
              src={`${baseApi}/images/${avatar}`}
              alt=""
              width={150}
              height={200}
            />
            <h3>
              Tham gia:
              {d.getDate() +
                "/" +
                Number(d.getMonth() + 1) +
                "/" +
                d.getFullYear()}
            </h3>
          </div>
          <form className="form-management-info" onSubmit={handleSubmit}>
            <label htmlFor="Username">Username:</label>
            <input type="text" value={username} readOnly />
            <label htmlFor="Email">Email:</label>
            <input type="email" value={email} readOnly />
            <label htmlFor="Password">Password:</label>
            <input
              type="text"
              ref={setPassword}
              placeholder="Bỏ trống nếu không muốn đổi"
            />
            {err && <strong className="error">{err}</strong>}
            <label htmlFor="Avatar">Avatar:</label>
            <input type="file" ref={linkFile} />
            <button>Cập nhật</button>
          </form>
        </div>
      </section>
    </>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useContext } from "react";
import AppContext from "./AppContext";
import { baseApi } from "./Register";
import "./Auth.css";
export default function Login() {
  const navigate = useNavigate();
  const { setIsLogin, setIsAdmin, setAvatar } = useContext(AppContext);
  const [usernameInvalid, setUsernameInvalid] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState("");
  const [loginInvalid, setLoginInvalid] = useState("");
  const nameRef = useRef();
  const passwordRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameRef.current.value === "") {
      setUsernameInvalid("Tên đăng nhập không được bỏ trống");
      //Dừng lại luôn không chạy lệnh fetch
      return;
    }
    if (passwordRef.current.value === "") {
      setPasswordInvalid("Mật khẩu không được bỏ trống");
      return;
    }
    fetch(`${baseApi}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: nameRef.current.value,
        password: passwordRef.current.value,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        console.log(data);
        navigate("/");
        setIsLogin(true);
        setIsAdmin(data.isAdmin);
        setAvatar(data.avatar);
      })
      .catch((err) => {
        if (err.status === 401) {
          return setLoginInvalid("Sai thông tin đăng nhập");
        }
      });
  };
  return (
    <section className="auth">
      <div className="form-auth">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Tên đăng nhập:</label>
          <input
            type="text"
            id="name"
            name="name"
            ref={nameRef}
            onChange={() => {
              setUsernameInvalid("");
            }}
            placeholder="Username"
            autoComplete="off"
          />
          {usernameInvalid && (
            <strong className="error">{usernameInvalid}</strong>
          )}
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            name="password"
            ref={passwordRef}
            onChange={() => {
              setPasswordInvalid("");
            }}
            placeholder="Password"
            autoComplete="new-password"
          />
          {passwordInvalid ? (
            <strong className="error">{passwordInvalid}</strong>
          ) : (
            loginInvalid && <strong className="error">{loginInvalid}</strong>
          )}
          <button className="btn-form">Đăng nhập</button>
        </form>
        <p>
          Chưa có tài khoản?
          <strong>
            <Link to="/register">Đăng ký ngay</Link>
          </strong>
        </p>
      </div>
    </section>
  );
}

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
export const baseApi = "http://localhost:3000";
import "./Auth.css";
export default function Register() {
  const navigate = useNavigate();
  const [usernameInvalid, setUsernameInvalid] = useState("");
  const [emailInvalid, setEmailInvalid] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState("");
  const [verifyPasswordInvalid, setVerifyPasswordInvalid] = useState("");
  const [avatarInvalid, setAvatarInvalid] = useState("");
  const [registerInvalid, setRegisterInvalid] = useState("");
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const verifyPasswordRef = useRef();
  const linkFile = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameRef.current.value.trim().length < 5) {
      setUsernameInvalid("Tên đăng nhập phải có tối thiểu 5 ký tự ");
      //Dừng lại luôn không chạy lệnh fetch
      return;
    }
    if (emailRef.current.value === "") {
      setEmailInvalid("Email không được bỏ trống");
      return;
    }
    if (passwordRef.current.value.length < 8) {
      setPasswordInvalid("Mật khẩu phải có tối thiểu 8 ký tự");
      return;
    }
    if (verifyPasswordRef.current.value === "") {
      setVerifyPasswordInvalid("Vui lòng xác nhận mật khẩu");
      return;
    }
    if (verifyPasswordRef.current.value !== passwordRef.current.value) {
      setVerifyPasswordInvalid("Mật khẩu không khớp");
      return;
    }
    if (!linkFile.current.files[0]) {
      setAvatarInvalid("Vui lòng chọn tệp ");
      return;
    }
    const formData = new FormData();
    formData.append("name", nameRef.current.value);
    formData.append("email", emailRef.current.value);
    formData.append("password", passwordRef.current.value);
    formData.append("file", linkFile.current.files[0]);
    fetch(`${baseApi}/register`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(({ message }) => {
        console.log(message);
        navigate("/");
      })
      .catch(async (err) => {
        if (err.status === 400) {
          //Lấy message gửi từ phía backend
          const { message } = await err.json();
          setRegisterInvalid(message);
        }
      });
  };
  return (
    <section className="auth">
      <div className="form-auth">
        <h2>Đăng ký</h2>
        <form className="form-register" onSubmit={handleSubmit}>
          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            type="text"
            id="name"
            name="name"
            ref={nameRef}
            onChange={() => setUsernameInvalid("")}
            placeholder="Username"
            autoComplete="off"
          />
          {usernameInvalid && (
            <strong className="error">{usernameInvalid}</strong>
          )}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            ref={emailRef}
            onChange={() => setEmailInvalid("")}
            placeholder="Email"
            autoComplete="off"
          />
          {emailInvalid && <strong className="error">{emailInvalid}</strong>}
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            name="password"
            ref={passwordRef}
            onChange={() => setPasswordInvalid("")}
            placeholder="Password"
            autoComplete="new-password"
          />
          {passwordInvalid && (
            <strong className="error">{passwordInvalid}</strong>
          )}
          <label htmlFor="verifyPassword">Nhập lại mật khẩu:</label>
          <input
            type="password"
            id="verify-password"
            name="verify-password"
            ref={verifyPasswordRef}
            onChange={() => setVerifyPasswordInvalid("")}
            autoComplete="new-password"
          />
          {verifyPasswordInvalid && (
            <strong className="error">{verifyPasswordInvalid}</strong>
          )}
          <label htmlFor="avatar">Avatar:</label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            ref={linkFile}
            onChange={() => setAvatarInvalid("")}
          />
          {avatarInvalid ? (
            <strong className="error">{avatarInvalid}</strong>
          ) : (
            registerInvalid && (
              <strong className="error">{registerInvalid}</strong>
            )
          )}
          <button className="btn-form">Đăng ký</button>
        </form>
      </div>
    </section>
  );
}

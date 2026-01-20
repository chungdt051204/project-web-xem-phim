import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import AppContext from "./AppContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { baseApi } from "./Register";
import { url } from "../../App";
import LoginGoogle from "./LoginGoogle";

const loginSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được bỏ trống"),
  password: z.string().min(1, "Mật khẩu không được bỏ trống"),
});
export default function Login() {
  const navigate = useNavigate();
  const { setIsLogin, setMe } = useContext(AppContext);
  const [errorLogin, setErrorLogin] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = (data) => {
    fetch(`${url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data?.username,
        password: data?.password,
      }),
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message, result }) => {
        setIsLogin(true);
        setMe(result);
        alert(message);
        navigate("/");
      })
      .catch(async (err) => {
        if (err.status === 401) {
          const { message } = await err.json();
          setErrorLogin(message);
        }
      });
  };

  return (
    <section className="form-auth-container">
      <div className="form-auth">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="name">Tên đăng nhập:</label>
          <input
            {...register("username")}
            type="text"
            onChange={() => {
              setErrorLogin("");
            }}
            placeholder="Username"
            autoComplete="off"
          />
          <strong className="error">{errors?.username?.message}</strong>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            {...register("password")}
            type="password"
            onChange={() => {
              setErrorLogin("");
            }}
            placeholder="Password"
            autoComplete="new-password"
          />
          <strong className="error">{errors?.password?.message}</strong>
          <strong className="error">{errorLogin ? errorLogin : ""}</strong>
          <button className="btn-form">Đăng nhập</button>
        </form>
        <LoginGoogle />
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

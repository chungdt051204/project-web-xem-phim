import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import AppContext from "../components/AppContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { api } from "../../App";
import LoginGoogle from "../components/LoginGoogle";

const loginSchema = z.object({
  input: z.string().min(1, "Tên đăng nhập hoặc email không được bỏ trống"),
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
      input: "",
      password: "",
    },
  });
  const onSubmit = (data) => {
    fetch(`${api}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: data?.input,
        password: data?.password,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message, result, token }) => {
        localStorage.setItem("token", token);
        setIsLogin(true);
        setMe(result);
        toast.success(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
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
          <label htmlFor="input">Tên đăng nhập/Email:</label>
          <input
            {...register("input")}
            type="text"
            onChange={() => {
              setErrorLogin("");
            }}
            placeholder="Username/Email"
            autoComplete="off"
          />
          <strong className="error">{errors?.input?.message}</strong>
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

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { date, z } from "zod";
import { useState } from "react";
export const baseApi = "http://localhost:3000";
//Tạo schema bằng Zod
const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Vui lòng nhập họ tên"),
    username: z
      .string()
      .trim()
      .min(5, "Tên đăng nhập phải có tối thiểu 5 ký tự"),
    email: z.string().trim().email("Email không đúng định dạng"),
    password: z.string().min(8, "Mật khẩu phải có tối thiểu 8 ký tự"),
    verifyPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
    phone: z
      .string()
      .regex(
        /^(0)\d{9}$/,
        "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0"
      ),
    dateOfBirth: z.coerce.date(),
    gender: z.enum(["Nam", "Nữ"]),
    avatar: z.any().refine((files) => files?.length > 0, "Vui lòng chọn file"),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "Mật khẩu không khớp",
    path: ["verifyPassword"], //Báo lỗi tại vị trí của verifyPassword
  });
export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  //Kết nối React Hook Form với Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      verifyPassword: "",
      phone: "",
    },
  });
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("phone", data.phone);
    formData.append("dateOfBirth", new Date(data.dateOfBirth).toISOString());
    formData.append("gender", data.gender);
    formData.append("avatar", data.avatar[0]);
    fetch(`${baseApi}/register`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw res;
      })
      .then(({ message }) => {
        alert(message);
        navigate("/login");
      })
      .catch(async (err) => {
        if (err.status === 400) {
          const { message } = await err.json();
          setError(message);
        }
      });
  };
  return (
    <section className="form-auth-container">
      <div className="form-auth">
        <h2>Đăng ký</h2>
        <form className="form-register" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="fullName">Họ tên:</label>
          <input
            {...register("fullName")}
            type="text"
            placeholder="Fullname"
            autoComplete="off"
          />
          <strong className="error">{errors?.fullName?.message}</strong>
          <label htmlFor="username">Tên đăng nhập:</label>
          <input
            {...register("username")}
            type="text"
            placeholder="Username"
            autoComplete="off"
          />
          <strong className="error">{errors?.username?.message}</strong>
          <label htmlFor="email">Email:</label>
          <input
            {...register("email")}
            type="text"
            placeholder="Email"
            autoComplete="off"
          />
          <strong className="error">{errors?.email?.message}</strong>
          <strong className="error">{error && error}</strong>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            autoComplete="new-password"
          />
          <strong className="error">{errors?.password?.message}</strong>
          <label htmlFor="verifyPassword">Nhập lại mật khẩu:</label>
          <input
            {...register("verifyPassword")}
            type="password"
            autoComplete="new-password"
          />
          <strong className="error">{errors?.verifyPassword?.message}</strong>
          <label htmlFor="phone">Số điện thoại:</label>
          <input
            {...register("phone")}
            type="text"
            placeholder="Phone"
            autoComplete="new-password"
          />
          <strong className="error">{errors?.phone?.message}</strong>
          <label htmlFor="dateOfBirth">Ngày sinh:</label>
          <input {...register("dateOfBirth")} type="date" />
          <strong className="error">{errors?.dateOfBirth?.message}</strong>
          <label htmlFor="phone">Giới tính:</label>
          <div className="flex gap-2">
            <div className="flex gap-1 text-white">
              <input {...register("gender")} type="radio" value="Nam" />
              Nam
            </div>
            <div className="flex gap-1 text-white">
              <input {...register("gender")} type="radio" value="Nữ" />
              Nữ
            </div>
          </div>
          <strong className="error">{errors?.gender?.message}</strong>
          <label htmlFor="avatar">Avatar:</label>
          <input
            {...register("avatar")}
            type="file"
            accept=".png, .jpg, .jpeg"
          />
          <strong className="error">{errors?.avatar?.message}</strong>
          <button className="btn-form">Đăng ký</button>
        </form>
      </div>
    </section>
  );
}

import { Routes, Route, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AppContext from "./assets/components/AppContext";
export const api = "http://localhost:3000";
import fetchApi from "./assets/service/api";
import { ToastContainer } from "react-toastify";
import Login from "./assets/pages/Login";
import Register from "./assets/pages/Register";
import HomeUser from "./assets/pages/HomeUser";
import Slider from "./assets/components/Slider";
import MovieWithQueryString from "./assets/components/MoviesWithQueryString";
import DetailMovie from "./assets/pages/DetailMovie";
import UserProfile from "./assets/pages/UserProfile";
import FavoriteMovies from "./assets/pages/FavoriteMovies";
import Dashboard from "./assets/pages/Dashboard";
import QuanLyTheLoai from "./assets/pages/QuanLyTheLoai";
import QuanLyPhim from "./assets/pages/QuanLyPhim";
import "./App.css";
import QuanLyNguoiDung from "./assets/pages/QuanLyNguoiDung";
import AccessDeniedPage from "./assets/pages/AccessDeniedPage";
import QuanLyBinhLuan from "./assets/pages/QuanLyBinhLuan";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [me, setMe] = useState(null);
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const isAdmin = !isLoading && isLogin && me?.role === "admin";

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (newParams.has("token")) newParams.delete("token");
      });
    }
    fetch(`${api}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then(({ result }) => {
        setIsLogin(true);
        setMe(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [refresh, isLoading, setSearchParams, token]); //useEffect chạy mỗi khi component mount
  useEffect(() => {
    fetchApi({ url: `${api}/genre`, setData: setGenres });
  }, [refresh, isLoading]);
  useEffect(() => {
    fetchApi({ url: `${api}/movie`, setData: setMovies });
  }, [refresh, isLoading]);
  useEffect(() => {
    fetchApi({ url: `${api}/user`, setData: setUsers });
  }, [refresh, isLoading]);
  useEffect(() => {
    fetchApi({ url: `${api}/favoriteMovie`, setData: setFavoriteMovies });
  }, [refresh, isLoading]);
  useEffect(() => {
    fetchApi({ url: `${api}/rating`, setData: setRatings });
  }, [refresh, isLoading]);
  useEffect(() => {
    fetchApi({ url: `${api}/comment`, setData: setComments });
  }, [refresh, isLoading]);

  return (
    <>
      <AppContext.Provider
        value={{
          refresh,
          setRefresh,
          isLoading,
          setIsLoading,
          isLogin,
          setIsLogin,
          me,
          setMe,
          isAdmin,
          genres,
          movies,
          users,
          setUsers,
          favoriteMovies,
          ratings,
          comments,
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <HomeUser
                content1={<Slider data={movies?.docs} />}
                content2={<MovieWithQueryString />}
              />
            }
          />
          <Route
            path="/filter"
            element={<HomeUser content2={<MovieWithQueryString />} />}
          />
          <Route
            path="/search"
            element={<HomeUser content2={<MovieWithQueryString />} />}
          />
          <Route path="/movie/detail" element={<DetailMovie />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/info" element={<UserProfile />} />
          <Route path="/user/favorite-movies" element={<FavoriteMovies />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/genre" element={<QuanLyTheLoai />} />
          <Route path="/admin/movie" element={<QuanLyPhim />} />
          <Route path="/admin/user" element={<QuanLyNguoiDung />} />
          <Route path="/admin/comment" element={<QuanLyBinhLuan />} />
        </Routes>
        <ToastContainer position="top-center" autoClose={1000} />
      </AppContext.Provider>
    </>
  );
}
export default App;

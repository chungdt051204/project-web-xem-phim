import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseApi } from "./assets/components/Register";
import AppContext from "./assets/components/AppContext";
import Login from "./assets/components/Login";
import Register from "./assets/components/Register";
import Home from "./assets/components/Home";
import ListMovies from "./assets/components/ListMovies";
import Result from "./assets/components/Result";
import Admin from "./assets/components/Admin";
import DetailMovieWithId from "./assets/components/DetailMovieWithId";
import FilterResultWithGenre from "./assets/components/FilterResultWithGenre";
import FilterResultWithYear from "./assets/components/FilterResultWithYear";
import User from "./assets/components/User";
import AddMovie from "./assets/components/AddMovie";
import UpdateMovie from "./assets/components/UpdateMovie";
import DetailMovieWithName from "./assets/components/DetailMovieWithName";
import SearchResult from "./assets/components/SearchResult";
import Pagination from "./assets/components/Pagination";
import FavoriteMovies from "./assets/components/FavoriteMovies";
import "./App.css";
function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [createdAt, setCreatedAt] = useState(Date.now);
  const [movies, setMovies] = useState([]);
  const [moviesPage1, setMoviesPage1] = useState([]);
  const [moviesPage2, setMoviesPage2] = useState([]);
  useEffect(() => {
    fetch(`${baseApi}/user`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        setIsLogin(true);
        setId(data._id);
        setUsername(data.name);
        setEmail(data.email);
        setPassword(data.password);
        setIsAdmin(data.isAdmin);
        setAvatar(data.avatar);
        setCreatedAt(data.createdAt);
      })
      .catch();
  }, []); //useEffect chạy mỗi khi component mount
  useEffect(() => {
    fetch(`${baseApi}/listMovies`)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
      });
  });
  useEffect(() => {
    fetch(`${baseApi}/listMovies-page1`)
      .then((res) => res.json())
      .then((data) => {
        setMoviesPage1(data);
      });
  }, []);
  useEffect(() => {
    fetch(`${baseApi}/listMovies-page2`)
      .then((res) => res.json())
      .then((data) => {
        setMoviesPage2(data);
      });
  }, []);
  return (
    <>
      <AppContext.Provider
        value={{
          isLogin,
          setIsLogin,
          id,
          username,
          email,
          password,
          isAdmin,
          avatar,
          setAvatar,
          createdAt,
          movies,
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Home
                content1={<ListMovies />}
                content2={
                  <Result
                    data={moviesPage1}
                    content="Tất cả phim"
                    buttons={<Pagination />}
                  />
                }
              />
            }
          />
          <Route
            path="/movies-page2"
            element={
              <Home
                content1={<ListMovies />}
                content2={
                  <Result
                    data={moviesPage2}
                    content="Tất cả phim"
                    buttons={<Pagination />}
                  />
                }
              />
            }
          />
          <Route path="search" element={<Home content1={<SearchResult />} />} />
          <Route
            path="filter/genre"
            element={<Home content1={<FilterResultWithGenre />} />}
          />
          <Route
            path="filter/year"
            element={<Home content1={<FilterResultWithYear />} />}
          />
          <Route path="/movie/:id" element={<DetailMovieWithId />} />
          <Route path="/movie" element={<DetailMovieWithName />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/movie" element={<AddMovie />} />
          <Route path="/admin/movie/:id" element={<UpdateMovie />} />
          <Route path="/user/info" element={<User />} />
          <Route path="/user/favorite-movies" element={<FavoriteMovies />} />
        </Routes>
      </AppContext.Provider>
    </>
  );
}
export default App;

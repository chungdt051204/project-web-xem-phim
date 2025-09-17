import { useContext } from "react";
import AppContext from "./AppContext";
import Slider from "./Slider";
export default function ListMovies() {
  const { movies } = useContext(AppContext);
  return (
    <>
      <Slider data={movies} />
    </>
  );
}

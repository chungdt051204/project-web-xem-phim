import { useState } from "react";
import NavBar from "./NavBar";
import Carousel from "./Carousel";
export default function Home({ content1, content2 }) {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <>
      <NavBar isClicked={isClicked} setIsClicked={setIsClicked} />
      <Carousel />
      {content1}
      {content2}
    </>
  );
}

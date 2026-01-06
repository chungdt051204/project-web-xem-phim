import { useState } from "react";
import NavBar from "./NavBar";
import Carousel from "./Carousel";
import RandomMovie from "./RandomMovie";
import Footer from "./Footer";
export default function Home({ content1, content2 }) {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <>
      <NavBar isClicked={isClicked} setIsClicked={setIsClicked} />
      <Carousel />
      {content1}
      <div className="flex gap-[100px] mt-[20px]">
        {content2}
        <RandomMovie />
      </div>
      <Footer />
    </>
  );
}

import { useState } from "react";
import UserNavBar from "../components/UserNavBar";
import Carousel from "../components/Carousel";
import RandomMovie from "../components/RandomMovie";
import Footer from "../components/Footer";
export default function HomeUser({ content1, content2 }) {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <>
      <UserNavBar isClicked={isClicked} setIsClicked={setIsClicked} />
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

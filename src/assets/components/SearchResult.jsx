import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseApi } from "./Register";
import Result from "./Result";
export default function SearchResult() {
  //Sử dụng useSearchParams từ react-router-dom để lấy giá trị name trên URL
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name");
  const [searchResult, setSearchResult] = useState([]);
  //Dùng encodeURIComponent để không bị lỗi khi giá trị có ký tự đặc biệt hoặc dấu cách
  useEffect(() => {
    fetch(`${baseApi}/search?name=${encodeURIComponent(name)}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResult(data);
      });
  }, [name]); //useEffect chạy mỗi khi giá trị trên URL thay đổi
  return (
    <>
      <section>
        <Result
          data={searchResult}
          content={`Tìm thấy ${searchResult.length} phim`}
        />
      </section>
    </>
  );
}

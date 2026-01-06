export default function LoginGoogle() {
  return (
    <div
      onClick={() =>
        (window.location.href = "http://localhost:3000/auth/google")
      }
      className="flex w-[250px] py-[7px] px-[15px] my-[15px] mx-auto gap-[5px]
       text-white font-semibold rounded-[5px] bg-blue-500 cursor-pointer"
    >
      <div className="w-[32px] h-[32px] border rounded-[2px] bg-white">
        <img
          className="w-[30px] h-[30px]"
          src="./src/assets/logo-google.png"
          alt=""
        />
      </div>
      <p className="ms-[10px] mt-[5px]">Đăng nhập với google</p>
    </div>
  );
}

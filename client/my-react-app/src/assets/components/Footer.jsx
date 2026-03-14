export default function Footer() {
  return (
    <footer className="p-[20px] bg-[#111] text-gray-400 text-[14px] mt-[40px]">
      <div className="flex justify-around">
        <ul>
          <li className="text-white font-semibold mb-2">🎬 StudentMovie</li>
          <li className="mt-2">© 2025 StudentMovie</li>
        </ul>
        <div>
          <h4 className="text-white font-semibold mb-2">Liên kết nhanh</h4>
          <ul>
            <li>
              <a href="/" className="hover:opacity-60">
                Trang chủ
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/thanh.chung.109573?locale=vi_VN"
                target="_blank"
                className="hover:opacity-60"
              >
                Giới thiệu
              </a>
            </li>
            <li>
              <a
                href="/https://github.com/"
                target="_blank"
                className="hover:opacity-60"
              >
                Liên hệ
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Liên hệ</h4>
          <ul>
            <li>Email: dh52200410@student.stu.edu.vn</li>
            <li>Trường Đại học công nghệ Sài Gòn</li>
            <li className="mt-3 text-gray-500 text-[12px]">
              *Nội dung phim chỉ phục vụ học tập, không thương mại hóa.
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Tài khoản Admin</h4>
          <ul>
            <li>Username: Admin</li>
            <li>Password: admin123</li>
          </ul>
        </div>
        <button
          className="w-[40px] h-[40px] text-white border-2 border-white rounded-[50px]"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    </footer>
  );
}

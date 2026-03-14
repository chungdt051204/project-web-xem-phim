export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        <div className="mb-6 flex justify-center">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728A9 9 0 015.636 5.636"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-3">
          Access Denied
        </h2>

        <div className="space-y-2">
          <p className="text-gray-500 leading-relaxed">
            Tài khoản của bạn hiện đang bị vô hiệu hóa.
          </p>
          <p className="text-sm text-gray-400">
            Vui lòng liên hệ với quản trị viên hệ thống để biết thêm thông tin
            chi tiết về sự cố này.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
            Status: 403 Forbidden
          </span>
        </div>
      </div>
    </div>
  );
}

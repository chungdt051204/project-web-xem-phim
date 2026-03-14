export default function ConfirmDialog({ ref, content, handleClick }) {
  return (
    <dialog
      ref={ref}
      className="m-auto rounded-xl border border-gray-200 dark:border-gray-800 p-0 
       backdrop:bg-black/20 dark:bg-zinc-950 shadow-sm transition-all"
    >
      <div className="w-80 p-5 flex flex-col gap-6">
        <p className="text-sm font-medium text-gray-700 dark:text-zinc-300 leading-relaxed">
          {content}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => ref?.current?.close()}
            className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 
             dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleClick}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-zinc-900 
                         dark:bg-zinc-100 dark:text-zinc-900 rounded-md 
                         hover:opacity-90 active:scale-95 transition-all"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </dialog>
  );
}

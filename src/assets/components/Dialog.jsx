export default function Dialog({ ref, message }) {
  return (
    <>
      <dialog
        ref={ref}
        className="fixed w-[400px] h-[120px] p-[20px] start-[500px] rounded-[4px]"
      >
        {message}
        <form method="dialog">
          <button className="btn-dialog mt-[20px]">OK</button>
        </form>
      </dialog>
    </>
  );
}

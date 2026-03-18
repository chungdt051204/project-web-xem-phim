export default function fetchApi({ url, setData }) {
  const token = localStorage.getItem("token");
  // Tạo object headers trước
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  fetch(`${url}`, { headers })
    .then((res) => {
      if (res.ok) return res.json();
      throw res;
    })
    .then(({ result }) => {
      setData(result);
    })
    .catch(async (err) => {
      const { message } = await err.json();
      console.log(message);
    });
}

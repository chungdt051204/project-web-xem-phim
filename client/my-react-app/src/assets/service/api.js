export default function fetchApi({ url, setData }) {
  fetch(`${url}`)
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

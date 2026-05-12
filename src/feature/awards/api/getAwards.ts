export function getAwards() {
  return fetch(`${import.meta.env.VITE_API_URL}/awards`).then((res) =>
    res.json(),
  );
}

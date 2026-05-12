export function getAward(id: string) {
  return fetch(`${import.meta.env.VITE_API_URL}/awards/${id}`).then((res) =>
    res.json(),
  );
}

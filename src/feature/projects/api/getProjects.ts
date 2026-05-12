export function getProjects() {
  return fetch(`${import.meta.env.VITE_API_URL}/projects`).then((res) =>
    res.json(),
  );
}

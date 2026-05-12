export function getProject(id: string) {
  return fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`).then((res) =>
    res.json(),
  );
}

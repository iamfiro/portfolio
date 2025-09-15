export function getPosts() {
  return fetch(`${import.meta.env.VITE_API_URL}/blog/posts`).then((res) =>
    res.json(),
  );
}

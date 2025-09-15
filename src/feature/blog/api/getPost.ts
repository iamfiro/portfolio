export function getPost(title: string) {
  return fetch(`${import.meta.env.VITE_API_URL}/blog/post/${title}`).then(
    (res) => res.json(),
  );
}

import { readdirSync, readFileSync } from "fs";

import { parseMarkdown } from "./markdown.js";

export function getPosts() {
  try {
    const posts = readdirSync(`${process.cwd()}/posts/content/`, "utf8");

    const filteredPosts = posts.filter((post) => post.endsWith(".md"));

    const parsedPosts = filteredPosts
      .map((post) => {
        try {
          const postContent = readFileSync(
            `${process.cwd()}/posts/content/${post}`,
            "utf8",
          );

          const parsedPost = parseMarkdown(postContent, post);
          // content 제거하고 반환
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { content, ...postWithoutContent } = parsedPost;
          return postWithoutContent;
        } catch (error) {
          console.error(`Error reading post file ${post}:`, error);
          return null;
        }
      })
      .filter(Boolean); // null 값 제거

    return parsedPosts;
  } catch (error) {
    console.error("Error reading posts directory:", error);
    return [];
  }
}

export function getPost(title: string) {
  try {
    const posts = readdirSync(`${process.cwd()}/posts/content/`, "utf8");
    const filteredPosts = posts.filter((post) => post.endsWith(".md"));
    const post = filteredPosts.find((post) => post.includes(title));

    if (!post) {
      throw new Error(`Post with title "${title}" not found`);
    }

    const postContent = readFileSync(
      `${process.cwd()}/posts/content/${post}`,
      "utf8",
    );

    return parseMarkdown(postContent, post);
  } catch (error) {
    console.error(`Error reading post "${title}":`, error);
    throw error; // 라우터에서 처리할 수 있도록 에러를 다시 던짐
  }
}

import { getPosts } from "./post.js";
import prisma from "./prisma.js";

export async function syncPosts() {
  const posts = getPosts();

  const validPosts = posts.filter(
    (post): post is NonNullable<typeof post> => post !== null,
  );

  await Promise.all(
    validPosts.map((post) => {
      const slug = post.title as string;
      return prisma.post.upsert({
        where: { slug },
        create: { slug, title: slug },
        update: { title: slug },
      });
    }),
  );
}

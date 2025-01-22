import {BlogRootHero} from "@/components/blog/Hero";
import { PostList } from "@/components/blog/PostList";
import BlogLayout from "@/layouts/BlogLayout";

import { getAllPosts } from "@/lib/mdx";

const PostRootPage = async () => {
    const posts = await getAllPosts();
    return (
        <BlogLayout>
            <BlogRootHero />
            <PostList posts={
                posts.map((post) => ({
                    id: post.filePath,
                    name: post.data.title,
                    date: post.data.date,
                }))
            }/>
        </BlogLayout>
    );
}

export default PostRootPage;
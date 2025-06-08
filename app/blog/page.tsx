import {BlogRootHero} from "@/components/blog/Hero";
import { PostList } from "@/components/blog/PostList";
import { getAllPosts } from "@/lib/mdx";
import BlogLayout from "@/components/layout/BlogLayout";

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
                    filePath: post.filePath,
                }))
            }/>
        </BlogLayout>
    );
}

export default PostRootPage;
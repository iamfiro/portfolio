import {BlogRootHero} from "@/components/blog/Hero";
import BlogLayout from "@/layouts/BlogLayout";
import { parseMDXPost } from "@/lib/mdx";

const PostRootPage = async () => {
    await parseMDXPost('posts/content/example.mdx');
    return (
        <BlogLayout>
            <BlogRootHero />
        </BlogLayout>
    );
}

export default PostRootPage;
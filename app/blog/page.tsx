import {BlogRootHero} from "@/components/blog/Hero";
import { PostList } from "@/components/blog/PostList";
import BlogLayout from "@/layouts/BlogLayout";

const PostRootPage = async () => {
    return (
        <BlogLayout>
            <BlogRootHero />
            <PostList posts={[
                {
                    id: '1',
                    name: '프론트엔드 개발자가 되기 위한 로드맵',
                    date: '01. 01.',
                },
                {
                    id: '2',
                    name: '디자이너가 사랑하는 상업용 무료 폰트 명조체 5가지',
                    date: '04. 02.',
                }
            ]}/>
        </BlogLayout>
    );
}

export default PostRootPage;
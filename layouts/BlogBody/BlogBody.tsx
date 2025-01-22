import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

interface BlogBodyProps {
    content: MDXRemoteSerializeResult;
}

const BlogBody = ({content}: BlogBodyProps) => {
    return (
        <MDXRemote />
    );
}

export default BlogBody;
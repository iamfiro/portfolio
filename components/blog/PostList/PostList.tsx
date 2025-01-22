'use client'

import { useState } from 'react';
import PostListGroup from './PostGroup';
import PostListItem from './PostItem';

interface PostListProps {
    posts: { id: string; name: string, date: string }[];
}

const PostList = ({ posts }: PostListProps) => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    return (
        <PostListGroup year={2024}>
            {posts.map((post) => (
                <PostListItem 
                    key={post.id}
                    name={post.name}
                    date={post.date}
                    isOtherItemHovered={hoveredItem !== null && hoveredItem !== post.id}
                    onHover={(isHovered) => setHoveredItem(isHovered ? post.id : null)}
                />
            ))}
        </PostListGroup>
    );
}

export default PostList;
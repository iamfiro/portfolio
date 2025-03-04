'use client';

import PostListGroup from './PostGroup';
import PostListItem from './PostItem';
import { usePostsByYear } from '@/hooks/blog/useSortPostsByYear';
import { useHover } from '@/hooks/blog/usePostItemHover';
import { PostItem } from '@/types/blog';
import { Flex } from '@creative-kit/react';

interface PostListProps {
	posts: PostItem[];
}

const PostList = ({ posts }: PostListProps) => {
	const { isOtherItemHovered, handleHover } = useHover();
	const groupedPosts = usePostsByYear(posts);

	return (
		<Flex direction='column' gap={30}>
			{groupedPosts.map(([year, yearPosts]) => (
				<PostListGroup key={year} year={parseInt(year)}>
					{yearPosts.map((post) => (
						<PostListItem
							key={post.id}
                            id={post.id}
							name={post.name}
							date={post.date}
							isOtherItemHovered={isOtherItemHovered(post.id)}
							onHover={(isHovered) =>
								handleHover(post.id, isHovered)
							}
						/>
					))}
				</PostListGroup>
			))}
		</Flex>
	);
};

export default PostList;

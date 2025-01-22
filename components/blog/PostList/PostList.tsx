'use client';

import PostListGroup from './PostGroup';
import PostListItem from './PostItem';
import { usePostsByYear } from '@/hooks/blog/useSortPostsByYear';
import { useHover } from '@/hooks/blog/usePostItemHover';
import { PostItem } from '@/types/blog';

interface PostListProps {
	posts: PostItem[];
}

const PostList = ({ posts }: PostListProps) => {
	const { isOtherItemHovered, handleHover } = useHover();
	const groupedPosts = usePostsByYear(posts);

	return (
		<>
			{groupedPosts.map(([year, yearPosts]) => (
				<PostListGroup key={year} year={parseInt(year)}>
					{yearPosts.map((post) => (
						<PostListItem
							key={post.id}
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
		</>
	);
};

export default PostList;

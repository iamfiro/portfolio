import { PostItem } from '@/types/blog';

export const usePostsByYear = (posts: PostItem[]) => {
	// // Post를 날짜 순으로 정렬
	const sortedPosts = [...posts].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	// date의 year를 기준으로 Post를 그룹화
	const postsByYear = sortedPosts.reduce((acc, post) => {
		const year = new Date(post.date).getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year].push(post);
		return acc;
	}, {} as Record<number, PostItem[]>);

	// year를 기준으로 Post를 정렬
	const groupedPosts = Object.entries(postsByYear).sort(
		([yearA], [yearB]) => Number(yearB) - Number(yearA),
	);

	return groupedPosts;
};

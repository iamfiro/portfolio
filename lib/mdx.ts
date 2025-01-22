import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';

/**
 * MDX파일의 내용과 메타데이터를 json으로 파싱합니다.
 * @param mdxSource
 * @returns
 */
export const parseMDX = async (mdxSource: string, fileName?: string) => {
    const { content, data } = matter(mdxSource);
    return {
        content,
        data,
    };
};

/***
 * /posts 디렉토리에 있는 모든 MDX파일을 읽어옵니다.
 */
export async function getAllPosts() {
	// Get files under /posts
	const postsDirectory = path.join(process.cwd(), 'posts/content');
	const files = await fs.readdir(postsDirectory);

	// Get content and metadata for each post
	const posts = await Promise.all(
		files
			.filter((file) => file.endsWith('.mdx'))
			.map(async (file) => {
				const filePath = path.join(postsDirectory, file);
				const source = await fs.readFile(filePath, 'utf8');
				const { content, data } = matter(source);

				return {
					content,
					data,
					filePath: file.replace(/\.mdx?$/, ''),
				};
			}),
	);

	return posts;
}

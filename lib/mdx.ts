import matter from 'gray-matter';
import fs from 'fs/promises';
import path from 'path';
import readingTime from 'reading-time';

/**
 * MDX파일의 내용과 메타데이터를 json으로 파싱합니다.
 * @param mdxSource
 * @returns
 */
export const parseMDX = async (mdxPath: string) => {
	try {
		// MDX 파일을 읽어옵니다
		const fullPath = path.join(process.cwd(), mdxPath);
		const fileContent = await fs.readFile(fullPath, 'utf8');

		// MDX 파일을 파싱합니다
		const { content, data } = matter(fileContent);

		return {
			content,
			data,
		};
	} catch (error) {
		console.error('Error parsing MDX:', error);
		throw new Error(`Failed to parse MDX file: ${mdxPath}`);
	}
};

/***
 * /posts 디렉토리에 있는 모든 MDX파일을 읽어옵니다.
 */
export async function getAllPosts() {
	// /posts 안에 있는 모든 파일을 읽어옵니다
	const postsDirectory = path.join(process.cwd(), 'posts/content');
	const files = await fs.readdir(postsDirectory);

	//  MDX 파일만 필터링하여 읽어옵니다
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

interface BlogData {
	title: string;
	date: Date;
	thumbnail: string;
}

export async function parseMDXDetail(slug: string) {
	const { content, data } = (await parseMDX(slug)) as {
		content: string;
		data: BlogData;
	};

	const readingMinutes = Math.ceil(readingTime(content).minutes);
	const dateString = data.date.toString();

	return { ...data, content, readingMinutes, dateString };
}

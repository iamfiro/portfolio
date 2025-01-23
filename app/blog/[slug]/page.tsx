import { BlogHeader } from '@/layouts/BlogHeader';
import BlogLayout from '@/layouts/BlogLayout';
import { getAllPosts, parseMDX, parseMDXDetail } from '@/lib/mdx';
import { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Flex } from '@creative-kit/react';

import remarkGfm from 'remark-gfm';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypePrism from 'rehype-prism-plus';
import rehypeCodeTitles from 'rehype-code-titles';
import '@/styles/prism-gh.scss';

import s from '@/styles/blog.module.scss';
import { useMDXComponents } from '@/mdx-components';

interface PageProps {
	params: Promise<{
		slug: string;
	}>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await parseMDX(`posts/content/${slug}.mdx`);

	return {
		title: post.data.title,
		description: post.data.description,
		openGraph: {
			title: post.data.title,
			description: post.data.description,
			type: 'article',
			publishedTime: post.data.date,
			authors: ['조성주'],
			images: [
				{
					url: post.data.thumbnail || '/default-thumbnail.jpg',
					width: 1200,
					height: 630,
					alt: post.data.title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: post.data.title,
			description: post.data.description,
			images: [post.data.thumbnail || '/default-thumbnail.jpg'],
		},
	};
}

export async function generateStaticParams() {
	const posts = await getAllPosts();
	return posts.map((post) => ({
		slug: post.filePath,
	}));
}

const rehypeOptions = {
	keepBackground: true,
};

const Page = async ({ params }: PageProps) => {
	const { slug } = await params;

	const post = await parseMDXDetail(`posts/content/${slug}.mdx`);

	return (
		<div>
			<BlogLayout>
				<BlogHeader {...post} />
				<Flex direction="column" className={s.b}>
					<MDXRemote
						source={post.content}
						components={useMDXComponents({})}
						options={{
							mdxOptions: {
								remarkPlugins: [remarkGfm],
								rehypePlugins: [
									[rehypePrism, {showLineNumbers: true}],
									rehypeAutolinkHeadings,
									rehypeSlug,
									rehypeCodeTitles,
								],
							},
						}}
					/>
				</Flex>
			</BlogLayout>
		</div>
	);
};

export default Page;

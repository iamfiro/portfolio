import { BlogHeader } from '@/layouts/BlogHeader';
import BlogLayout from '@/layouts/BlogLayout';
import { getAllPosts, parseMDX, parseMDXDetail } from '@/lib/mdx';
import { Metadata, ResolvingMetadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Flex } from '@creative-kit/react';

interface PageProps {
	params: {
		slug: string;
	};
	searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
	{ params }: PageProps,
): Promise<Metadata> {
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

const Page = async ({ params }: PageProps) => {
	const { slug } = await params;

	const post = await parseMDXDetail(`posts/content/${slug}.mdx`);

	return (
		<BlogLayout>
			<BlogHeader {...post} />
			<Flex direction="column">
				<MDXRemote source={post.content} />
			</Flex>
		</BlogLayout>
	);
};

export default Page;

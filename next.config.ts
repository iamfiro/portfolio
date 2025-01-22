import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypePrism from 'rehype-prism-plus';

const nextConfig: NextConfig = {
	sassOptions: {
		additionalData: `@use "styles/variables.scss" as *; @use "styles/mixins.scss" as *;`,
	},
	// 마크다운 및 MDX 파일을 App router에 연동시키기 위한 추가 세팅
	pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'img.shields.io',
				port: ''
			}
		]
	}
};

const withMDX = createMDX({
	options: {
		rehypePlugins: [rehypeCodeTitles, rehypePrism],
		remarkPlugins: [],
	}
})

export default withMDX(nextConfig);

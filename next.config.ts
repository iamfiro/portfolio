import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
	sassOptions: {
		additionalData: `@use "styles/variables.scss" as *; @use "styles/mixins.scss" as *;`,
	},
	// 마크다운 및 MDX 파일을 App router에 연동시키기 위한 추가 세팅
	pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

const withMDX = createMDX({})

export default withMDX(nextConfig);

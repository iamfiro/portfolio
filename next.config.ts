import type { NextConfig } from "next";
import path from "path";
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import withMDX from '@next/mdx';

const withVanillaExtract = createVanillaExtractPlugin();

const withMDXConfig = withMDX({
  extension: /\.mdx$/
});

const nextConfig: NextConfig = {
  devIndicators: false,


  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },

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

export default withVanillaExtract(withMDXConfig(nextConfig));

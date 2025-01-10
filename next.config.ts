import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	sassOptions: {
		additionalData: `@use "styles/variables.scss" as *; @use "styles/mixins.scss" as *;`,
	},
};

export default nextConfig;

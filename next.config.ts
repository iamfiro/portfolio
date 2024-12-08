import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    sassOptions: {
        additionalData: `@use "src/styles/variables.scss" as *; @use "src/styles/mixins.scss" as *;`,
    },
};

export default nextConfig;

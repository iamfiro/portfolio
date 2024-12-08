import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    sassOptions: {
        additionalData: `@use "src/styles/variables.scss" as *;`,
    },
};

export default nextConfig;

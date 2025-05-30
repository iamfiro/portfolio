import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ['./styles', './components'],
    prependData: `@import "styles/token/color.scss"; @import "styles/token/radius.scss"; @import "styles/token/spacing.scss";`,
  },
};

export default nextConfig;

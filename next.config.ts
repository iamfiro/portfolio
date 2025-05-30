import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  sassOptions: {
    includePaths: ['./styles', './components'],
    prependData: `@import "styles/token/color.scss"; @import "styles/token/radius.scss"; @import "styles/token/spacing.scss"; @import "styles/token/shadow.scss";`,
  },
};

export default nextConfig;

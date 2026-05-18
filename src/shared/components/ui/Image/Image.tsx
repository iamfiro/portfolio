import { useState } from "react";

import type { LayoutProps, StyleProps } from "@/shared/types/component-common";
import { generateSrcSet } from "@/shared/utils/responsive-image.util";

import { buildLayoutStyle, cn } from "../_utils";

import styles from "./Image.module.scss";

type ImageProps = {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  objectFit?: "cover" | "contain" | "fill" | "none";
  responsive?: boolean;
  rounded?: boolean;
} & LayoutProps &
  StyleProps &
  Omit<React.ImgHTMLAttributes<HTMLImageElement>, "width" | "height">;

function Image({
  src,
  alt,
  fallback,
  objectFit = "cover",
  responsive = false,
  rounded = false,
  className,
  style,
  width,
  maxWidth,
  minWidth,
  height,
  maxHeight,
  minHeight,
  ...rest
}: ImageProps) {
  const [error, setError] = useState(false);
  const generatedSrcSet = responsive ? generateSrcSet(src) : null;
  const srcSet = rest.srcSet ?? generatedSrcSet ?? undefined;

  if (error && fallback) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={src}
      srcSet={srcSet}
      alt={alt}
      className={cn(styles.image, rounded && styles.rounded, className)}
      style={{
        objectFit,
        ...buildLayoutStyle({
          width,
          maxWidth,
          minWidth,
          height,
          maxHeight,
          minHeight,
        }),
        ...style,
      }}
      onError={() => setError(true)}
      {...rest}
    />
  );
}

export { Image };
export type { ImageProps };

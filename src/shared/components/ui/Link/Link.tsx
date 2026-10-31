import type { StyleProps } from "@/shared/types/component-common";

import { cn } from "../_utils";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";

import styles from "./Link.module.scss";

type LinkProps = {
  variant?: "default" | "subtle" | "brand";
  external?: boolean;
  children?: React.ReactNode;
} & StyleProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

function Link({
  variant = "default",
  external = false,
  className,
  style,
  children,
  ...rest
}: LinkProps) {
  // mailto·tel은 새 창이 아니라 메일·전화 앱으로 열리므로 안내하지 않는다
  const opensNewWindow = external && !/^(mailto|tel):/.test(rest.href ?? "");

  return (
    <a
      className={cn(styles.link, styles[variant], className)}
      style={style}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
      {/* 새 창으로 열린다는 걸 스크린리더에도 알린다 */}
      {opensNewWindow && <VisuallyHidden>(새 창에서 열림)</VisuallyHidden>}
    </a>
  );
}

export { Link };
export type { LinkProps };

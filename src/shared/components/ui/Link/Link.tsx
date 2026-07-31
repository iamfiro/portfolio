import { usePageTransition } from "@/shared/components/layouts/page-transition/page-transition.context";
import type { StyleProps } from "@/shared/types/component-common";

import { cn } from "../_utils";

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
  href,
  onClick,
  rel,
  target,
  ...rest
}: LinkProps) {
  const { navigateTo } = usePageTransition();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    const shouldUsePageTransition =
      !event.defaultPrevented &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey &&
      !external &&
      target !== "_blank" &&
      href?.startsWith("/");

    if (!shouldUsePageTransition || !href) return;

    event.preventDefault();
    navigateTo(href);
  };

  return (
    <a
      className={cn(styles.link, styles[variant], className)}
      style={style}
      href={href}
      onClick={handleClick}
      target={external ? "_blank" : target}
      rel={external ? "noopener noreferrer" : rel}
      {...rest}
    >
      {children}
    </a>
  );
}

export { Link };
export type { LinkProps };

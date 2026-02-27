import type { LayoutProps, StyleProps } from "@/shared/types/component-common";

import { buildLayoutStyle, cn } from "../_utils";

import styles from "./Select.module.scss";

type SelectProps = {
  size?: "sm" | "md" | "lg";
  error?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
} & StyleProps &
  Pick<LayoutProps, "width" | "maxWidth"> &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">;

function Select({
  size = "md",
  error = false,
  fullWidth = false,
  placeholder,
  className,
  style,
  width,
  maxWidth,
  children,
  ...rest
}: SelectProps) {
  return (
    <div
      className={cn(
        styles.wrapper,
        styles[size],
        error && styles.error,
        fullWidth && styles.fullWidth,
        className,
      )}
      style={{ ...buildLayoutStyle({ width, maxWidth }), ...style }}
    >
      <select className={styles.select} {...rest}>
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
      <svg
        className={styles.chevron}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

export { Select };
export type { SelectProps };

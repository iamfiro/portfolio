import s from "./style.module.scss";

interface Props {
  children: React.ReactNode;
  gap?: number;
  style?: React.CSSProperties;
  className?: string;
}

const BaseLayout = ({ children, gap, style, className }: Props) => {
  return (
    <div
      className={`${s.base} ${className}`}
      style={{ gap: gap ? `${gap}px` : undefined, ...style }}
    >
      {children}
    </div>
  );
};

export default BaseLayout;

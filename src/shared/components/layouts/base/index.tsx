import s from "./style.module.scss";

interface Props {
  children: React.ReactNode;
  gap?: number;
  style?: React.CSSProperties;
}

const BaseLayout = ({ children, gap, style }: Props) => {
  return (
    <div
      className={s.base}
      style={{ gap: gap ? `${gap}px` : undefined, ...style }}
    >
      {children}
    </div>
  );
};

export default BaseLayout;

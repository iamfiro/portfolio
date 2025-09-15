import s from "./style.module.scss";

interface Props {
  children: React.ReactNode;
  size?: "sm" | "lg";
  onClick?: () => void;
  active?: boolean;
  style?: React.CSSProperties;
}

export default function Tag(props: Props) {
  const { children, size = "sm", onClick, active = false, style } = props;

  const className = [s.tag, s[size], active ? s.active : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

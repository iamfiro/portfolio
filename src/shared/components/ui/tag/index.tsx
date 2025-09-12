import s from "./style.module.scss";

interface Props {
  children: React.ReactNode;
  size?: "sm" | "lg";
  onClick?: () => void;
  active?: boolean;
}

export default function Tag(props: Props) {
  const { children, size = "sm", onClick, active = false } = props;

  const className = [s.tag, s[size], active ? s.active : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {children}
    </div>
  );
}

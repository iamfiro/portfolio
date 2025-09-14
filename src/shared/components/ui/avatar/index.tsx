import styles from "./style.module.scss";

interface AvatarProps {
  src: string;
  size: number;
  alt?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  size,
  alt = "Avatar",
  className = "",
}) => {
  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div className={`${styles.avatar} ${className}`} style={avatarStyle}>
      <img src={src} alt={alt} className={styles.avatarImage} />
    </div>
  );
};

export default Avatar;

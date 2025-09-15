import { Skeleton } from "../";

interface TagSkeletonProps {
  width?: string | number;
  height?: string | number;
}

export default function TagSkeleton({
  width = "60px",
  height = "32px",
}: TagSkeletonProps) {
  return (
    <Skeleton
      width={width}
      height={height}
      borderRadius="16px"
      animation="pulse"
    />
  );
}

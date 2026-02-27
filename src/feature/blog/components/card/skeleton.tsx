import { Flex, Skeleton } from "@/shared/components/ui";

import s from "./style.module.scss";

export default function BlogCardSkeleton() {
  return (
    <div className={s.card}>
      <Skeleton
        height="190px"
        width="300px"
        variant="rectangular"
        className={s.thumbnail}
      />
      <Flex direction="column" gap={12}>
        <Flex gap={6} align="center">
          <Skeleton height="14px" width="80px" />
          <Skeleton height="14px" width="60px" />
        </Flex>
        <Flex direction="column" gap={12}>
          <Skeleton
            height="26px"
            width="220px"
            style={{ borderRadius: "6px" }}
          />
          <Skeleton
            height="26px"
            width="150px"
            style={{ borderRadius: "6px" }}
          />
          <Flex gap={4}>
            <Skeleton
              height="20px"
              width="50px"
              style={{ borderRadius: "6px" }}
            />
            <Skeleton
              height="20px"
              width="50px"
              style={{ borderRadius: "6px" }}
            />
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}

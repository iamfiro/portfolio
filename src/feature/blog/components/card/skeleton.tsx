import { FlexAlign, HStack, Skeleton, VStack } from "@/shared/components/ui";

import s from "./style.module.scss";

export default function BlogCardSkeleton() {
  return (
    <div className={s.card}>
      <Skeleton.Rectangle
        height={"190px"}
        width={"300px"}
        className={s.thumbnail}
      />
      <VStack gap={12}>
        <HStack gap={6} align={FlexAlign.Center}>
          <Skeleton height="14px" width="80px" />
          <Skeleton height="14px" width="60px" />
        </HStack>
        <VStack gap={12}>
          <Skeleton height="26px" width="220px" borderRadius="6px" />
          <Skeleton height="26px" width="150px" borderRadius="6px" />
          <HStack gap={4}>
            <Skeleton height="20px" width="50px" borderRadius="6px" />
            <Skeleton height="20px" width="50px" borderRadius="6px" />
          </HStack>
        </VStack>
      </VStack>
    </div>
  );
}

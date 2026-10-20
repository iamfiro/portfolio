import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { getAwards } from "@/feature/awards/data";
import type { Award, AwardsResponse } from "@/feature/awards/schema";
import {
  Flex,
  HoverPreview,
  HoverPreviewTrigger,
  Stack,
  Text,
} from "@/shared/components/ui";

import s from "./style.module.scss";

interface AwardItemProps {
  award: Award;
  index: number;
}

function AwardItem({ award, index }: AwardItemProps) {
  const year = new Date(award.date).getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.3 + index * 0.05,
      }}
    >
      <HoverPreviewTrigger
        className={s.item}
        preview={{
          title: award.title,
          subtext: `${award.organization} · ${year}`,
          imageUrl: award.imageUrl,
        }}
      >
        <Flex align="baseline" gap={12} width="100%">
          <Stack className={s.content} gap={4}>
            <Text as="span" className={s.title}>
              {award.title}
            </Text>
            <Text as="span" size="sm" color="subtle" className={s.organization}>
              {award.organization}
            </Text>
          </Stack>
          <Text as="span" size="xs" color="subtle" className={s.year}>
            {year}
          </Text>
        </Flex>
      </HoverPreviewTrigger>
    </motion.div>
  );
}

export default function AwardsList() {
  const { data, isLoading, error } = useQuery<AwardsResponse>({
    queryKey: ["awards"],
    queryFn: getAwards,
  });

  if (isLoading) {
    return <Text color="subtle">수상 실적을 불러오는 중입니다.</Text>;
  }

  if (error) {
    return <Text color="subtle">수상 실적을 불러올 수 없습니다.</Text>;
  }

  return (
    <HoverPreview className={s.list}>
      <Stack gap={20}>
        {(data?.data ?? []).map((award, index) => (
          <AwardItem key={award.id} award={award} index={index} />
        ))}
      </Stack>
    </HoverPreview>
  );
}

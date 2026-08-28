import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCallback, useMemo } from "react";

import { getAwards } from "@/feature/awards/data";
import { Award, AwardsResponse } from "@/feature/awards/schema";
import { Flex, Heading, Stack, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

interface DisplayAward {
  id: string;
  name: string;
  organization: string;
  year: number;
}

export default function AwardsList() {
  const { data, isLoading, error } = useQuery<AwardsResponse>({
    queryKey: ["awards"],
    queryFn: getAwards,
  });

  const awards = useMemo<DisplayAward[]>(() => {
    return (data?.data ?? []).map((award: Award) => ({
      id: award.id,
      name: award.title,
      organization: award.organization,
      year: new Date(award.date).getFullYear(),
    }));
  }, [data]);

  const renderAward = useCallback(
    (award: DisplayAward, index: number) => (
      <motion.div
        key={award.id}
        initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 1.4,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.5 + index * 0.12,
        }}
      >
        <Flex className={s.card}>
          <Stack className={s.cardContent}>
            <Stack className={s.cardHeader}>
              <Heading as="h3" size="lg" className={s.cardTitle}>
                {award.name}
              </Heading>
              <Text size="md" color="subtle" className={s.cardOrganization}>
                {award.organization} · {award.year}
              </Text>
            </Stack>
          </Stack>
        </Flex>
      </motion.div>
    ),
    [],
  );

  return (
    <div className={s.list}>
      {isLoading ? (
        <Text color="subtle">어워드를 불러오는 중입니다.</Text>
      ) : error ? (
        <Text color="subtle">어워드를 불러올 수 없습니다.</Text>
      ) : (
        awards.map(renderAward)
      )}
    </div>
  );
}

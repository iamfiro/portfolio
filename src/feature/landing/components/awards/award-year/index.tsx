import { motion } from "framer-motion";

import { getRevealProps } from "@/feature/landing/utils/reveal.util";
import { Box, HoverPreviewTrigger, Text } from "@/shared/components/ui";

import LogoMark from "../../logo-mark";
import type { AwardYearGroup } from "../awards.util";

import s from "./style.module.scss";

interface Props {
  group: AwardYearGroup;
}

/** 한 해의 수상 묶음. 연도를 왼쪽에 두고 수상 줄이 차례로 떠오른다 */
export default function AwardYear({ group }: Props) {
  return (
    <Box className={s.year}>
      <motion.div {...getRevealProps()}>
        <Text as="span" className={s.label}>
          {group.year}
        </Text>
      </motion.div>

      <Box className={s.items}>
        {group.awards.map((award, index) => (
          <motion.div key={award.id} {...getRevealProps(index * 0.06)}>
            <HoverPreviewTrigger
              className={s.item}
              preview={{
                title: award.title,
                subtext: `${award.organization} · ${group.year}`,
                imageUrl: award.imageUrl,
              }}
            >
              {award.logoUrl && <LogoMark src={award.logoUrl} size="sm" />}
              <Box className={s.copy}>
                <Text as="span" className={s.title}>
                  {award.title}
                </Text>
                <Text as="span" className={s.organization}>
                  {award.organization}
                </Text>
              </Box>
            </HoverPreviewTrigger>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}

import type { CaseStudyFeature } from "@/feature/projects/schema";
import { Box, Text } from "@/shared/components/ui";

import Reveal from "../reveal";

import s from "./style.module.scss";

interface Props {
  items: CaseStudyFeature[];
}

/** 초점 항목을 두 열의 옅은 타일로 늘어놓는다 */
export default function FeatureList({ items }: Props) {
  return (
    <Box className={s.grid}>
      {items.map((item, index) => (
        <Reveal key={item.title} index={index + 1} className={s.tile}>
          <Text as="span" className={s.title}>
            {item.title}
          </Text>
          <Text as="p" className={s.body}>
            {item.body}
          </Text>
        </Reveal>
      ))}
    </Box>
  );
}

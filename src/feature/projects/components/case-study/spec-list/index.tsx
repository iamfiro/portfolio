import type { CaseStudySpec } from "@/feature/projects/schema";
import { Box, Text } from "@/shared/components/ui";

import Reveal from "../reveal";

import s from "./style.module.scss";

interface Props {
  items: CaseStudySpec[];
}

export default function SpecList({ items }: Props) {
  return (
    <Box className={s.list}>
      {items.map((spec, index) => (
        <Reveal key={spec.title} index={index + 1} className={s.group}>
          <Text as="span" className={s.label}>
            {spec.title}
          </Text>
          <Box className={s.chips}>
            {spec.items.map((item) => (
              <Text key={item} as="span" className={s.chip}>
                {item}
              </Text>
            ))}
          </Box>
        </Reveal>
      ))}
    </Box>
  );
}

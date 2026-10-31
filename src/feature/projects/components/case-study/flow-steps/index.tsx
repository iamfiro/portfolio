import { ArrowRight } from "lucide-react";

import type { FlowStage } from "@/feature/projects/schema";
import { Box, Text } from "@/shared/components/ui";

import Reveal from "../reveal";

import s from "./style.module.scss";

interface Props {
  stages: FlowStage[];
}

/** 단계를 옅은 타일로 늘어놓고, 타일 사이를 화살표로 잇는다 */
export default function FlowSteps({ stages }: Props) {
  return (
    <Box className={s.flow}>
      {stages.map((stage, index) => (
        <Reveal key={stage.label} index={index + 1} className={s.stage}>
          <Box className={s.head}>
            <Text as="span" className={s.label}>
              {stage.label}
            </Text>
            {index < stages.length - 1 && (
              <Box as="span" className={s.arrow} aria-hidden>
                <ArrowRight size={16} />
              </Box>
            )}
          </Box>
          <Box className={s.chips}>
            {stage.items.map((item) => (
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

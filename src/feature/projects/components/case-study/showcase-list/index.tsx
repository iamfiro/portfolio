import type { CaseStudyShowcase } from "@/feature/projects/schema";
import { Image, Stack, Text } from "@/shared/components/ui";

import Reveal from "../reveal";

import s from "./style.module.scss";

interface Props {
  items: CaseStudyShowcase[];
}

export default function ShowcaseList({ items }: Props) {
  return (
    <Stack gap={32}>
      {items.map((item, index) => (
        <Reveal key={item.title} index={index + 1}>
          <Stack gap={12}>
            {item.imageUrl && (
              <Image src={item.imageUrl} alt={item.title} className={s.image} />
            )}
            <Text as="p" className={s.content}>
              <Text as="span" className={s.title}>
                {item.title}
              </Text>
              <Text as="span" size="sm" color="subtle" className={s.body}>
                {item.body}
              </Text>
            </Text>
          </Stack>
        </Reveal>
      ))}
    </Stack>
  );
}

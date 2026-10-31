import { Box, Image, List, ListItem, Text } from "@/shared/components/ui";
import type { StackItem } from "@/shared/constants";

import s from "./style.module.scss";

interface Props {
  item: StackItem;
}

/** 로고·이름 아래로 그 도구를 어디에 써 왔는지 적은 카드 */
export default function StackCard({ item }: Props) {
  return (
    <Box className={s.card}>
      <Box className={s.head}>
        <Box className={s.logo}>
          <Image
            src={item.icon}
            alt=""
            objectFit="contain"
            loading="lazy"
            className={item.invert ? s.inverted : undefined}
          />
        </Box>
        <Text as="span" className={s.name}>
          {item.name}
        </Text>
      </Box>

      <List gap={4} className={s.skills}>
        {item.skills.map((skill) => (
          <ListItem key={skill} className={s.skill}>
            {skill}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

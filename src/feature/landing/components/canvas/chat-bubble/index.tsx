import { Avatar, Box, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props {
  message: string;
  name?: string;
  time?: string;
  className?: string;
}

/** 캔버스 위에 떠 있는 코멘트 말풍선 */
export default function ChatBubble({
  message,
  name = "성주",
  time = "방금",
  className,
}: Props) {
  const bubbleClassName = [s.bubble, className].filter(Boolean).join(" ");

  return (
    <Box className={bubbleClassName} aria-hidden>
      <Avatar src="/me.png" name={name} size="sm" />
      <Box className={s.body}>
        <Text as="span" className={s.meta}>
          <Text as="strong" className={s.name}>
            {name}
          </Text>
          {time}
        </Text>
        <Text as="span" className={s.message}>
          {message}
        </Text>
      </Box>
    </Box>
  );
}

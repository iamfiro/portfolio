import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";

import { useLoopTick } from "@/feature/landing/hooks/use-loop-tick";
import { Box, Image, Text } from "@/shared/components/ui";
import { STACK_DATA, type StackItem } from "@/shared/constants";

import s from "./style.module.scss";

// STACK_DATA 순서: 프론트엔드, 백엔드, 애플리케이션
const WEB_STACK = STACK_DATA[0]?.items ?? [];
const APP_STACK = STACK_DATA[2]?.items ?? [];
const STEPS = Math.max(WEB_STACK.length, APP_STACK.length);
const TICK_MS = 2000;

interface ScreenProps {
  item: StackItem | undefined;
}

/** 화면 가운데 로고와 이름이 튀어나오며 바뀌는 칸 */
function StackScreen({ item }: ScreenProps) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {item && (
        <motion.div
          key={item.name}
          className={s.screen}
          initial={{ scale: 0.6, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.6, opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
        >
          <Box className={s.logo}>
            <Image
              src={item.icon}
              alt=""
              objectFit="contain"
              className={item.invert ? s.inverted : undefined}
            />
          </Box>
          <Text as="span" className={s.name}>
            {item.name}
          </Text>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** 브라우저 창엔 웹 스택이, 폰 화면엔 앱 스택이 같은 박자로 바뀐다 */
export default function CrossPlatformVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { tick } = useLoopTick(ref, STEPS, TICK_MS);

  return (
    <motion.div ref={ref} className={s.visual}>
      <Box className={s.browser}>
        <Box className={s.bar}>
          <Box as="span" className={s.light} />
          <Box as="span" className={s.light} />
          <Box as="span" className={s.light} />
        </Box>
        <Box className={s.viewport}>
          <StackScreen item={WEB_STACK[tick % WEB_STACK.length]} />
        </Box>
      </Box>

      <Box className={s.phone}>
        <Box as="span" className={s.notch} />
        <Box className={s.viewport}>
          <StackScreen item={APP_STACK[tick % APP_STACK.length]} />
        </Box>
      </Box>
    </motion.div>
  );
}

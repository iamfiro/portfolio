import { useEffect, useState } from "react";

import type {
  ReelTempo,
  ShowreelController,
} from "@/feature/showreel/showreel.type";
import { beatPosition } from "@/feature/showreel/utils/music.util";
import { Box, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props {
  controller: ShowreelController;
  tempo: ReelTempo;
}

/** HUD를 다시 그리는 간격(ms). 개발용이라 매 프레임까지 갱신하지 않는다 */
const REFRESH = 100;

/** 개발 서버에서만 보이는 쇼릴 위치 표시: 장면 · 마디.박 · 시각 */
export default function ShowreelHud({ controller, tempo }: Props) {
  const [time, setTime] = useState(controller.time);
  const [held, setHeld] = useState(controller.isHeld);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(controller.time());
      setHeld(controller.isHeld());
    }, REFRESH);
    return () => window.clearInterval(timer);
  }, [controller]);

  const scene =
    controller.slots.filter(({ start }) => start <= time).pop()?.id ?? "-";
  const { bar, beat } = beatPosition(time, tempo);

  return (
    <Box className={s.hud} aria-hidden>
      <Text as="span" size="xs" color="inverse">
        {held ? "❚❚" : "▶"} {scene} · {bar}.{beat} · {time.toFixed(2)}s /{" "}
        {controller.duration.toFixed(2)}s
      </Text>
      <Text as="span" size="xs" color="inverse" className={s.keys}>
        Space · ←→ 프레임 · ⇧←→ 박 · [ ] 장면 · ?reel=장면 · ?reel-at=초
      </Text>
    </Box>
  );
}

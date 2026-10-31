import { usePointerActivity } from "@/feature/landing/hooks/use-pointer-activity";
import { usePointerPosition } from "@/feature/landing/hooks/use-pointer-position";
import { Box } from "@/shared/components/ui";

import SectionMascot from "./section-mascot";
import type { SectionMascotKey } from "./section-mascots.type";
import { SECTION_MASCOT_SPOTS } from "./section-mascots.util";

import s from "./style.module.scss";

interface Props {
  section: SectionMascotKey;
  /**
   * "head"는 SectionHead 안에 깔려 제목 양옆에 앉고, 좁은 화면에선 제목 위로 비켜난다.
   * "free"는 섹션 상자 기준으로 정해진 자리에 그대로 앉는다
   */
  anchor?: "head" | "free";
  className?: string;
}

/** 섹션마다 몇 마리씩 앉아 있는 스마일 마스코트 층. 장식이라 보조 기술엔 숨긴다 */
export default function SectionMascots({
  section,
  anchor = "head",
  className,
}: Props) {
  const pointer = usePointerPosition();
  const { sleepy, startle, shake } = usePointerActivity();

  const layerClassName = [s.layer, s[anchor], className]
    .filter(Boolean)
    .join(" ");

  return (
    <Box className={layerClassName} aria-hidden>
      {SECTION_MASCOT_SPOTS[section].map((spot, index) => (
        <SectionMascot
          key={spot.id}
          spot={spot}
          index={index}
          pointer={pointer}
          sleepy={sleepy}
          startle={startle}
          shake={shake}
        />
      ))}
    </Box>
  );
}

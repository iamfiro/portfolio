import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import { usePointerActivity } from "@/feature/landing/hooks/use-pointer-activity";
import { usePointerPosition } from "@/feature/landing/hooks/use-pointer-position";
import { Box } from "@/shared/components/ui";

import { FOOTER_CROWD } from "../footer.util";

import CrowdMember from "./crowd-member";

import s from "./style.module.scss";

/** 페이지 맨 끝, 히어로의 스마일들이 바닥에서 줄지어 고개를 내밀고 배웅한다 */
export default function FooterCrowd() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const pointer = usePointerPosition();
  const { sleepy, shake } = usePointerActivity();

  return (
    // Box는 ref를 넘기지 않아, 등장 감지용 ref는 motion.div에 단다
    <motion.div ref={ref} className={s.crowd} aria-hidden>
      <Box className={s.row}>
        {FOOTER_CROWD.map((member, index) => (
          <CrowdMember
            key={member.id}
            member={member}
            index={index}
            inView={inView}
            pointer={pointer}
            sleepy={sleepy}
            shake={shake}
          />
        ))}
      </Box>
    </motion.div>
  );
}

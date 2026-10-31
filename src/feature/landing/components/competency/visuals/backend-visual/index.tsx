import { AnimatePresence, motion } from "framer-motion";
import { type LucideIcon, Server, Smartphone } from "lucide-react";
import { type CSSProperties, useRef } from "react";

import { useLoopTick } from "@/feature/landing/hooks/use-loop-tick";
import { Box, Image, Text } from "@/shared/components/ui";

import {
  type BackendTarget,
  NODE_POSITION,
  REQUEST_TARGETS,
  TARGET_CAPTION,
  TRAVEL_SECONDS,
} from "./backend-visual.util";

import s from "./style.module.scss";

const TICK_MS = 2200;

interface NodeData {
  key: keyof typeof NODE_POSITION;
  label: string;
  icon?: LucideIcon;
  logo?: string;
}

const NODES: NodeData[] = [
  { key: "app", label: "앱", icon: Smartphone },
  { key: "api", label: "API", icon: Server },
  { key: "redis", label: "Redis", logo: "/icon/stack/redis.svg" },
  { key: "mysql", label: "MySQL", logo: "/icon/stack/mysql.svg" },
];

const toPercent = (value: number) => `${value}%`;

/** 앱 요청이 API를 거쳐 Redis 또는 MySQL로 흐르고, 닿은 곳이 반짝인다 */
export default function BackendVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const { tick, isInView } = useLoopTick(ref, REQUEST_TARGETS.length, TICK_MS);
  const target: BackendTarget = REQUEST_TARGETS[tick];
  const { app, api } = NODE_POSITION;
  const end = NODE_POSITION[target];

  return (
    <motion.div ref={ref} className={s.visual}>
      <svg className={s.wires} viewBox="0 0 100 100" preserveAspectRatio="none">
        {(["redis", "mysql"] as const).map((key) => (
          <path
            key={key}
            d={`M${app.x} ${app.y} L${api.x} ${api.y} L${NODE_POSITION[key].x} ${NODE_POSITION[key].y}`}
          />
        ))}
      </svg>

      {NODES.map(({ key, label, icon: Icon, logo }) => (
        <motion.div
          // 같은 곳에 연달아 닿아도 반짝임이 다시 재생되도록 요청마다 새로 그린다
          key={key === target ? `${key}-${tick}` : key}
          className={s.node}
          style={
            {
              "--x": toPercent(NODE_POSITION[key].x),
              "--y": toPercent(NODE_POSITION[key].y),
            } as CSSProperties
          }
          animate={
            isInView && key === target ? { scale: [1, 1.18, 1] } : { scale: 1 }
          }
          transition={{ duration: 0.45, delay: TRAVEL_SECONDS }}
        >
          <Box
            className={[s.badge, isInView && key === target && s.hit]
              .filter(Boolean)
              .join(" ")}
          >
            {Icon && <Icon size={18} />}
            {logo && <Image src={logo} alt="" objectFit="contain" />}
          </Box>
          <Text as="span" className={s.label}>
            {label}
          </Text>
        </motion.div>
      ))}

      {isInView && (
        <motion.span
          key={tick}
          className={s.packet}
          initial={{
            left: toPercent(app.x),
            top: toPercent(app.y),
            opacity: 1,
          }}
          animate={{
            left: [app.x, api.x, end.x].map(toPercent),
            top: [app.y, api.y, end.y].map(toPercent),
            opacity: [1, 1, 0],
          }}
          transition={{ duration: TRAVEL_SECONDS, ease: "easeInOut" }}
        />
      )}

      <Box className={s.caption}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={target}
            className={s.captionText}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.4, delay: TRAVEL_SECONDS }}
          >
            {TARGET_CAPTION[target]}
          </motion.span>
        </AnimatePresence>
      </Box>
    </motion.div>
  );
}

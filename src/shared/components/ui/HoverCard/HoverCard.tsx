import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import type { StyleProps } from "@/shared/types/component-common";

import { cn, NOOP } from "../_utils";
import { Text } from "../Text/Text";

import styles from "./HoverCard.module.scss";

const EDGE_PADDING = 8;
const MAX_ROTATION = 3;
const ROTATION_FACTOR = 0.3;
const ENTER_LIFT = 10;
const ENTER_SCALE = 0.92;
const EXIT_SCALE = 0.96;

type HoverCardData = {
  title: string;
  /** 제목 아래에 한 줄씩 나열되는 설명 */
  items?: string[];
};

type HoverCardContextValue = {
  show: (data: HoverCardData) => void;
  move: (event: React.MouseEvent) => void;
  hide: () => void;
};

const EMPTY_CONTEXT: HoverCardContextValue = {
  show: NOOP,
  move: NOOP,
  hide: NOOP,
};

const HoverCardContext = createContext<HoverCardContextValue>(EMPTY_CONTEXT);

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function buildTransform(
  x: number,
  y: number,
  rotation: number,
  scale: number,
): string {
  return `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`;
}

type HoverCardProps = {
  /** 커서와 카드 사이의 세로 간격 (px) */
  offset?: number;
  children?: React.ReactNode;
} & StyleProps &
  React.HTMLAttributes<HTMLDivElement>;

function HoverCard({
  offset = 20,
  className,
  style,
  children,
  onMouseLeave,
  ...rest
}: HoverCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lastClientX = useRef(0);
  const lastPoint = useRef({ x: 0, y: 0 });
  const isVisible = useRef(false);

  const [data, setData] = useState<HoverCardData | null>(null);

  const show = useCallback((next: HoverCardData) => {
    isVisible.current = false;
    if (cardRef.current) cardRef.current.style.opacity = "0";
    setData(next);
  }, []);

  const move = useCallback((event: React.MouseEvent) => {
    const root = rootRef.current;
    const card = cardRef.current;
    if (!root || !card) return;

    const rect = root.getBoundingClientRect();
    const half = card.offsetWidth / 2;
    const minX = half + EDGE_PADDING;
    const maxX = Math.max(minX, rect.width - half - EDGE_PADDING);

    const x = clamp(event.clientX - rect.left, minX, maxX);
    const y = event.clientY - rect.top;

    const deltaX = event.clientX - lastClientX.current;
    lastClientX.current = event.clientX;
    const rotation = clamp(
      deltaX * ROTATION_FACTOR,
      -MAX_ROTATION,
      MAX_ROTATION,
    );

    lastPoint.current = { x, y };

    // 처음 나타날 때는 이전 위치에서 미끄러지지 않도록,
    // 트랜지션 없이 살짝 작고 아래쪽인 상태를 잡아둔 뒤 제자리로 떠오르게 한다
    if (!isVisible.current) {
      card.style.transition = "none";
      card.style.transform = buildTransform(x, y + ENTER_LIFT, 0, ENTER_SCALE);
      void card.offsetWidth;
      card.style.transition = "";

      isVisible.current = true;
      card.style.opacity = "1";
    }

    card.style.transform = buildTransform(x, y, rotation, 1);
  }, []);

  const hide = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    isVisible.current = false;
    card.style.opacity = "0";
    card.style.transform = buildTransform(
      lastPoint.current.x,
      lastPoint.current.y + ENTER_LIFT,
      0,
      EXIT_SCALE,
    );
  }, []);

  return (
    <HoverCardContext.Provider value={{ show, move, hide }}>
      <div
        ref={rootRef}
        className={cn(styles.root, className)}
        style={
          {
            "--hover-card-offset": `${offset}px`,
            ...style,
          } as React.CSSProperties
        }
        onMouseLeave={(event) => {
          hide();
          onMouseLeave?.(event);
        }}
        {...rest}
      >
        {children}

        <div ref={cardRef} className={styles.card} aria-hidden="true">
          <Text as="span" className={styles.title}>
            {data?.title ?? ""}
          </Text>
          {data?.items?.map((item) => (
            <Text as="span" key={item} className={styles.item}>
              {item}
            </Text>
          ))}
        </div>
      </div>
    </HoverCardContext.Provider>
  );
}

type HoverCardTriggerProps = {
  card: HoverCardData;
  children?: React.ReactNode;
} & StyleProps &
  React.HTMLAttributes<HTMLDivElement>;

function HoverCardTrigger({
  card,
  className,
  style,
  children,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  ...rest
}: HoverCardTriggerProps) {
  const { show, move, hide } = useContext(HoverCardContext);

  return (
    <div
      className={cn(styles.trigger, className)}
      style={style}
      onMouseEnter={(event) => {
        show(card);
        onMouseEnter?.(event);
      }}
      onMouseMove={(event) => {
        move(event);
        onMouseMove?.(event);
      }}
      onMouseLeave={(event) => {
        hide();
        onMouseLeave?.(event);
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export { HoverCard, HoverCardTrigger };
export type { HoverCardData, HoverCardProps, HoverCardTriggerProps };

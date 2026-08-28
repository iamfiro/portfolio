import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import type { StyleProps } from "@/shared/types/component-common";

import { cn, NOOP } from "../_utils";
import { Image } from "../Image/Image";
import { Text } from "../Text/Text";

import styles from "./HoverPreview.module.scss";

const EDGE_PADDING = 8;
const MAX_ROTATION = 3;
const ROTATION_FACTOR = 0.3;
const ENTER_LIFT = 10;
const ENTER_SCALE = 0.92;
const EXIT_SCALE = 0.96;

type HoverPreviewData = {
  title: string;
  subtext?: string;
  imageUrl?: string | null;
};

type HoverPreviewContextValue = {
  show: (data: HoverPreviewData) => void;
  move: (event: React.MouseEvent) => void;
  hide: () => void;
};

const EMPTY_CONTEXT: HoverPreviewContextValue = {
  show: NOOP,
  move: NOOP,
  hide: NOOP,
};

const HoverPreviewContext =
  createContext<HoverPreviewContextValue>(EMPTY_CONTEXT);

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

type HoverPreviewProps = {
  /** 커서와 프리뷰 카드 사이의 세로 간격 (px) */
  offset?: number;
  children?: React.ReactNode;
} & StyleProps &
  React.HTMLAttributes<HTMLDivElement>;

function HoverPreview({
  offset = 24,
  className,
  style,
  children,
  onMouseLeave,
  ...rest
}: HoverPreviewProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const lastClientX = useRef(0);
  const lastPoint = useRef({ x: 0, y: 0 });
  const isVisible = useRef(false);

  const [data, setData] = useState<HoverPreviewData | null>(null);

  const show = useCallback((next: HoverPreviewData) => {
    isVisible.current = false;
    if (previewRef.current) previewRef.current.style.opacity = "0";
    setData(next);
  }, []);

  const move = useCallback((event: React.MouseEvent) => {
    const root = rootRef.current;
    const preview = previewRef.current;
    if (!root || !preview) return;

    const rect = root.getBoundingClientRect();
    const half = preview.offsetWidth / 2;
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
      preview.style.transition = "none";
      preview.style.transform = buildTransform(
        x,
        y + ENTER_LIFT,
        0,
        ENTER_SCALE,
      );
      void preview.offsetWidth;
      preview.style.transition = "";

      isVisible.current = true;
      preview.style.opacity = "1";
    }

    preview.style.transform = buildTransform(x, y, rotation, 1);
  }, []);

  const hide = useCallback(() => {
    const preview = previewRef.current;
    if (!preview) return;

    isVisible.current = false;
    preview.style.opacity = "0";
    preview.style.transform = buildTransform(
      lastPoint.current.x,
      lastPoint.current.y + ENTER_LIFT,
      0,
      EXIT_SCALE,
    );
  }, []);

  return (
    <HoverPreviewContext.Provider value={{ show, move, hide }}>
      <div
        ref={rootRef}
        className={cn(styles.root, className)}
        style={
          {
            "--hover-preview-offset": `${offset}px`,
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

        <div
          ref={previewRef}
          className={cn(styles.preview, !data?.imageUrl && styles.textOnly)}
          aria-hidden="true"
        >
          {data?.imageUrl ? (
            <div className={styles.imageFrame}>
              <Image
                src={data.imageUrl}
                alt=""
                responsive
                sizes="300px"
                className={styles.image}
              />
            </div>
          ) : null}

          <div className={styles.meta}>
            <Text as="span" className={styles.title}>
              {data?.title ?? ""}
            </Text>
            {data?.subtext ? (
              <Text as="span" className={styles.subtext}>
                {data.subtext}
              </Text>
            ) : null}
          </div>
        </div>
      </div>
    </HoverPreviewContext.Provider>
  );
}

type HoverPreviewTriggerProps = {
  preview: HoverPreviewData;
  children?: React.ReactNode;
} & StyleProps &
  React.HTMLAttributes<HTMLDivElement>;

function HoverPreviewTrigger({
  preview,
  className,
  style,
  children,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  ...rest
}: HoverPreviewTriggerProps) {
  const { show, move, hide } = useContext(HoverPreviewContext);

  return (
    <div
      className={cn(styles.trigger, className)}
      style={style}
      onMouseEnter={(event) => {
        show(preview);
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

export { HoverPreview, HoverPreviewTrigger };
export type { HoverPreviewData, HoverPreviewProps, HoverPreviewTriggerProps };

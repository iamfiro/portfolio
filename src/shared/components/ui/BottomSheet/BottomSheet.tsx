import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "../_utils";
import { FocusLock } from "../FocusLock/FocusLock.tsx";

import styles from "./BottomSheet.module.scss";

const CLOSE_DURATION = 200;

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  className?: string;
}

function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  const [isVisible, setIsVisible] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setIsClosing(false);
      setIsVisible(true);
    } else if (isVisible) {
      setIsClosing(true);
      closeTimer.current = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, CLOSE_DURATION);
    }
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [open]);

  useEffect(() => {
    if (!isVisible) return;

    // iOS Safari는 overflow:hidden만으론 배경 스크롤이 막히지 않아 position:fixed로 고정
    const scrollY = window.scrollY;
    const { overflow, position, top, width } = document.body.style;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.width = width;
      window.scrollTo(0, scrollY);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return createPortal(
    <div className={cn(styles.backdrop, isClosing && styles.closing)} onClick={onClose}>
      <FocusLock>
        <div
          className={cn(styles.sheet, isClosing && styles.closing, className)}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.handle} />
          {title && (
            <div className={styles.header}>
              <span className={styles.title}>{title}</span>
              <button
                className={styles.close}
                onClick={onClose}
                type="button"
                aria-label="닫기"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className={styles.body}>{children}</div>
        </div>
      </FocusLock>
    </div>,
    document.body,
  );
}

export { BottomSheet };
export type { BottomSheetProps };

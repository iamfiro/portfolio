import { useEffect, useRef } from "react";

/**
 * 브라우저 탭 title에 타이핑/지우기 애니메이션을 적용하는 훅
 * 페이지 포커스를 잃으면 애니메이션을 멈추고, 복귀 시 원래 title로 복구 후 재시작
 */
export function useTypingTitle(text: string, typingSpeed = 150, deleteSpeed = 100, pauseDuration = 500) {
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const firstSpaceIndex = text.indexOf(" ");
    const minIndex = Math.max(1, firstSpaceIndex > 0 ? firstSpaceIndex : 1);
    const maxIndex = text.length;

    let index = minIndex;
    let isDeleting = false;
    let lastTime = 0;
    let active = true;

    const setTitle = (nextIndex: number) => {
      if (!active) return;
      index = Math.min(Math.max(nextIndex, minIndex), maxIndex);
      document.title = text.slice(0, index);
    };

    const stopAnimation = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const animate = (timestamp: number) => {
      if (!active) return;

      const delay = isDeleting ? deleteSpeed : typingSpeed;

      if (timestamp - lastTime >= delay) {
        if (!isDeleting) {
          setTitle(index + 1);

          if (index >= maxIndex) {
            isDeleting = true;
            lastTime = timestamp + pauseDuration - delay;
          } else {
            lastTime = timestamp;
          }
        } else {
          if (index <= minIndex) {
            isDeleting = false;
            lastTime = timestamp + pauseDuration - delay;
          } else {
            setTitle(index - 1);
            lastTime = timestamp;
          }
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      stopAnimation();
      active = true;
      frameRef.current = requestAnimationFrame(animate);
    };

    const handleFocusLost = () => {
      active = false;
      stopAnimation();
      document.title = text;
      index = maxIndex;
    };

    const handleFocusGain = () => {
      isDeleting = true;
      lastTime = 0;
      startAnimation();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleFocusLost();
      } else {
        handleFocusGain();
      }
    };

    setTitle(index);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleFocusLost);
    window.addEventListener("focus", handleFocusGain);
    startAnimation();

    return () => {
      active = false;
      stopAnimation();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleFocusLost);
      window.removeEventListener("focus", handleFocusGain);
    };
  }, [text, typingSpeed, deleteSpeed, pauseDuration]);
}

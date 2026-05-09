import { useEffect, useRef } from "react";

/**
 * 브라우저 탭 title에 타이핑/지우기 애니메이션을 적용하는 훅
 * 페이지 포커스를 잃으면 애니메이션을 멈추고, 복귀 시 원래 title로 복구 후 재시작
 */
export function useTypingTitle(text: string, typingSpeed = 150, deleteSpeed = 100, pauseDuration = 1500) {
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const firstSpaceIndex = text.indexOf(" ");
    const minIndex = firstSpaceIndex > 0 ? firstSpaceIndex : 1;

    let index = 0;
    let isDeleting = false;
    let lastTime = 0;

    const startAnimation = () => {
      const animate = (timestamp: number) => {
        const delay = isDeleting ? deleteSpeed : typingSpeed;

        if (timestamp - lastTime >= delay) {
          if (!isDeleting) {
            index++;
            document.title = text.slice(0, index);

            if (index === text.length) {
              isDeleting = true;
              lastTime = timestamp + pauseDuration - delay;
              frameRef.current = requestAnimationFrame(animate);
              return;
            }
          } else {
            index--;
            document.title = text.slice(0, index);

            if (index <= minIndex) {
              isDeleting = false;
              lastTime = timestamp + pauseDuration - delay;
              frameRef.current = requestAnimationFrame(animate);
              return;
            }
          }

          lastTime = timestamp;
        }

        frameRef.current = requestAnimationFrame(animate);
      };

      frameRef.current = requestAnimationFrame(animate);
    };

    const stopAnimation = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        document.title = text;
        index = text.length;
        isDeleting = true;
        lastTime = 0;
        startAnimation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    startAnimation();

    return () => {
      stopAnimation();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [text, typingSpeed, deleteSpeed, pauseDuration]);
}

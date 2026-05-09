import { useEffect, useRef } from "react";

/**
 * 브라우저 탭 title에 타이핑/지우기 애니메이션을 적용하는 훅
 */
export function useTypingTitle(text: string, typingSpeed = 150, deleteSpeed = 100, pauseDuration = 1500) {
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    let lastTime = 0;

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
          document.title = text.slice(0, index) || "\u200B";

          if (index === 0) {
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

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [text, typingSpeed, deleteSpeed, pauseDuration]);
}

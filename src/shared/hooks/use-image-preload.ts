import { useEffect, useRef, useState } from "react";

interface ImagePreloadState {
  progress: number;
  loaded: boolean;
}

/**
 * 현재 페이지의 모든 img 요소 로딩 진행률을 추적하는 훅.
 * DOM이 안정화된 후 이미지를 수집하고, 진행률(0~100)과 완료 여부를 반환.
 * 이미지가 없으면 즉시 100% 반환.
 */
export function useImagePreload(): ImagePreloadState {
  const [state, setState] = useState<ImagePreloadState>({
    progress: 0,
    loaded: false,
  });
  const checkedRef = useRef(false);

  useEffect(() => {
    if (checkedRef.current) return;

    const frameId = requestAnimationFrame(() => {
      checkedRef.current = true;
      const images = Array.from(document.querySelectorAll("img"));

      if (images.length === 0) {
        setState({ progress: 100, loaded: true });
        return;
      }

      const total = images.length;
      const alreadyLoaded = images.filter((img) => img.complete).length;

      if (alreadyLoaded === total) {
        setState({ progress: 100, loaded: true });
        return;
      }

      let loadedCount = alreadyLoaded;
      setState({
        progress: Math.round((loadedCount / total) * 100),
        loaded: false,
      });

      const pendingImages = images.filter((img) => !img.complete);

      const onDone = () => {
        loadedCount += 1;
        const progress = Math.round((loadedCount / total) * 100);
        setState({
          progress,
          loaded: loadedCount >= total,
        });
      };

      pendingImages.forEach((img) => {
        img.addEventListener("load", onDone);
        img.addEventListener("error", onDone);
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  return state;
}

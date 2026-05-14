import { useEffect, useState } from "react";

interface ImagePreloadState {
  progress: number;
  loaded: boolean;
}

/**
 * 페이지 내 모든 img 요소 로딩 진행률을 추적하는 훅.
 * MutationObserver로 API 데이터로 동적 추가되는 이미지도 포함해 추적.
 */
export function useImagePreload(): ImagePreloadState {
  const [state, setState] = useState<ImagePreloadState>({
    progress: 0,
    loaded: false,
  });

  useEffect(() => {
    const tracked = new Set<HTMLImageElement>();
    const loadedSet = new Set<HTMLImageElement>();

    const updateProgress = () => {
      const total = tracked.size;
      const loaded = loadedSet.size;

      if (total === 0) {
        setState({ progress: 100, loaded: true });
        return;
      }

      setState({
        progress: Math.round((loaded / total) * 100),
        loaded: loaded >= total,
      });
    };

    const trackImage = (img: HTMLImageElement) => {
      if (tracked.has(img)) return;
      tracked.add(img);

      if (img.complete) {
        loadedSet.add(img);
      } else {
        const onDone = () => {
          loadedSet.add(img);
          img.removeEventListener("load", onDone);
          img.removeEventListener("error", onDone);
          updateProgress();
        };
        img.addEventListener("load", onDone);
        img.addEventListener("error", onDone);
      }
    };

    document
      .querySelectorAll("img")
      .forEach((img) => trackImage(img as HTMLImageElement));
    updateProgress();

    // API 데이터로 동적 추가되는 이미지 감지
    const observer = new MutationObserver((mutations) => {
      let found = false;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLImageElement) {
            trackImage(node);
            found = true;
          } else if (node instanceof Element) {
            node.querySelectorAll("img").forEach((img) => {
              trackImage(img as HTMLImageElement);
              found = true;
            });
          }
        }
      }
      if (found) updateProgress();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return state;
}

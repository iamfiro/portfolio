import gsap from "gsap";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ReelMusic, ReelMusicChange } from "../showreel.type";
import { SHOWREEL_MUSIC } from "../utils/music.util";

const PREFERENCE_KEY = "showreel-sound";

/** 이 속성이 달린 요소(소리 토글)를 누를 땐 전역 첫 입력으로 소리를 허락하지 않고 토글이 직접 처리한다 */
export const SOUND_TOGGLE_ATTRIBUTE = "data-sound-toggle";

function readPreference() {
  try {
    return localStorage.getItem(PREFERENCE_KEY) !== "off";
  } catch {
    return true;
  }
}

function writePreference(on: boolean) {
  try {
    localStorage.setItem(PREFERENCE_KEY, on ? "on" : "off");
  } catch {
    // 저장하지 못해도 이번 방문 동안은 그대로 동작한다
  }
}

/**
 * 쇼릴 플레이어의 사운드 트랙. 언제 재생할지는 쇼릴 타임라인이 정하고, 이 훅은
 * 소리를 낼 수 있는지(사용자가 켰는지 + 브라우저가 허락했는지)와 재생 위치를 다룬다.
 * 브라우저는 상호작용 전 소리를 막으므로 첫 클릭·탭·키 입력에서 허락을 얻고 쇼릴에 알린다.
 */
export function useShowreelAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const listenersRef = useRef(new Set<(change: ReelMusicChange) => void>());
  const [enabled, setEnabled] = useState(readPreference);
  const [unlocked, setUnlocked] = useState(false);
  const enabledRef = useRef(enabled);
  const unlockedRef = useRef(false);

  // 구독자(쇼릴)가 같은 사용자 입력 안에서 바로 play()를 부르도록 동기적으로 알린다
  const notify = useCallback((change: ReelMusicChange) => {
    listenersRef.current.forEach((listener) => listener(change));
  }, []);

  const unlock = useCallback(() => {
    if (unlockedRef.current) return false;
    unlockedRef.current = true;
    setUnlocked(true);
    return true;
  }, []);

  useEffect(() => {
    const audio = new window.Audio(SHOWREEL_MUSIC.src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    const removeUnlock = () => {
      window.removeEventListener("pointerdown", handleFirstInput, true);
      window.removeEventListener("keydown", handleFirstInput, true);
    };
    const handleFirstInput = (event: Event) => {
      const fromToggle =
        event.target instanceof Element &&
        event.target.closest(`[${SOUND_TOGGLE_ATTRIBUTE}]`);
      if (fromToggle) return;

      removeUnlock();
      if (unlock()) notify("unlock");
    };
    window.addEventListener("pointerdown", handleFirstInput, true);
    window.addEventListener("keydown", handleFirstInput, true);

    return () => {
      removeUnlock();
      gsap.killTweensOf(audio);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, [notify, unlock]);

  const on = enabled && unlocked;

  const toggle = useCallback(() => {
    const next = !(enabledRef.current && unlockedRef.current);
    enabledRef.current = next;
    setEnabled(next);
    writePreference(next);

    const firstUnlock = unlock();
    notify(firstUnlock && next ? "unlock" : "toggle");
  }, [notify, unlock]);

  const track = useMemo<ReelMusic>(() => {
    let anchorTime = -1;
    let anchorAt = 0;

    return {
      canPlay: () => enabledRef.current && unlockedRef.current,
      now() {
        const audio = audioRef.current;
        if (!audio || audio.paused) return null;

        // currentTime이 거칠게 갱신되는 브라우저에서도 매끄럽도록, 마지막 갱신 뒤 흐른 시간을 더한다
        const now = performance.now();
        if (audio.currentTime !== anchorTime) {
          anchorTime = audio.currentTime;
          anchorAt = now;
        }
        return anchorTime + (now - anchorAt) / 1000;
      },
      play(at) {
        const audio = audioRef.current;
        if (!audio) return;

        audio.currentTime = at;
        audio.play().catch(() => undefined);
        // 처음 켤 때만 소리를 서서히 올리고, 멈췄다 이어 틀 땐 원래 크기로 바로 낸다
        if (audio.volume < SHOWREEL_MUSIC.volume) {
          gsap.to(audio, {
            volume: SHOWREEL_MUSIC.volume,
            duration: SHOWREEL_MUSIC.fadeIn,
            ease: "sine.out",
          });
        }
      },
      pause() {
        audioRef.current?.pause();
      },
      seek(seconds) {
        const audio = audioRef.current;
        if (audio) audio.currentTime = seconds;
      },
      subscribe(listener) {
        listenersRef.current.add(listener);
        return () => listenersRef.current.delete(listener);
      },
    };
  }, []);

  return { on, toggle, track };
}

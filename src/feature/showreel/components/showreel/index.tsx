import { useReducedMotion } from "framer-motion";
import { useMemo } from "react";

import {
  readShowreelDevParams,
  useShowreel,
  useShowreelAudio,
  useShowreelDevControls,
} from "@/feature/showreel/hooks";
import { SHOWREEL_SCENES, SHOWREEL_STILL } from "@/feature/showreel/scenes";
import { SHOWREEL_MUSIC } from "@/feature/showreel/utils/music.util";

import ShowreelHud from "../showreel-hud";
import SoundToggle from "../sound-toggle";

import s from "./style.module.scss";

interface Props {
  className?: string;
}

/**
 * 쇼릴 플레이어. 장면 영상(WebGL2)과 음악이 한 타임라인으로 함께 재생되고,
 * 음소거 버튼은 그 플레이어의 소리만 켜고 끈다.
 * WebGL2가 없으면 아무것도 그리지 않고 부모 배경색만 남긴다.
 */
export default function Showreel({ className }: Props) {
  const reducedMotion = useReducedMotion();
  const music = useShowreelAudio();
  const dev = useMemo(readShowreelDevParams, []);
  const scenes = useMemo(() => {
    const solo = SHOWREEL_SCENES.filter(({ id }) => id === dev.solo);
    return solo.length > 0 ? solo : SHOWREEL_SCENES;
  }, [dev.solo]);

  const { canvasRef, supported, controller } = useShowreel({
    scenes,
    tempo: SHOWREEL_MUSIC.tempo,
    music: music.track,
    still: SHOWREEL_STILL,
  });
  useShowreelDevControls(controller, SHOWREEL_MUSIC.tempo, dev.at);

  if (!supported) return null;

  const canvasClassName = [s.canvas, className].filter(Boolean).join(" ");

  return (
    <>
      {/* 디자인 시스템에 캔버스 추상화가 없어 WebGL 표면은 canvas를 직접 쓴다 */}
      <canvas
        ref={canvasRef}
        className={canvasClassName}
        width={0}
        height={0}
        aria-hidden
      />
      {/* 모션 줄이기면 쇼릴이 멈춘 한 장면이라 소리도 내지 않는다 */}
      {!reducedMotion && (
        <SoundToggle
          on={music.on}
          onToggle={music.toggle}
          className={s.sound}
        />
      )}
      {import.meta.env.DEV && controller && (
        <ShowreelHud controller={controller} tempo={SHOWREEL_MUSIC.tempo} />
      )}
    </>
  );
}

import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

import type {
  ReelMusic,
  ReelScene,
  ReelSceneRenderer,
  ReelTempo,
  ShowreelController,
} from "../showreel.type";
import { createShowreel } from "../utils/showreel.util";

/** 전체 화면 셰이더라 픽셀 밀도를 낮게 잡아 부하를 줄인다 */
const MAX_PIXEL_RATIO = 1.5;
/** 0초에 찍힌 키가 바로 그려지도록 아주 조금 앞으로 옮겨 둔다 */
const START_EPSILON = 1e-4;

interface Options {
  scenes: ReelScene[];
  tempo: ReelTempo;
  /** 쇼릴 재생에 묶을 음악 트랙 */
  music?: ReelMusic;
  /** 모션 줄이기일 때 멈춰 보여줄 장면과 그 안의 위치(0~1) */
  still: { scene: string; progress: number };
}

/**
 * 장면 목록으로 마스터 타임라인을 만들고 WebGL2 캔버스에 그리는 쇼릴 플레이어.
 * 매 틱마다 지금 시각의 장면 렌더러 하나만 그린다.
 *
 * 음악은 플레이어의 사운드 트랙이다. 재생 위치는 언제나 '첫 박 + 쇼릴 시각'이고,
 * 쇼릴이 재생될 때만 함께 재생된다. 화면 밖·탭 숨김·개발용 붙잡기로 쇼릴이 멈추면 음악도 멈추고,
 * 쇼릴을 옮기면 음악도 같은 자리로, 쇼릴이 한 바퀴 돌면 음악도 구간 처음으로 돌아간다.
 * 재생 중엔 끊김 없는 소리를 위해 쇼릴이 음악 시계에 미세하게 맞춘다.
 */
export function useShowreel({ scenes, tempo, music, still }: Options) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const [supported, setSupported] = useState(true);
  const [controller, setController] = useState<ShowreelController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) {
      setSupported(false);
      return;
    }

    const reel = createShowreel(scenes, tempo);
    let renderers: Map<string, ReelSceneRenderer<unknown>>;
    try {
      // 첫 컷에서 셰이더를 컴파일하느라 멈칫하지 않도록 장면 렌더러를 미리 다 만든다
      renderers = new Map(
        scenes.map((scene) => [scene.id, scene.createRenderer(gl)]),
      );
    } catch {
      reel.master.kill();
      setSupported(false);
      return;
    }

    let visible = false;
    let held = false;
    let ticking = false;
    // 글꼴·그림을 다 받기 전엔 그리지 않고 재생도 시작하지 않는다
    let loaded = false;
    let disposed = false;

    const playing = () =>
      loaded && !reducedMotion && visible && !held && !document.hidden;

    const draw = () => {
      if (!loaded) return;
      const { scene, state } = reel.sceneAt(reel.master.time());
      renderers.get(scene.id)?.draw(state);
    };

    /** 쇼릴이 재생 중이고 소리를 낼 수 있을 때만 음악을 쇼릴 자리에서 튼다 */
    const syncMusic = () => {
      if (!music) return;

      const shouldPlay = playing() && music.canPlay();
      const isPlaying = music.now() !== null;
      if (shouldPlay && !isPlaying) {
        music.play(reel.musicTimeAt(reel.master.time()));
      } else if (!shouldPlay && isPlaying) {
        music.pause();
      }
    };

    const tick = () => {
      const now = music?.now() ?? null;
      if (music && now !== null) {
        const reelTime = reel.reelTimeAt(now);
        // 쇼릴이 한 바퀴 돌아 음악이 구간을 벗어나면 음악을 쇼릴 자리로 되돌린다
        if (reelTime === null) {
          music.seek(reel.musicTimeAt(reel.master.time()));
        } else {
          reel.follow(reelTime);
        }
      }
      draw();
    };

    /** 보임·숨김·붙잡기 상태가 바뀔 때마다 타임라인, 렌더 루프, 음악을 한꺼번에 맞춘다 */
    const update = () => {
      if (playing()) reel.master.play();
      else reel.master.pause();

      const shouldTick = !reducedMotion && visible && !document.hidden;
      if (shouldTick && !ticking) gsap.ticker.add(tick);
      if (!shouldTick && ticking) gsap.ticker.remove(tick);
      ticking = shouldTick;

      syncMusic();
    };

    const seek = (seconds: number) => {
      const time = gsap.utils.wrap(0, reel.duration, seconds);
      reel.master.time(time + START_EPSILON);
      music?.seek(reel.musicTimeAt(time));
      draw();
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      draw();
    };

    const stillSlot =
      reel.slots.find(({ id }) => id === still.scene) ?? reel.slots[0];
    seek(
      reducedMotion ? stillSlot.start + stillSlot.duration * still.progress : 0,
    );

    const start = () => {
      if (disposed) return;
      loaded = true;
      draw();
      update();
    };
    Promise.all([...renderers.values()].map(({ ready }) => ready))
      .then(start)
      // 글꼴이나 그림을 못 받아도 대체 글꼴로 그리며 시작한다
      .catch(start);

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", update);

    // 첫 상호작용으로 소리가 처음 허락되면 쇼릴을 처음부터 음악과 함께 시작한다
    const unsubscribe = music?.subscribe((change) => {
      if (change === "unlock" && music.canPlay()) seek(0);
      syncMusic();
    });

    setController({
      duration: reel.duration,
      slots: reel.slots,
      time: () => reel.master.time(),
      isHeld: () => held,
      hold() {
        held = true;
        update();
      },
      release() {
        held = false;
        update();
      },
      seek,
    });

    return () => {
      disposed = true;
      unsubscribe?.();
      document.removeEventListener("visibilitychange", update);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      gsap.ticker.remove(tick);
      music?.pause();
      reel.master.kill();
      renderers.forEach((renderer) => renderer.dispose());
      setController(null);
    };
  }, [scenes, tempo, music, still, reducedMotion]);

  return { canvasRef, supported, controller };
}

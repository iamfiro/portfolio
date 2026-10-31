import type { ReelBox, ReelFrame } from "@/feature/showreel/stage.type";
import {
  BEAT,
  EASE,
  lerpBox,
  progress,
  REVEAL_SECONDS,
  SNAP_SECONDS,
} from "@/feature/showreel/utils/motion.util";
import { REEL_PALETTE, rgba } from "@/feature/showreel/utils/palette.util";
import type { ReelStage } from "@/feature/showreel/utils/stage.util";
import { acquireStage } from "@/feature/showreel/utils/stage.util";

import { projectFrameBox } from "../projects/reel-projects.util";
import {
  buildClock,
  drawCaption,
  hasStarted,
  lineMask,
  rise,
  sceneStart,
  sink,
} from "../scene.util";

import type { TaglineLayout, TaglineSceneState } from "./tagline.type";

const INK = rgba(REEL_PALETTE.ink);
const WHITE = rgba(REEL_PALETTE.white);

/** 가로는 두 줄, 세로는 어절이 끊기지 않게 네 줄로 나눈다 */
const LINES = {
  landscape: ["불편함을 기회로 바꾸는", "서비스를 만들고 경험을 설계합니다"],
  portrait: [
    "불편함을 기회로",
    "바꾸는 서비스를",
    "만들고 경험을",
    "설계합니다",
  ],
} as const;
/** 줄마다 올라오기 시작하는 박 */
const LINE_CUES = {
  landscape: [0, 2],
  portrait: [0, 0.75, 2, 2.75],
} as const;
const HIGHLIGHTS = ["기회", "경험"];

/** 큐(장면 시작부터 박) */
const CUE = {
  hold: 3,
  /** 넷째 마디 첫 박: 강조어 뒤로 반전 상자가 쓸려 들어온다 */
  highlight: 4,
  /** 글줄이 내려가고 배경이 막대로 접힌다 */
  exit: 6,
} as const;

/** 미디엄 크기(화면 높이 비율) */
const MEDIUM = 0.09;
const HOLD_DRIFT = 0.005;
/** 다음 장면 스크린 프레임의 아랫변이 될 막대 두께 */
const BAR = 10;

const snapRow = (value: number) => Math.round(value / 45) * 45;

function createLayout(stage: ReelStage, frame: ReelFrame): TaglineLayout {
  const orientation = frame.portrait ? "portrait" : "landscape";
  const lines = LINES[orientation];
  const metrics = lines.map((line) => stage.measure("korean", line));
  const [left] = frame.column(frame.portrait ? 1 : 2);
  const [, right] = frame.column(frame.columns);
  const size = Math.min(
    frame.height * MEDIUM,
    (right - left) / Math.max(...metrics.map(({ width }) => width)),
  );
  const lead = snapRow(size * 1.45);
  const cap = metrics[0].capHeight * size;
  const block = cap + lead * (lines.length - 1);
  const middle = (frame.safeTop + frame.stageBottom) / 2;
  const first = snapRow(middle - block / 2 + cap);

  const frameBox = projectFrameBox(frame);
  return {
    lines: lines.map((text, index) => ({
      text,
      baseline: first + lead * index,
      start: LINE_CUES[orientation][index],
    })),
    size,
    x: left,
    bar: [frameBox[0], frameBox[3] - BAR, frameBox[2], frameBox[3]],
  };
}

/**
 * 태그라인 두 마디. 앞 장면 o가 덮은 재질을 그대로 배경으로 이어받아,
 * 글줄이 글자마다 마스크 안에서 올라오고 강조어 뒤로 반전 상자가 쓸려 든다.
 * 끝에 글줄은 마스크 아래로 내려가고 배경은 막대 하나로 접혀, 그 막대가 다음 장면 스크린의 아랫변이 된다.
 */
export function createTaglineRenderer(gl: WebGL2RenderingContext) {
  const { stage, release } = acquireStage(gl);
  [...LINES.landscape, ...LINES.portrait].forEach((line) =>
    stage.request("korean", line),
  );

  const start = sceneStart("tagline");
  let layoutKey = "";
  let layout: TaglineLayout | null = null;

  return {
    ready: stage.ready,
    draw({ clock }: TaglineSceneState) {
      const frame = stage.begin({ materialTime: start + clock });
      const key = `${frame.width}x${frame.safeTop}`;
      if (!layout || key !== layoutKey) {
        layoutKey = key;
        layout = createLayout(stage, frame);
      }

      const exit = EASE.snap(progress(clock, CUE.exit, SNAP_SECONDS));
      const full: ReelBox = [0, 0, frame.width, frame.height];
      stage.material(lerpBox(full, layout.bar, exit));

      const drift =
        -EASE.linear(progress(clock, CUE.hold, (CUE.exit - CUE.hold) * BEAT)) *
        frame.width *
        HOLD_DRIFT;
      const wipe = EASE.expoOut(progress(clock, CUE.highlight, REVEAL_SECONDS));
      const { size, x } = layout;

      layout.lines.forEach(({ text, baseline, start: lineStart }) => {
        if (!hasStarted(clock, lineStart) || exit >= 1) return;
        const metrics = stage.measure("korean", text);
        const mask = lineMask(frame, baseline, size, metrics);
        const down = sink(clock, CUE.exit, size * 1.4);
        const riseShift = rise(clock, lineStart, size * 1.2);
        const shift = (index: number): [number, number] => [
          drift,
          riseShift(index)[1] + down,
        ];
        const options = {
          font: "korean",
          size,
          x,
          baseline,
          clip: mask,
          shift,
        };
        stage.text(text, { ...options, color: INK });

        // 강조어: 먹색 상자가 왼쪽부터 쓸려 들고, 그 안에서 글자가 흰색으로 뒤집힌다
        HIGHLIGHTS.forEach((word) => {
          const from = text.indexOf(word);
          if (from < 0 || wipe <= 0) return;
          const x0 = x + drift + metrics.offsets[from] * size - size * 0.06;
          const end = from + Array.from(word).length;
          const x1 =
            x +
            drift +
            (metrics.offsets[end] ?? metrics.width) * size +
            size * 0.02;
          const top = baseline - metrics.capHeight * size - size * 0.16 + down;
          const box: ReelBox = [
            x0,
            top,
            x0 + (x1 - x0) * wipe,
            baseline + size * 0.24 + down,
          ];
          stage.rect(box, INK, { clip: mask });
          stage.text(text, { ...options, color: WHITE, clip: box });
        });
      });

      drawCaption(stage, frame, 2);
      stage.end({ clock: start + clock });
    },
    dispose: release,
  };
}

export function buildTaglineTimeline(
  timeline: gsap.core.Timeline,
  state: TaglineSceneState,
) {
  buildClock(timeline, state, "tagline");
}

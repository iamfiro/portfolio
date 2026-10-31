import type { ReelBox, ReelFrame } from "@/feature/showreel/stage.type";
import {
  BEAT,
  EASE,
  FLASH_SECONDS,
  lerp,
  progress,
  SNAP_SECONDS,
} from "@/feature/showreel/utils/motion.util";
import { rgba } from "@/feature/showreel/utils/palette.util";
import type { ReelStage } from "@/feature/showreel/utils/stage.util";
import { acquireStage } from "@/feature/showreel/utils/stage.util";

import {
  buildClock,
  drawCaption,
  hasStarted,
  lineMask,
  rise,
  sceneStart,
} from "../scene.util";

import type {
  TitleLayout,
  TitlePlacement,
  TitleSceneState,
} from "./title.type";

const WHITE = rgba("#f5f5f5");

/** 큐(장면 시작부터 박) */
const CUE = {
  /** Sung이 화면 폭을 꽉 채우며 올라온다 */
  fill: 0.5,
  /** Sung이 디스플레이 크기로 줄며 1~7컬럼에 스냅 */
  shrink: 1,
  /** ju가 9~12컬럼에 올라온다 */
  ju: 2,
  /** Sung·ju hold 시작 */
  hold: 2.75,
  /** 큰 타격: 반전 플래시와 함께 Cho가 아래에서 밀어올린다 */
  push: 4,
  /** Cho hold 시작 */
  choHold: 5,
  /** o가 커져 다음 장면의 배경이 된다 */
  zoom: 6,
} as const;

/** 디스플레이 크기(화면 높이 비율) */
const DISPLAY = 0.45;
/** o 확대 길이와 배율 */
const ZOOM_SECONDS = 1.5 * BEAT;
const ZOOM_FACTOR = 90;
/** hold 중 흘림(프레임 너비 비율)과 느린 확대 */
const HOLD_DRIFT = 0.006;
const HOLD_SCALE = 0.015;

const snapRow = (value: number) => Math.round(value / 45) * 45;

const intersect = (a: ReelBox, b: ReelBox): ReelBox => [
  Math.max(a[0], b[0]),
  Math.max(a[1], b[1]),
  Math.min(a[2], b[2]),
  Math.min(a[3], b[3]),
];

/**
 * 화면 비율마다 타이틀 구도를 짠다. 크기는 실제 글자 폭을 재서 컬럼에 맞추고,
 * 기준선은 베이스라인 격자에 스냅한다.
 */
function createLayout(stage: ReelStage, frame: ReelFrame): TitleLayout {
  const sung = stage.measure("display", "Sung");
  const ju = stage.measure("displayItalic", "ju");
  const cho = stage.measure("display", "Cho");
  const [left] = frame.column(1);
  const [, right] = frame.column(frame.columns);
  const stageHeight = frame.stageBottom - frame.safeTop;
  const middle = (frame.safeTop + frame.stageBottom) / 2;

  const fillSize = Math.min(
    (right - left) / sung.width,
    stageHeight / (sung.capHeight + sung.descent),
  );
  const fill: TitlePlacement = {
    size: fillSize,
    x: left,
    baseline: frame.portrait
      ? snapRow(middle + (sung.capHeight * fillSize) / 2)
      : frame.stageBottom - sung.descent * fillSize,
    align: "left",
  };

  let sungAt: TitlePlacement;
  let juAt: TitlePlacement;
  if (frame.portrait) {
    // 세로: Sung 위, ju 아래 오른쪽. 두 줄 묶음을 무대 가운데에 둔다
    const size = Math.min(frame.height * DISPLAY, fillSize * 0.82);
    const lead = size * 1.02;
    const top = sung.capHeight * size;
    const block = top + lead + ju.descent * size;
    const first = snapRow(middle - block / 2 + top);
    sungAt = { size, x: left, baseline: first, align: "left" };
    juAt = { size, x: right, baseline: first + snapRow(lead), align: "right" };
  } else {
    // 가로: 한 줄에 Sung(1~7컬럼) | ju(9~12컬럼)
    const [sungLeft, sungRight] = frame.column(1, 7);
    const [juLeft, juRight] = frame.column(9, 12);
    const size = Math.min(
      frame.height * DISPLAY,
      (sungRight - sungLeft) / sung.width,
      (juRight - juLeft) / ju.width,
    );
    const baseline = snapRow(middle + (sung.capHeight * size) / 2);
    sungAt = { size, x: sungLeft, baseline, align: "left" };
    juAt = { size, x: juLeft, baseline, align: "left" };
  }

  const choSize = Math.min(frame.height * DISPLAY, (right - left) / cho.width);
  const choBaseline = snapRow(middle + (cho.capHeight * choSize) / 2);
  const choStart = frame.width / 2 - (cho.width * choSize) / 2;
  const lowest = Math.max(sungAt.baseline, juAt.baseline);

  return {
    fill,
    sung: sungAt,
    ju: juAt,
    cho: {
      size: choSize,
      x: frame.width / 2,
      baseline: choBaseline,
      align: "center",
    },
    lift: lowest + ju.descent * juAt.size - frame.safeTop + 8,
    rise: frame.stageBottom + cho.capHeight * choSize - choBaseline + 8,
    zoomOrigin: [
      choStart + cho.offsets[2] * choSize + choSize * 0.07,
      choBaseline - choSize * 0.22,
    ],
  };
}

/**
 * 첫 마디(조용한 인트로)에 이름을 세우고 둘째 마디 첫 박 타격에 넘긴다.
 * Sung이 화면을 꽉 채웠다가 줄어 자리 잡고, ju가 옆에 올라와 머문다.
 * 타격에 화면이 한 번 뒤집히며 Cho가 아래에서 줄을 밀어올리고,
 * 그라디언트로 칠한 o가 커져 화면을 덮으면 그 재질이 그대로 다음 장면의 배경이 된다(매치컷).
 */
export function createTitleRenderer(gl: WebGL2RenderingContext) {
  const { stage, release } = acquireStage(gl);
  stage.request("display", "SungCho");
  stage.request("displayItalic", "ju");
  stage.request("mono", "SHOWREEL 20260123456789/");

  const start = sceneStart("title");
  let layoutKey = "";
  let layout: TitleLayout | null = null;

  return {
    ready: stage.ready,
    draw({ clock }: TitleSceneState) {
      const frame = stage.begin({ materialTime: start + clock });
      const key = `${frame.width}x${frame.safeTop}`;
      if (!layout || key !== layoutKey) {
        layoutKey = key;
        layout = createLayout(stage, frame);
      }
      const stageBox: ReelBox = [
        0,
        frame.safeTop,
        frame.width,
        frame.stageBottom,
      ];

      const shrink = EASE.snap(progress(clock, CUE.shrink, SNAP_SECONDS));
      const push = EASE.snap(progress(clock, CUE.push, SNAP_SECONDS));
      const drift =
        -EASE.linear(progress(clock, CUE.hold, (CUE.push - CUE.hold) * BEAT)) *
        frame.width *
        HOLD_DRIFT;
      const lift = push * layout.lift;

      if (hasStarted(clock, CUE.fill) && push < 1) {
        const { fill, sung } = layout;
        const size = lerp(fill.size, sung.size, shrink);
        const baseline = lerp(fill.baseline, sung.baseline, shrink) - lift;
        const metrics = stage.measure("display", "Sung");
        stage.text("Sung", {
          font: "display",
          size,
          x: lerp(fill.x, sung.x, shrink) + drift,
          baseline,
          color: WHITE,
          clip: intersect(lineMask(frame, baseline, size, metrics), stageBox),
          shift: rise(clock, CUE.fill, size * 0.9),
        });
      }

      if (hasStarted(clock, CUE.ju) && push < 1) {
        const { ju } = layout;
        const baseline = ju.baseline - lift;
        const metrics = stage.measure("displayItalic", "ju");
        stage.text("ju", {
          font: "displayItalic",
          size: ju.size,
          x: ju.x + drift,
          baseline,
          align: ju.align,
          color: WHITE,
          clip: intersect(
            lineMask(frame, baseline, ju.size, metrics),
            stageBox,
          ),
          shift: rise(clock, CUE.ju, ju.size * 0.9),
        });
      }

      if (hasStarted(clock, CUE.push)) {
        const { cho, zoomOrigin } = layout;
        const zoom = EASE.snap(progress(clock, CUE.zoom, ZOOM_SECONDS));
        const hold = EASE.linear(
          progress(clock, CUE.choHold, (CUE.zoom - CUE.choHold) * BEAT),
        );
        const factor =
          (1 + hold * HOLD_SCALE) * Math.exp(Math.log(ZOOM_FACTOR) * zoom);

        if (zoom >= 1) {
          stage.material([0, 0, frame.width, frame.height]);
        } else {
          stage.text("Cho", {
            font: "display",
            size: cho.size,
            x: cho.x,
            baseline: cho.baseline + (1 - push) * layout.rise,
            align: "center",
            color: WHITE,
            // o만 그라디언트 재질로 칠한다. 이 o가 커져 다음 장면의 배경이 된다
            material: (index) => index === 2,
            zoom: { origin: zoomOrigin, factor },
            // 커지기 시작하면 배경이 되어 가므로 무대 밖까지 덮는다
            clip: zoom > 0 ? undefined : stageBox,
          });
        }
      }

      drawCaption(stage, frame, 1);
      const flashAt = CUE.push * BEAT;
      stage.end({
        clock: start + clock,
        invert: clock >= flashAt && clock < flashAt + FLASH_SECONDS,
      });
    },
    dispose: release,
  };
}

export function buildTitleTimeline(
  timeline: gsap.core.Timeline,
  state: TitleSceneState,
) {
  buildClock(timeline, state, "title");
}

import type { ReelBox, ReelFrame } from "@/feature/showreel/stage.type";
import {
  BEAT,
  EASE,
  FLASH_SECONDS,
  lerpBox,
  progress,
  REVEAL_SECONDS,
  SNAP_SECONDS,
} from "@/feature/showreel/utils/motion.util";
import { REEL_PALETTE, rgba } from "@/feature/showreel/utils/palette.util";
import type { ReelStage } from "@/feature/showreel/utils/stage.util";
import { acquireStage } from "@/feature/showreel/utils/stage.util";

import { projectGrid, REEL_PROJECTS } from "../projects/reel-projects.util";
import {
  buildClock,
  drawCaption,
  hasStarted,
  lineMask,
  rise,
  sceneStart,
  sink,
} from "../scene.util";

import type { OutroLayout, OutroSceneState } from "./outro.type";

const WHITE = rgba(REEL_PALETTE.white);
const CONTACT = "연락하기";
const CONTACT_CAPTION = "CONTACT →";
const CAPTION_SIZE = 24;

/** 큐(장면 시작부터 박) */
const CUE = {
  /** 프레이즈 타격: 반전 플래시와 함께 타일 네 장이 가운데로 모인다 */
  gather: 0,
  /** 모인 자리에 마크가 남는다 */
  mark: 1,
  contact: 1.25,
  caption: 1.5,
  hold: 2,
  /** 로크업이 마스크 아래로 내려간다 */
  exit: 5,
  /** 검정과 캡션만 남아 루프 첫 프레임과 맞물린다 */
  rest: 6,
} as const;

const MARK = 0.16;
const MEDIUM = 0.09;
const HOLD_SCALE = 0.02;

const snapRow = (value: number) => Math.round(value / 45) * 45;

function createLayout(stage: ReelStage, frame: ReelFrame): OutroLayout {
  const markSize = frame.height * MARK;
  const markWidth = stage.measure("logo", "M").width * markSize;
  const contact = stage.measure("korean", CONTACT);
  const size = Math.min(
    frame.height * MEDIUM,
    (frame.width * 0.8) / contact.width,
  );
  const cap = contact.capHeight * size;
  const middle = (frame.safeTop + frame.stageBottom) / 2;

  // 마크 · 연락하기 · 캡션 묶음을 무대 가운데에 둔다
  const block = markSize + 60 + cap + 80;
  const markBaseline = snapRow(middle - block / 2 + markSize);
  const contactBaseline = snapRow(markBaseline + 60 + cap);
  const cx = frame.width / 2;

  return {
    mark: [
      cx - markWidth / 2,
      markBaseline - markSize,
      cx + markWidth / 2,
      markBaseline,
    ],
    markSize,
    contact: { baseline: contactBaseline, size },
    caption: { baseline: contactBaseline + 90 },
    center: [cx, (markBaseline - markSize + contactBaseline) / 2],
  };
}

/**
 * 아웃트로 두 마디. 프레이즈 타격에 화면이 한 번 뒤집히며 프로젝트 타일들이 가운데로 모여 로고 마크가 되고,
 * 연락하기가 올라와 머문 뒤 마스크 아래로 내려간다. 마지막엔 검정과 캡션만 남아 타이틀 첫 프레임으로 이어진다.
 */
export function createOutroRenderer(gl: WebGL2RenderingContext) {
  const { stage, release } = acquireStage(gl);
  stage.request("logo", "M");
  stage.request("korean", CONTACT);
  stage.request("mono", CONTACT_CAPTION);
  REEL_PROJECTS.forEach(({ image }) => stage.requestImage(image));

  const start = sceneStart("outro");
  let layoutKey = "";
  let layout: OutroLayout | null = null;

  return {
    ready: stage.ready,
    draw({ clock }: OutroSceneState) {
      const frame = stage.begin({ materialTime: start + clock });
      const key = `${frame.width}x${frame.safeTop}`;
      if (!layout || key !== layoutKey) {
        layoutKey = key;
        layout = createLayout(stage, frame);
      }
      const { mark, markSize, contact, caption, center } = layout;

      if (!hasStarted(clock, CUE.mark)) {
        const gather = EASE.snap(progress(clock, CUE.gather, SNAP_SECONDS));
        projectGrid(frame).forEach((tile, index) => {
          stage.image(REEL_PROJECTS[index].image, lerpBox(tile, mark, gather), {
            crop: REEL_PROJECTS[index].hold,
          });
        });
      } else if (!hasStarted(clock, CUE.rest)) {
        const hold = EASE.linear(
          progress(clock, CUE.hold, (CUE.exit - CUE.hold) * BEAT),
        );
        const zoom = { origin: center, factor: 1 + hold * HOLD_SCALE };
        const down = (distance: number) => sink(clock, CUE.exit, distance);

        const markClip: ReelBox = [0, mark[1] - 8, frame.width, mark[3] + 8];
        stage.text("M", {
          font: "logo",
          size: markSize,
          x: frame.width / 2,
          baseline: mark[3],
          align: "center",
          color: WHITE,
          clip: markClip,
          shift: () => [0, down(markSize * 1.1)],
          zoom,
        });

        const contactMetrics = stage.measure("korean", CONTACT);
        const contactRise = rise(clock, CUE.contact, contact.size * 1.2);
        stage.text(CONTACT, {
          font: "korean",
          size: contact.size,
          x: frame.width / 2,
          baseline: contact.baseline,
          align: "center",
          color: WHITE,
          clip: lineMask(frame, contact.baseline, contact.size, contactMetrics),
          shift: (index) => [
            0,
            contactRise(index)[1] + down(contact.size * 1.4),
          ],
          zoom,
        });

        // 캡션은 왼쪽부터 clip 와이프로 열린다
        const wipe = EASE.expoOut(progress(clock, CUE.caption, REVEAL_SECONDS));
        const captionWidth =
          stage.measure("mono", CONTACT_CAPTION).width * CAPTION_SIZE;
        const captionLeft = frame.width / 2 - captionWidth / 2;
        const captionMask = lineMask(
          frame,
          caption.baseline,
          CAPTION_SIZE,
          stage.measure("mono", CONTACT_CAPTION),
        );
        stage.text(CONTACT_CAPTION, {
          font: "mono",
          size: CAPTION_SIZE,
          x: frame.width / 2,
          baseline: caption.baseline,
          align: "center",
          color: WHITE,
          clip: [
            captionLeft - 4,
            captionMask[1],
            captionLeft + (captionWidth + 8) * wipe,
            captionMask[3],
          ],
          shift: () => [0, down(CAPTION_SIZE * 1.6)],
          zoom,
        });
      }

      // 마지막 두 박은 루프 첫 프레임(타이틀 01)과 같은 캡션을 보인다
      drawCaption(stage, frame, hasStarted(clock, CUE.rest) ? 1 : 4);
      stage.end({
        clock: start + clock,
        invert: clock < FLASH_SECONDS,
      });
    },
    dispose: release,
  };
}

export function buildOutroTimeline(
  timeline: gsap.core.Timeline,
  state: OutroSceneState,
) {
  buildClock(timeline, state, "outro");
}

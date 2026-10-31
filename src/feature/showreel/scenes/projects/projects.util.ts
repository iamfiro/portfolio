import type { ReelBox, ReelFrame } from "@/feature/showreel/stage.type";
import {
  BEAT,
  EASE,
  lerp,
  progress,
  REVEAL_SECONDS,
  SNAP_SECONDS,
} from "@/feature/showreel/utils/motion.util";
import { REEL_PALETTE, rgba } from "@/feature/showreel/utils/palette.util";
import type { ReelStage } from "@/feature/showreel/utils/stage.util";
import { acquireStage } from "@/feature/showreel/utils/stage.util";

import {
  buildClock,
  drawCaption,
  lineMask,
  rise,
  sceneStart,
} from "../scene.util";

import type { ProjectsLayout, ProjectsSceneState } from "./projects.type";
import {
  projectFrameBox,
  projectGrid,
  REEL_PROJECTS,
} from "./reel-projects.util";

const WHITE = rgba(REEL_PALETTE.white);
const INK = rgba(REEL_PALETTE.ink);

/** 프로젝트 한 마디: 0 스크린 · 1 디테일 · 2 로고 · 3 hold */
const BEATS_PER_PROJECT = 4;
/** 네 프로젝트가 끝나고 모아보기 타일이 한 박에 하나씩 열린다 */
const GRID_AT = BEATS_PER_PROJECT * REEL_PROJECTS.length;
const MEDIUM = 0.09;
const CAPTION_SIZE = 24;
/** 앞 장면에서 넘어온 막대 두께. 이 막대가 위로 쓸려 올라가며 첫 스크린을 연다 */
const BAR = 10;
/** hold 컷의 느린 확대 */
const HOLD_ZOOM = 0.04;

const snapRow = (value: number) => Math.round(value / 45) * 45;
const labelOf = (index: number) => `WORK 0${index + 1}`;

function createLayout(stage: ReelStage, frame: ReelFrame): ProjectsLayout {
  const screen = projectFrameBox(frame);
  // 이름은 가로에선 스크린 왼쪽 1~4컬럼, 세로에선 4컬럼 전체 폭에 놓인다
  const [left, right] = frame.column(1, 4);
  const widest = Math.max(
    ...REEL_PROJECTS.map(({ name }) => stage.measure("display", name).width),
  );
  const size = Math.min(frame.height * MEDIUM, (right - left) / widest);
  const cap = stage.measure("display", "H").capHeight * size;
  const labelCap = stage.measure("mono", "W").capHeight * CAPTION_SIZE;

  // 가로: 라벨과 이름을 스크린 위쪽 모서리에 맞춘다. 세로: 스크린 위에 쌓는다
  const labelBaseline = frame.portrait
    ? frame.safeTop + labelCap
    : screen[1] + labelCap;
  const nameBaseline = frame.portrait
    ? snapRow(screen[1] - size * 0.45)
    : snapRow(screen[1] + 45 + cap);

  return {
    screen,
    detail: [0, frame.safeTop, frame.width, frame.height],
    logoLimit: [(screen[2] - screen[0]) * 0.5, (screen[3] - screen[1]) * 0.42],
    name: { x: left, baseline: nameBaseline, size },
    label: { x: left, baseline: labelBaseline },
    grid: projectGrid(frame),
  };
}

/** 로고를 비율 그대로 상자 가운데에 넣는다 */
function logoBox(
  screen: ReelBox,
  [limitWidth, limitHeight]: [number, number],
  aspect: number,
): ReelBox {
  const width = Math.min(limitWidth, limitHeight * aspect);
  const height = width / aspect;
  const cx = (screen[0] + screen[2]) / 2;
  const cy = (screen[1] + screen[3]) / 2;
  return [cx - width / 2, cy - height / 2, cx + width / 2, cy + height / 2];
}

/**
 * 프로젝트 다섯 마디. 프로젝트마다 한 마디 동안 박마다 한 컷:
 * 스크린 → 화면 가득 디테일(이름은 difference로 겹쳐도 읽힘) → 그라디언트 위 로고 → 스크린 hold.
 * 다음 프로젝트는 같은 자리의 프레임에서 내용만 바뀌고(매치컷), 마지막 마디엔 네 장이 한 박에 하나씩 열린다.
 */
export function createProjectsRenderer(gl: WebGL2RenderingContext) {
  const { stage, release } = acquireStage(gl);
  REEL_PROJECTS.forEach(({ name, image, logo }, index) => {
    stage.request("display", `${name}H`);
    stage.request("mono", `${labelOf(index)}${name.toUpperCase()}`);
    stage.requestImage(image);
    stage.requestImage(logo);
  });

  const start = sceneStart("projects");
  let layoutKey = "";
  let layout: ProjectsLayout | null = null;

  return {
    ready: stage.ready,
    draw({ clock }: ProjectsSceneState) {
      const frame = stage.begin({ materialTime: start + clock });
      const key = `${frame.width}x${frame.safeTop}`;
      if (!layout || key !== layoutKey) {
        layoutKey = key;
        layout = createLayout(stage, frame);
      }
      const beat = clock / BEAT;

      if (beat < GRID_AT) {
        const index = Math.floor(beat / BEATS_PER_PROJECT);
        const project = REEL_PROJECTS[index];
        const first = index * BEATS_PER_PROJECT;
        const shot = Math.floor(beat - first);
        const { screen, name, label } = layout;

        if (shot === 1) {
          stage.image(project.image, layout.detail, { crop: project.detail });
        } else {
          // 첫 프로젝트는 앞 장면의 막대가 아랫변에서 위로 쓸려 올라가며 스크린을 연다
          const open =
            index === 0 ? EASE.snap(progress(clock, 0, SNAP_SECONDS)) : 1;
          const top = lerp(screen[3] - BAR, screen[1], open);
          const clip: ReelBox = [screen[0], top, screen[2], screen[3]];

          if (shot === 2) {
            stage.material(screen, { clip });
            stage.image(
              project.logo,
              logoBox(screen, layout.logoLimit, project.logoAspect),
              { tint: project.tintLogo ? INK : undefined },
            );
          } else {
            const push =
              shot === 3
                ? EASE.linear(progress(clock, first + 3, BEAT)) * HOLD_ZOOM
                : 0;
            stage.image(project.image, screen, {
              crop: { ...project.hold, zoom: project.hold.zoom * (1 + push) },
              clip,
            });
          }
          if (open < 1) stage.material([screen[0], top, screen[2], top + BAR]);
        }

        const metrics = stage.measure("display", project.name);
        stage.text(project.name, {
          font: "display",
          size: name.size,
          x: name.x,
          baseline: name.baseline,
          color: WHITE,
          blend: "invert",
          clip: lineMask(frame, name.baseline, name.size, metrics),
          shift: rise(clock, first, name.size),
        });
        stage.text(labelOf(index), {
          font: "mono",
          size: CAPTION_SIZE,
          x: label.x,
          baseline: label.baseline,
          color: WHITE,
          blend: "invert",
          clip: lineMask(
            frame,
            label.baseline,
            CAPTION_SIZE,
            stage.measure("mono", "W"),
          ),
          shift: rise(clock, first, CAPTION_SIZE * 1.4),
        });
      } else {
        layout.grid.forEach((tile, index) => {
          const at = GRID_AT + index;
          const reveal = EASE.expoOut(progress(clock, at, REVEAL_SECONDS));
          if (reveal <= 0) return;
          const project = REEL_PROJECTS[index];
          const top = lerp(tile[3], tile[1], reveal);
          stage.image(project.image, tile, {
            crop: project.hold,
            clip: [tile[0], top, tile[2], tile[3]],
          });
          const baseline = tile[3] + CAPTION_SIZE * 1.6;
          stage.text(project.name.toUpperCase(), {
            font: "mono",
            size: CAPTION_SIZE,
            x: tile[0],
            baseline,
            color: WHITE,
            clip: lineMask(
              frame,
              baseline,
              CAPTION_SIZE,
              stage.measure("mono", "W"),
            ),
            shift: rise(clock, at, CAPTION_SIZE * 1.4),
          });
        });
      }

      drawCaption(stage, frame, 3);
      stage.end({ clock: start + clock });
    },
    dispose: release,
  };
}

export function buildProjectsTimeline(
  timeline: gsap.core.Timeline,
  state: ProjectsSceneState,
) {
  buildClock(timeline, state, "projects");
}

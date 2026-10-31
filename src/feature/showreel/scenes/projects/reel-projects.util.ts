import type {
  ReelBox,
  ReelCrop,
  ReelFrame,
} from "@/feature/showreel/stage.type";

export interface ReelProject {
  name: string;
  image: string;
  logo: string;
  /** 로고 가로/세로 비율 */
  logoAspect: number;
  /** 투명 바탕 흰 글자 로고라 먹색으로 물들여 쓴다 */
  tintLogo?: boolean;
  /** 프레임에 머무는 컷의 자리 */
  hold: ReelCrop;
  /** 화면 가득 확대한 디테일 컷의 자리 */
  detail: ReelCrop;
}

/** 몽타주 순서. 어두운 화면과 밝은 화면이 번갈아 나오게 놓았다 */
export const REEL_PROJECTS: ReelProject[] = [
  {
    name: "AltTab",
    image: "/images/projects/alttab/banner.png",
    logo: "/images/projects/alttab/logo.png",
    logoAspect: 615 / 160,
    tintLogo: true,
    hold: { focus: [0.5, 0.5], zoom: 1 },
    detail: { focus: [0.36, 0.3], zoom: 2.4 },
  },
  {
    name: "PocketTime",
    image: "/images/projects/pockettime/thumbnail.webp",
    logo: "/images/projects/pockettime/logo.png",
    logoAspect: 1,
    hold: { focus: [0.5, 0.55], zoom: 1 },
    detail: { focus: [0.3, 0.1], zoom: 1.3 },
  },
  {
    name: "Context CC",
    image: "/images/projects/context-cc/thumbnail.png",
    logo: "/images/projects/context-cc/logo.png",
    logoAspect: 1,
    hold: { focus: [0.5, 0.5], zoom: 1 },
    detail: { focus: [0.52, 0.5], zoom: 1.9 },
  },
  {
    name: "Sigmoid",
    image: "/images/projects/sigmoid/thumbnail.png",
    logo: "/images/projects/sigmoid/logo.png",
    logoAspect: 1,
    hold: { focus: [0.5, 0.5], zoom: 1 },
    detail: { focus: [0.55, 0.5], zoom: 1.6 },
  },
];

/** 프로젝트 스크린이 놓이는 프레임. 가로는 5~12컬럼, 세로는 이름 아래 전체 폭이다 */
export function projectFrameBox(frame: ReelFrame): ReelBox {
  if (frame.portrait) {
    const [left, right] = frame.column(1, 4);
    return [left, frame.row(9), right, frame.row(19)];
  }
  const [left, right] = frame.column(5, 12);
  return [left, Math.max(frame.row(4), frame.safeTop), right, frame.row(19)];
}

/** 모아보기 타일 네 장. 가로는 3컬럼씩 한 줄, 세로는 2×2 */
export function projectGrid(frame: ReelFrame): ReelBox[] {
  if (frame.portrait) {
    const top = Math.max(frame.row(4), frame.safeTop);
    return [
      [...frame.column(1, 2), ...frame.column(3, 4)],
      [...frame.column(1, 2), ...frame.column(3, 4)],
    ].flatMap(([leftA, rightA, leftB, rightB], row) => {
      const y0 = row === 0 ? top : frame.row(12);
      const y1 = row === 0 ? frame.row(10) : frame.row(18);
      return [
        [leftA, y0, rightA, y1] as ReelBox,
        [leftB, y0, rightB, y1] as ReelBox,
      ];
    });
  }
  const top = Math.max(frame.row(5), frame.safeTop);
  return [
    frame.column(1, 3),
    frame.column(4, 6),
    frame.column(7, 9),
    frame.column(10, 12),
  ].map(([left, right]) => [left, top, right, frame.row(17)]);
}

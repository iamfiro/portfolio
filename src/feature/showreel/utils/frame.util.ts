import type { ReelBox, ReelFrame } from "../stage.type";

/** 프레임 높이. 너비는 화면 비율을 따른다 */
export const FRAME_HEIGHT = 1080;
/** 베이스라인 한 줄(프레임 단위). 높이를 24줄로 나눈다 */
export const BASELINE = 45;
/** 사이트 헤더 높이(CSS px, $header-height). 쇼릴 위를 덮으므로 이 아래부터 쓴다 */
const HEADER_HEIGHT = 64;
/** 이 너비보다 좁으면(가로세로 비 1.2 미만) 세로 구도를 쓴다 */
const PORTRAIT_BELOW = 1300;

const snapToBaseline = (value: number) =>
  Math.ceil(value / BASELINE) * BASELINE;

/**
 * 화면 크기로 프레임과 그리드를 만든다.
 * 가로 화면은 12컬럼, 세로 화면은 4컬럼이고, 위·아래 기준선은 모두 베이스라인에 맞춘다.
 * 위쪽은 헤더 아래 한 줄부터, 아래쪽은 캡션 줄 위까지가 글자가 놓이는 무대다.
 */
export function createFrame(
  bufferWidth: number,
  bufferHeight: number,
  cssHeight: number,
): ReelFrame {
  const height = FRAME_HEIGHT;
  const width = Math.round((height * bufferWidth) / Math.max(1, bufferHeight));
  const portrait = width < PORTRAIT_BELOW;
  const columns = portrait ? 4 : 12;
  const margin = Math.round(width * (portrait ? 0.07 : 0.05));
  const gutter = Math.round(width * (portrait ? 0.03 : 0.0125));
  const columnWidth = (width - margin * 2 - gutter * (columns - 1)) / columns;
  const header = (HEADER_HEIGHT / Math.max(1, cssHeight)) * height;

  const column = (first: number, last = first): [number, number] => [
    margin + (first - 1) * (columnWidth + gutter),
    margin + last * columnWidth + (last - 1) * gutter,
  ];

  return {
    width,
    height,
    portrait,
    columns,
    margin,
    column,
    row: (index: number) => index * BASELINE,
    safeTop: snapToBaseline(header) + BASELINE,
    stageBottom: height - BASELINE * 2,
    captionBaseline: height - BASELINE,
    pixel: height / Math.max(1, bufferHeight),
  };
}

/** 상자의 너비와 높이 */
export const boxWidth = (box: ReelBox) => box[2] - box[0];
export const boxHeight = (box: ReelBox) => box[3] - box[1];

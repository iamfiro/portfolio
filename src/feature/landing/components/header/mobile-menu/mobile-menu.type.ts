/** 모바일 메뉴에 한 줄로 놓이는 페이지 링크 */
export interface MobileMenuItem {
  path: string;
  label: string;
  /** 라벨 옆에 작게 붙는 개수 (예: 프로젝트 수) */
  count?: number;
}

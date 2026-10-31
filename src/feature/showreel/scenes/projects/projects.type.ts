import type { ReelBox } from "@/feature/showreel/stage.type";

export interface ProjectsSceneState {
  clock: number;
}

export interface ProjectsLayout {
  /** 스크린 프레임 */
  screen: ReelBox;
  /** 화면 가득 디테일 컷(좌·우·아래로 넘침) */
  detail: ReelBox;
  /** 프레임 안에 로고가 놓이는 상자의 최대 크기 */
  logoLimit: [width: number, height: number];
  name: { x: number; baseline: number; size: number };
  label: { x: number; baseline: number };
  grid: ReelBox[];
}

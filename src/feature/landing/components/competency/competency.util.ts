export const COMPETENCY_HEADLINE_LINES = [
  "아이디어를 동작하는",
  "서비스로 만들어요",
];

/** 카드 위에 그릴 시각화 목업 종류 */
export type CompetencyVisual = "cross-platform" | "backend" | "hackathon";

export interface Competency {
  visual: CompetencyVisual;
  title: string;
  description: string;
}

// 기술 스택(STACK_DATA)과 수상 기록에 있는 사실로만 쓴다
export const COMPETENCIES: Competency[] = [
  {
    visual: "cross-platform",
    title: "웹과 앱을 함께",
    description:
      "React·Next.js로 웹을, Kotlin·Expo로 앱을 만듭니다. 하나의 서비스를 화면과 플랫폼에 맞게 옮겨 담습니다.",
  },
  {
    visual: "backend",
    title: "서버와 데이터까지",
    description:
      "MySQL로 데이터를 설계하고 Redis로 캐싱과 실시간 메시징을 붙여, 화면 뒤의 구조까지 직접 만듭니다.",
  },
  {
    visual: "hackathon",
    title: "정해진 시간 안에 완성",
    description:
      "선린 해커톤 금상, SOPT 앱잼 최우수상처럼 제한된 시간 안에 기획부터 시연까지 끝내 왔습니다.",
  },
];

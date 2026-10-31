import { STACK_DATA, type StackItem } from "@/shared/constants";

export interface CapabilityService {
  title: string;
  description: string;
  /** 카드 아래 한 줄 덧붙임 */
  caption: string;
  stack: StackItem[];
}

// STACK_DATA 카테고리 순서(프론트엔드, 백엔드, 애플리케이션)와 짝을 맞춘다
const SERVICE_COPY: Omit<CapabilityService, "stack">[] = [
  {
    title: "웹 경험 설계와 구현",
    description:
      "사용자가 머무르고 싶은 인터페이스를 타입 안전한 코드로 픽셀 단위까지 만듭니다.",
    caption: "디자인 의도를 지키는 구현과 성능 최적화를 함께 고민합니다.",
  },
  {
    title: "버티는 서버와 데이터",
    description:
      "관계형 DB 설계부터 캐싱, 실시간 메시징까지 서비스가 버티는 구조를 설계합니다.",
    caption: "출시 이후의 트래픽과 운영까지 생각하며 만듭니다.",
  },
  {
    title: "손 안에서 도는 앱",
    description:
      "네이티브와 크로스플랫폼을 오가며 플랫폼 기능을 적극적으로 쓰는 앱을 만듭니다.",
    caption: "다이나믹 아일랜드 같은 OS 기능까지 제품 경험으로 끌어옵니다.",
  },
];

export const CAPABILITY_SERVICES: CapabilityService[] = SERVICE_COPY.map(
  (copy, index) => ({ ...copy, stack: STACK_DATA[index]?.items ?? [] }),
);

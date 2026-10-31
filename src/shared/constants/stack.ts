export interface StackItem {
  name: string;
  icon: string;
  skills: string[];
  /** 흰색 단색 로고라 밝은 배경에서 반전이 필요한 아이콘 */
  invert?: boolean;
}

export interface StackCategory {
  label: string;
  items: StackItem[];
}

export const STACK_DATA: StackCategory[] = [
  {
    label: "프론트엔드",
    items: [
      {
        name: "TypeScript",
        icon: "/icon/stack/typescript.svg",
        skills: ["타입 안전한 대규모 앱 설계", "제네릭·유틸리티 타입 활용"],
      },
      {
        name: "React",
        icon: "/icon/stack/react.svg",
        skills: ["SPA·커스텀 훅 설계", "상태 관리 및 성능 최적화"],
      },
      {
        name: "Next.js",
        icon: "/icon/stack/nextjs.svg",
        skills: ["SSR/SSG 기반 웹 앱 구축", "App Router·서버 컴포넌트 활용"],
      },
    ],
  },
  {
    label: "백엔드",
    items: [
      {
        name: "MySQL",
        icon: "/icon/stack/mysql.svg",
        skills: ["관계형 DB 설계·최적화", "복잡한 쿼리·인덱싱"],
      },
      {
        name: "Redis",
        icon: "/icon/stack/redis.svg",
        skills: ["캐싱·세션 관리", "Pub/Sub 실시간 메시징"],
      },
    ],
  },
  {
    label: "애플리케이션",
    items: [
      {
        name: "Kotlin",
        icon: "/icon/stack/kotlin.svg",
        skills: ["Android 네이티브 앱 개발", "코루틴 기반 비동기 처리"],
      },
      {
        name: "Android",
        icon: "/icon/stack/android.svg",
        skills: ["Jetpack Compose UI", "Material Design 구현"],
      },
      {
        name: "Expo",
        icon: "/icon/stack/expo.svg",
        invert: true,
        skills: ["React Native 크로스플랫폼 앱", "OTA 업데이트·네이티브 모듈"],
      },
    ],
  },
];

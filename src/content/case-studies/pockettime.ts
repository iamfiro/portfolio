import type { CaseStudy } from "@/feature/projects/schema";

const pockettime: CaseStudy = {
  year: "2026",
  // TODO(human): lead와 초점(features) 4개를 실제 포켓타임 경험으로 다시 쓰기
  lead: "앱을 열지 않아도 지금 할 일이 보이도록, 일정을 다이나믹 아일랜드와 잠금화면 위로 올렸습니다. 다음 일정까지 남은 시간이 화면 상단에서 실시간으로 줄어듭니다.",
  tags: ["모바일", "Live Activity", "네이티브 연동", "스케줄러"],
  sections: [
    {
      id: "focus",
      title: "초점",
      paragraphs: [
        "어려운 건 일정을 저장하는 일이 아닙니다. 사용자가 확인하지 않아도 정확한 순간에 정확한 일정이 화면 위에 떠 있게 만드는 일입니다.",
        "핵심 질문: 앱이 꺼져 있을 때도 일정이 제때 바뀌는가.",
        "네 가지에 집중했습니다.",
      ],
      block: {
        type: "features",
        items: [
          {
            title: "다이나믹 아일랜드",
            body: "ActivityKit Live Activity로 현재 일정과 남은 시간을 아일랜드와 잠금화면에 띄웁니다.",
          },
          {
            title: "플랫폼별 네이티브",
            body: "Flutter로 화면을 공유하고, Swift·Kotlin 네이티브 모듈로 플랫폼마다 상단 표시를 구현했습니다.",
          },
          {
            title: "분 단위 스케줄러",
            body: "매분 1,000만 건의 일정을 조회해 다음 일정으로 넘어갈 사용자만 골라 푸시합니다.",
          },
          {
            title: "끊기지 않는 업데이트",
            body: "앱이 백그라운드에 있어도 서버 푸시로 Live Activity 상태를 갱신합니다.",
          },
        ],
      },
    },
    {
      id: "composition",
      title: "구성",
      paragraphs: [],
      block: {
        type: "specs",
        items: [
          {
            title: "화면",
            items: [
              "오늘 타임라인",
              "일정 등록·반복 규칙",
              "위젯",
              "알림 설정",
            ],
          },
          {
            title: "네이티브",
            items: [
              "Swift ActivityKit 모듈",
              "Kotlin 상단 진행 알림",
              "Method Channel 브리지",
              "푸시 토큰 등록",
            ],
          },
          {
            title: "앱",
            items: ["Flutter", "상태 관리", "오프라인 캐시", "다국어"],
          },
          {
            title: "서버",
            items: [
              "분 단위 스케줄러",
              "일정 조회 최적화",
              "APNs·FCM 발송",
              "발송 실패 재시도",
            ],
          },
        ],
      },
    },
    {
      id: "pipeline",
      title: "업데이트 파이프라인",
      paragraphs: [
        "일정이 저장되면 스케줄러가 매분 다음에 바뀔 일정을 찾고, 푸시로 기기에 상태를 보냅니다. 기기는 받은 상태로 아일랜드를 다시 그립니다.",
      ],
      block: {
        type: "flow",
        stages: [
          { label: "Plan", items: ["Create event", "Repeat rules"] },
          {
            label: "Schedule",
            items: ["Minute tick", "Next-event query", "Diff check"],
          },
          { label: "Push", items: ["APNs Live Activity", "FCM"] },
          { label: "Render", items: ["Dynamic Island", "Lock screen"] },
        ],
      },
    },
    {
      id: "system",
      title: "시스템",
      paragraphs: [
        "클라이언트는 Flutter 앱 하나와 플랫폼별 네이티브 모듈입니다. 서버는 일정을 저장하고, 스케줄러가 분 단위로 푸시를 만듭니다.",
      ],
      block: {
        type: "flow",
        stages: [
          {
            label: "Clients",
            items: ["Flutter app", "Swift module", "Kotlin module"],
          },
          { label: "Server", items: ["API", "Scheduler", "Database"] },
          { label: "Platform", items: ["APNs", "FCM"] },
        ],
      },
    },
    {
      id: "product",
      title: "제품",
      paragraphs: [],
      block: {
        type: "showcase",
        items: [
          {
            title: "다이나믹 아일랜드",
            body: "진행 중인 일정과 남은 시간을 아일랜드에 띄웁니다. 길게 누르면 다음 일정까지 펼쳐집니다.",
            imageUrl: "/images/projects/pockettime/thumbnail.webp",
          },
          {
            title: "타임라인",
            body: "오늘 일정을 시간순으로 보여 주고, 지금 위치를 표시합니다. 반복 일정은 규칙 하나로 등록합니다.",
          },
          {
            title: "잠금화면",
            body: "잠금을 풀지 않아도 현재 일정과 진행률이 보입니다. 일정이 끝나면 다음 일정으로 자동 전환됩니다.",
          },
        ],
      },
    },
  ],
};

export default pockettime;

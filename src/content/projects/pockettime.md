---
title: 포켓타임
description: 다이나믹 아일랜드로 일정 관리하기
techStack: [Flutter, Swift, Kotlin]
tags: [모바일, Live Activity, 네이티브 연동, 스케줄러]
logoUrl: /images/projects/pockettime/logo.png
thumbnailUrl: /images/projects/pockettime/thumbnail.webp
githubUrl:
deployUrl:
startDate: 2026-08-28
endDate:
resume: true
---

<!-- TODO(human): 도입 문단과 초점 4개를 실제 포켓타임 경험으로 다시 쓰기 -->

앱을 열지 않아도 지금 할 일이 보이도록, 일정을 다이나믹 아일랜드와 잠금화면 위로 올렸습니다. 다음 일정까지 남은 시간이 화면 상단에서 실시간으로 줄어듭니다.

## 초점

어려운 건 일정을 저장하는 일이 아닙니다. 사용자가 확인하지 않아도 정확한 순간에 정확한 일정이 화면 위에 떠 있게 만드는 일입니다.

핵심 질문: 앱이 꺼져 있을 때도 일정이 제때 바뀌는가.

네 가지에 집중했습니다.

### 다이나믹 아일랜드

ActivityKit Live Activity로 현재 일정과 남은 시간을 아일랜드와 잠금화면에 띄웁니다.

### 플랫폼별 네이티브

Flutter로 화면을 공유하고, Swift·Kotlin 네이티브 모듈로 플랫폼마다 상단 표시를 구현했습니다.

### 분 단위 스케줄러

매분 1,000만 건의 일정을 조회해 다음 일정으로 넘어갈 사용자만 골라 푸시합니다.

### 끊기지 않는 업데이트

앱이 백그라운드에 있어도 서버 푸시로 Live Activity 상태를 갱신합니다.

## 구성

| 화면 | 네이티브 | 앱 | 서버 |
| --- | --- | --- | --- |
| 오늘 타임라인 | Swift ActivityKit 모듈 | Flutter | 분 단위 스케줄러 |
| 일정 등록·반복 규칙 | Kotlin 상단 진행 알림 | 상태 관리 | 일정 조회 최적화 |
| 위젯 | Method Channel 브리지 | 오프라인 캐시 | APNs·FCM 발송 |
| 알림 설정 | 푸시 토큰 등록 | 다국어 | 발송 실패 재시도 |

## 업데이트 파이프라인

일정이 저장되면 스케줄러가 매분 다음에 바뀔 일정을 찾고, 푸시로 기기에 상태를 보냅니다. 기기는 받은 상태로 아일랜드를 다시 그립니다.

1. **Plan** — 일정 생성, 반복 규칙
2. **Schedule** — 분 단위 틱, 다음 일정 조회, 변경 비교
3. **Push** — APNs Live Activity, FCM
4. **Render** — 다이나믹 아일랜드, 잠금화면

## 시스템

클라이언트는 Flutter 앱 하나와 플랫폼별 네이티브 모듈입니다. 서버는 일정을 저장하고, 스케줄러가 분 단위로 푸시를 만듭니다.

- **Clients** — Flutter 앱, Swift 모듈, Kotlin 모듈
- **Server** — API, 스케줄러, 데이터베이스
- **Platform** — APNs, FCM

## 제품

### 다이나믹 아일랜드

진행 중인 일정과 남은 시간을 아일랜드에 띄웁니다. 길게 누르면 다음 일정까지 펼쳐집니다.

![다이나믹 아일랜드](/images/projects/pockettime/thumbnail.webp)

### 타임라인

오늘 일정을 시간순으로 보여 주고, 지금 위치를 표시합니다. 반복 일정은 규칙 하나로 등록합니다.

### 잠금화면

잠금을 풀지 않아도 현재 일정과 진행률이 보입니다. 일정이 끝나면 다음 일정으로 자동 전환됩니다.

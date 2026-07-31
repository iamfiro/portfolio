# Portfolio

React + TypeScript + Vite 기반의 포트폴리오 웹사이트와 Hono API 서버

## 프로젝트 구조

- **Frontend**: React + TypeScript + Vite + SCSS Modules
- **Backend**: Hono + TypeScript + Prisma
- **Package Manager**: npm

## 개발 환경 설정

```bash
# 의존성 설치
npm install
cd server && npm install && cd ..

# 환경 변수 설정 (.env.example 참고)
cp .env.example .env

# 프론트엔드 개발 서버 실행
npm run dev

# 백엔드 개발 서버 실행
npm run dev:server
```

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 프론트엔드 개발 서버 (http://localhost:5173) |
| `npm run dev:server` | 백엔드 개발 서버 (http://localhost:3000) |
| `npm run build` | 프론트엔드 빌드 |
| `npm run build:server` | 백엔드 TypeScript 컴파일 |
| `npm run start:server` | 빌드된 백엔드 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run lint:fix` | ESLint 자동 수정 |
| `npm run test` | 유닛 테스트 실행 (node:test) |
| `npm run check` | lint + build + test 전체 검증 |
| `npm run preview` | 빌드된 프론트엔드 미리보기 |

## 관리자 대시보드

콘텐츠 원본은 PostgreSQL이며 관리자 대시보드에서 직접 관리합니다. 로그인 후 다음 하위 페이지에서 전체 필드와 관계를 CRUD할 수 있습니다.

- `/admin/posts`: 블로그 포스트, 태그, 프로젝트 관계
- `/admin/projects`: 프로젝트, 기술 스택, 포스트 관계
- `/admin/stacks`: 기술 스택 메타데이터
- `/admin/awards`: 수상 내역과 프로젝트 관계

관리자 mutation API는 HMAC 서명 HttpOnly 세션 쿠키, `SameSite=Strict`, 로그인 rate limit, Origin allowlist 및 입력 길이/URL 검증으로 보호됩니다. 프로덕션에서는 `ADMIN_SESSION_SECRET`에 최소 32자의 임의 값을 사용하고 `CORS_ORIGIN`에 실제 프론트엔드 Origin만 쉼표로 구분해 설정하세요.

## 빌드 및 배포

```bash
# DB 마이그레이션 (배포 단계에서 먼저 실행)
cd server && npx prisma migrate deploy && cd ..

# 전체 검증 (CI와 동일)
npm run check

# 프론트엔드 빌드
npm run build

# 백엔드 빌드
npm run build:server
```

## 환경 변수

`.env.example` 파일을 참고하여 `.env` 파일을 생성하세요. 각 변수의 용도와 보안 주의사항이 문서화되어 있습니다.

### 프로덕션 주의사항

- 애플리케이션 시작 시 자동 마이그레이션하지 말고 CI/CD에서 `npx prisma migrate deploy`를 먼저 실행하세요.
- `VITE_` 접두사가 붙은 변수는 클라이언트 번들에 포함되므로 비밀 정보를 넣지 마세요.
- `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, DB 및 S3 자격증명은 절대 커밋하지 마세요.
- `CORS_ORIGIN`에는 신뢰하는 프론트엔드 Origin만 등록하세요. 와일드카드는 사용하지 않습니다.

## 접속 URL

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

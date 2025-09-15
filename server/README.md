# Portfolio API Server

Hono를 사용한 포트폴리오 API 서버입니다.

## 로컬 개발

```bash
npm install
npm run dev
```

## Vercel 배포

### 1. Vercel CLI 설치 및 로그인

```bash
npm install -g vercel
vercel login
```

### 2. 프로젝트 배포

```bash
vercel
```

### 3. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

- `ALLOWED_ORIGINS`: 허용할 오리진들 (쉼표로 구분)
  - 예: `https://devfiro.com,https://your-portfolio-domain.vercel.app`
- `NODE_ENV`: `production`

### 4. 로컬에서 Vercel 환경 테스트

```bash
npm run vercel-dev
```

## API 엔드포인트

- `GET /` - API 상태 확인
- `GET /blog/posts` - 모든 블로그 포스트 목록
- `GET /blog/post/:title` - 특정 블로그 포스트 상세

## 프로젝트 구조

```
server/
├── src/
│   ├── index.ts          # 메인 서버 파일
│   ├── router/
│   │   └── posts.ts      # 블로그 라우터
│   └── utils/
│       ├── markdown.ts   # 마크다운 처리 유틸
│       └── post.ts       # 포스트 처리 유틸
├── posts/
│   └── content/          # 마크다운 포스트 파일들
├── vercel.json           # Vercel 배포 설정
└── package.json
```

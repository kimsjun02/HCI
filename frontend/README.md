# 스마트 일정 관리 시스템 - 프론트엔드

Next.js 14 App Router 기반의 스마트 일정 관리 시스템 프론트엔드 애플리케이션입니다.

## 🚀 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **UI 라이브러리**: React 18
- **스타일링**: Tailwind CSS
- **상태 관리**: Zustand
- **데이터 페칭**: Native Fetch API / WebSocket
- **폼 검증**: React Hook Form + Zod

## 📂 프로젝트 구조

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 홈페이지
│   │   ├── (dashboard)/        # 대시보드 그룹
│   │   │   ├── dashboard/      # 대시보드 페이지
│   │   │   ├── tasks/          # 할일 페이지
│   │   │   ├── calendar/       # 캘린더 페이지
│   │   │   └── settings/       # 설정 페이지
│   │   └── globals.css         # 전역 스타일
│   ├── components/             # React 컴포넌트
│   │   ├── common/             # 공통 컴포넌트
│   │   ├── tasks/              # 할일 컴포넌트
│   │   ├── calendar/           # 캘린더 컴포넌트
│   │   └── email/              # 이메일 컴포넌트
│   ├── hooks/                  # 커스텀 훅
│   ├── services/               # API 통신 서비스
│   ├── store/                  # 전역 상태 관리 (Zustand)
│   ├── types/                  # TypeScript 타입
│   ├── utils/                  # 유틸리티 함수
│   └── constants/              # 상수
├── public/                     # 정적 파일
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🛠️ 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_APP_ENV=development
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하세요.

## 📝 주요 기능

### 1. 대시보드
- 전체 통계 요약 (할일, 일정, 이메일)
- 최근 활동 내역
- 빠른 작업 실행

### 2. 할일 관리
- 할일 생성, 수정, 삭제
- 상태 관리 (시작 전, 진행중, 완료, 취소)
- 우선순위 설정 (낮음, 보통, 높음)
- 필터링 및 검색

### 3. 캘린더
- 월간/주간/일간 뷰
- 일정 등록 및 관리
- 이벤트 드래그 앤 드롭

### 4. 이메일 통합
- 이메일 조회 및 검색
- 이메일 기반 할일 생성
- 미읽음/중요 표시

## 🎨 스타일링 규칙

### Tailwind CSS 사용
- 재사용 가능한 컴포넌트는 별도 파일로 분리
- `cn()` 유틸리티 함수로 클래스 병합
- 다크 모드 지원 (`dark:` 접두사)

### 컴포넌트 스타일 예제

```typescript
<button className="btn-primary">
  버튼
</button>

<div className="card">
  카드 컨텐츠
</div>
```

## 🔧 코딩 컨벤션

### 파일 명명
- 컴포넌트: `PascalCase.tsx` (예: `TaskCard.tsx`)
- 훅: `camelCase.ts` (예: `useTasks.ts`)
- 유틸리티: `camelCase.ts` (예: `formatDate.ts`)

### 컴포넌트 작성
- 함수형 컴포넌트 사용
- Props 타입은 `interface`로 정의
- `React.FC` 사용 금지 (명시적 타입 지정)

### Import 순서
1. React 및 Next.js
2. 외부 라이브러리
3. 내부 컴포넌트
4. 훅
5. 타입
6. 유틸리티
7. 상수

## 🧪 테스트

```bash
# 단위 테스트 실행
npm test

# 커버리지 확인
npm run test:coverage
```

## 🚀 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📚 추가 문서

- [프로젝트 구조 규칙](./.cursor/rules/01-project-structure.mdc)
- [React/Next.js 규칙](./.cursor/rules/02-react-nextjs.mdc)
- [상태 관리 규칙](./.cursor/rules/03-state-management.mdc)
- [API 데이터 페칭](./.cursor/rules/04-api-data-fetching.mdc)
- [UI 스타일링 규칙](./.cursor/rules/05-ui-styling.mdc)

## 🤝 기여하기

1. 새로운 기능 개발 전 해당 규칙 파일 확인
2. 규칙을 따라 코드 작성
3. ESLint 및 Prettier 검사 통과
4. Pull Request 생성

## 📞 문의

프로젝트 관련 문의사항이 있으시면 팀 리드에게 연락해주세요.

---

**마지막 업데이트**: 2025-11-04
**버전**: 1.0.0


# 스마트 일정 관리 시스템 - 개발 모듈 계획

## 📋 목차

1. [시스템 아키텍처](#시스템-아키텍처)
2. [백엔드 모듈](#백엔드-모듈)
3. [프론트엔드 모듈](#프론트엔드-모듈)
4. [공유 모듈 및 유틸리티](#공유-모듈-및-유틸리티)
5. [데이터베이스 스키마](#데이터베이스-스키마)
6. [API 명세](#api-명세)
7. [개발 우선순위](#개발-우선순위)

---

## 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                      클라이언트 (Frontend)                    │
│  (Next.js + React + TypeScript + Tailwind CSS)               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP/WebSocket
                       │
┌──────────────────────┴──────────────────────────────────────┐
│                   API Gateway / Next.js Server               │
│              (라우팅, 요청 처리, 검증)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌────────────────┐ ┌────────────┐ ┌──────────────┐
│  비즈니스      │ │ 외부        │ │ 알림/        │
│  로직 서비스   │ │ 서비스      │ │ 실시간       │
│ (Node.js)      │ │ 통합        │ │ 시스템       │
│                │ │ (Gmail,     │ │ (WebSocket)  │
└────────────────┘ │ OpenAI)     │ └──────────────┘
                   └────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│      PostgreSQL 데이터베이스             │
│  (사용자, 할일, 캘린더, 이메일 메타데이터) │
└─────────────────────────────────────────┘
```

---

## 백엔드 모듈

### 1. 할일 관리 모듈 (`task-service`)

**책임**: 할일의 CRUD 작업 및 상태 관리

**주요 기능**:

- 할일 생성, 읽기, 수정, 삭제
- 할일 상태 전환 (미시작 → 진행 중 → 완료)
- 할일 우선순위 관리
- 반복 일정 설정
- 할일 필터링 및 정렬
- 할일 검색

**주요 함수/클래스**:

```
- TaskService.createTask()
- TaskService.updateTask()
- TaskService.deleteTask()
- TaskService.getTaskById()
- TaskService.listTasks()
- TaskService.updateTaskStatus()
- TaskService.setPriority()
- TaskService.setRecurrence()
- TaskService.filterTasks()
```

**데이터 모델**:

```
Task {
  id: UUID
  userId: UUID
  title: String
  description: String
  status: Enum(NOT_STARTED, IN_PROGRESS, COMPLETED)
  priority: Enum(LOW, MEDIUM, HIGH, URGENT)
  dueDate: DateTime
  recurrence: Enum(NONE, DAILY, WEEKLY, MONTHLY)
  emailId: UUID (optional)
  categoryId: UUID
  createdAt: DateTime
  updatedAt: DateTime
}
```

**API 엔드포인트**:

```
POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
PATCH  /api/tasks/:id/status
GET    /api/tasks/search
```

---

### 2. 캘린더 관리 모듈 (`calendar-service`)

**책임**: 캘린더 조회, 일정 시각화, 충돌 감지

**주요 기능**:

- 월간/주간/일간 일정 조회
- 특정 날짜의 할일 조회
- 일정 충돌 감지
- 캘린더 색상 코딩
- 할일을 캘린더에 바인딩

**주요 함수/클래스**:

```
- CalendarService.getMonthView()
- CalendarService.getWeekView()
- CalendarService.getDayView()
- CalendarService.getTasksByDate()
- CalendarService.detectConflicts()
- CalendarService.getTasksByDateRange()
```

**API 엔드포인트**:

```
GET /api/calendar/month/:year/:month
GET /api/calendar/week/:year/:week
GET /api/calendar/day/:year/:month/:day
GET /api/calendar/tasks/:date
```

---

### 4. 이메일 연동 모듈 (`email-integration-service`)

**책임**: Gmail API 연동, 이메일 모니터링, 메타데이터 추출

**주요 기능**:

- Gmail 계정 연동
- 실시간 이메일 감시 (Push Notifications)
- 이메일 메타데이터 추출 (발신자, 제목, 본문, 첨부파일)
- 이메일 히스토리 관리
- 이메일과 할일 연결

**구현 기술**:

- `googleapis`: Google Gmail API
- `webhooks`: Gmail Push Notifications

**주요 함수/클래스**:

```
- GmailService.connect()
- GmailService.listEmails()
- GmailService.getEmailById()
- GmailService.watchInbox()
- GmailService.extractMetadata()
- GmailService.subscribeToNotifications()
```

**데이터 모델**:

```
Email {
  id: String (Gmail ID)
  userId: UUID
  from: String
  to: String
  subject: String
  body: String
  timestamp: DateTime
  importance: Enum(LOW, MEDIUM, HIGH)
  linkedTaskId: UUID (optional)
  extractedTasks: Object[]
  createdAt: DateTime
}
```

**API 엔드포인트**:

```
POST   /api/emails/connect
GET    /api/emails
GET    /api/emails/:id
POST   /api/emails/webhook
DELETE /api/emails/disconnect
```

---

### 4. AI/NLP 분석 모듈 (`ai-analysis-service`)

**책임**: 이메일에서 할일 자동 추출 및 분석

**주요 기능**:

- 자연어 처리로 할일 추출
- 마감 기한 자동 인식
- 우선순위 자동 결정
- 다중 할일 인식
- 동작 동사 감지

**구현 기술**:

- `Genimi API (gemini-2.5-flash)`: 메인 NLP 엔진
- `date-fns`: 날짜 파싱 및 처리

**주요 함수/클래스**:

```
- NLPService.extractTasks()
- NLPService.extractDueDate()
- NLPService.determinePriority()
- NLPService.detectActionVerbs()
- NLPService.parseKoreanDate()
```

**프롬프트 템플릿**:

```
이메일 내용을 분석하여 다음 JSON 형식으로 반환:
{
  "tasks": [
    {
      "title": "할일 제목",
      "description": "설명",
      "dueDate": "YYYY-MM-DD",
      "priority": "HIGH|MEDIUM|LOW",
      "confidence": 0.95
    }
  ]
}
```

**API 엔드포인트**:

```
POST /api/ai/extract-tasks
POST /api/ai/analyze-email
```

---

### 5. 알림 시스템 모듈 (`notification-service`)

**책임**: 사용자 알림 전송 및 관리

**주요 기능**:

- 브라우저 푸시 알림
- 인앱 알림
- 이메일 알림
- 알림 스케줄링
- 알림 우선순위 관리
- 사용자 알림 설정

**구현 기술**:

- `web-push`: 푸시 알림
- `socket.io`: 실시간 인앱 알림
- `bull`: 알림 큐 관리
- `node-schedule`: 스케줄 실행

**주요 함수/클래스**:

```
- NotificationService.sendPushNotification()
- NotificationService.sendInAppNotification()
- NotificationService.sendEmailNotification()
- NotificationService.scheduleNotification()
- NotificationService.getNotificationHistory()
- NotificationService.updatePreferences()
```

**알림 타입**:

- `TASK_ADDED`: 새 할일 추가됨
- `TASK_REMINDER`: 마감 1주일 전
- `TASK_URGENT`: 마감 24시간 전
- `TASK_OVERDUE`: 마감 초과
- `EXTRACTION_CONFIRMATION`: 추출된 할일 확인 요청

**API 엔드포인트**:

```
POST /api/notifications/push-subscribe
POST /api/notifications/send
GET  /api/notifications/history
PUT  /api/notifications/preferences
```

---

### 6. 데이터 관리 모듈 (`data-access`)

**책임**: 데이터베이스 접근 계층 (DAL)

**주요 기능**:

- ORM 처리 (Prisma)
- 트랜잭션 관리
- 쿼리 최적화
- 캐싱 레이어

**구현 기술**:

- `prisma`: ORM
- `redis`: 캐싱

**주요 클래스**:

```
- UserRepository
- TaskRepository
- CalendarRepository
- EmailRepository
- NotificationRepository
```

---

## 프론트엔드 모듈

### 1. 레이아웃 & 네비게이션 모듈 (`layout`)

**책임**: 전체 앱 구조 및 네비게이션 제공

**주요 컴포넌트**:

- `MainLayout`: 전체 레이아웃
- `Sidebar`: 사이드바 네비게이션
- `Header`: 헤더 (사용자 정보, 알림)
- `Footer`: 푸터

**라우트 구조**:

```
/
├─ /dashboard          (대시보드)
├─ /tasks              (할일 목록)
├─ /calendar           (캘린더)
│  ├─ /calendar/month
│  ├─ /calendar/week
│  └─ /calendar/day
├─ /emails             (이메일 연동)
└─ /settings           (설정)
   ├─ /settings/profile
   ├─ /settings/notifications
   └─ /settings/email-sync
```

---

### 2. 할일 관리 모듈 (`tasks`)

**책임**: 할일 조회, 생성, 수정, 삭제 UI

**주요 컴포넌트**:

- `TaskList`: 할일 목록 표시
- `TaskCard`: 할일 카드
- `TaskModal`: 할일 생성/수정 모달
- `TaskFilter`: 필터 및 검색
- `TaskStatus`: 상태 전환 UI

**상세 컴포넌트**:

```
components/tasks/
├─ TaskList.tsx
├─ TaskCard.tsx
├─ TaskModal.tsx
├─ TaskForm.tsx
├─ TaskFilter.tsx
├─ TaskSearch.tsx
├─ PriorityBadge.tsx
├─ StatusBadge.tsx
└─ RecurrenceSelector.tsx
```

**주요 기능**:

- 할일 생성 (모달)
- 할일 수정 (인라인, 모달)
- 할일 삭제 (확인 다이얼로그)
- 할일 상태 변경
- 우선순위 설정
- 반복 일정 설정
- 필터링 (상태, 우선순위, 날짜)
- 검색

---

### 3. 캘린더 모듈 (`calendar`)

**책임**: 다양한 캘린더 뷰 제공

**주요 컴포넌트**:

- `CalendarContainer`: 캘린더 메인 컨테이너
- `MonthView`: 월간 뷰
- `WeekView`: 주간 뷰
- `DayView`: 일간 뷰
- `CalendarHeader`: 월/주 네비게이션
- `TaskTooltip`: 할일 상세 툴팁

**상세 컴포넌트**:

```
components/calendar/
├─ CalendarContainer.tsx
├─ MonthView.tsx
├─ WeekView.tsx
├─ DayView.tsx
├─ CalendarHeader.tsx
├─ DateCell.tsx
├─ TaskTooltip.tsx
└─ CalendarLegend.tsx
```

**주요 기능**:

- 월간/주간/일간 뷰 전환
- 날짜 네비게이션
- 할일 색상 코딩 (우선순위별)
- 마감 임박 강조 표시
- 완료된 할일 표시
- 할일 드래그 & 드롭 (날짜 변경)

**라이브러리**:

- `react-big-calendar`: 캘린더 라이브러리
- `date-fns`: 날짜 처리

---

### 4. 이메일 연동 모듈 (`email-integration`)

**책임**: 이메일 연동 및 설정 UI

**주요 컴포넌트**:

- `EmailConnectButton`: Gmail 연동 버튼
- `EmailList`: 연동된 이메일 목록
- `EmailDetail`: 이메일 상세 보기
- `TaskExtractionPreview`: 추출된 할일 미리보기
- `TaskApprovalModal`: 할일 승인/거부 모달

**상세 컴포넌트**:

```
components/email/
├─ EmailConnectButton.tsx
├─ EmailList.tsx
├─ EmailDetail.tsx
├─ EmailMetadata.tsx
├─ TaskExtractionPreview.tsx
├─ TaskApprovalModal.tsx
└─ EmailSyncStatus.tsx
```

**주요 기능**:

- Gmail 계정 연동
- 연동된 이메일 목록 조회
- 이메일 상세 보기
- 추출된 할일 미리보기
- 할일 승인/거부/수정
- 이메일-할일 연결 표시

---

### 5. 알림 모듈 (`notifications`)

**책임**: 알림 표시 및 관리

**주요 컴포넌트**:

- `NotificationCenter`: 알림 센터
- `NotificationToast`: 토스트 알림
- `NotificationBell`: 알림 아이콘 (배지)
- `NotificationHistory`: 알림 히스토리

**상세 컴포넌트**:

```
components/notifications/
├─ NotificationCenter.tsx
├─ NotificationToast.tsx
├─ NotificationBell.tsx
├─ NotificationHistory.tsx
└─ NotificationPreferences.tsx
```

**주요 기능**:

- 실시간 알림 표시
- 알림 센터에서 히스토리 조회
- 알림 설정 관리
- 알림 우선순위 표시

---

### 6. 설정 모듈 (`settings`)

**책임**: 사용자 설정 페이지

**주요 컴포넌트**:

- `ProfileSettings`: 프로필 수정
- `NotificationSettings`: 알림 설정
- `EmailSyncSettings`: 이메일 동기화 설정
- `ThemeSettings`: 테마/다크모드 설정
- `AccountSettings`: 계정 설정

**상세 컴포넌트**:

```
components/settings/
├─ ProfileSettings.tsx
├─ NotificationSettings.tsx
├─ EmailSyncSettings.tsx
├─ ThemeSettings.tsx
├─ AccountSettings.tsx
└─ SettingsTabs.tsx
```

**주요 기능**:

- 프로필 정보 수정
- 알림 채널 설정 (이메일, 푸시, 인앱)
- 이메일 동기화 일정 설정
- 다크모드 토글
- 언어 변경
- 비밀번호 변경
- 계정 삭제

---

### 7. 공통 컴포넌트 모듈 (`common`)

**책임**: 재사용 가능한 UI 컴포넌트

**주요 컴포넌트**:

```
components/common/
├─ Button.tsx
├─ Input.tsx
├─ Modal.tsx
├─ Dropdown.tsx
├─ Loading.tsx
├─ ErrorBoundary.tsx
├─ Spinner.tsx
├─ Alert.tsx
├─ Confirm.tsx
├─ Badge.tsx
├─ Tag.tsx
└─ Pagination.tsx
```

---

## 공유 모듈 및 유틸리티

### 1. API 클라이언트 (`api-client`)

**책임**: 백엔드 API 통신

**주요 클래스**:

```typescript
// services/api.ts
-ApiClient.get() -
  ApiClient.post() -
  ApiClient.put() -
  ApiClient.delete() -
  ApiClient.setToken() -
  // services/taskApi.ts
  TaskApi.createTask() -
  TaskApi.updateTask() -
  TaskApi.deleteTask() -
  TaskApi.listTasks() -
  // services/calendarApi.ts
  CalendarApi.getMonthView() -
  CalendarApi.getWeekView() -
  // services/emailApi.ts
  EmailApi.connectGmail() -
  EmailApi.listEmails() -
  // services/notificationApi.ts
  NotificationApi.getHistory() -
  NotificationApi.updatePreferences();
```

---

### 2. 상태 관리 (`state-management`)

**책임**: 전역 상태 관리

**주요 스토어** (Redux 또는 Zustand):

```
store/
├─ taskSlice.ts       (할일 목록)
├─ calendarSlice.ts   (캘린더 데이터)
├─ emailSlice.ts      (이메일 상태)
├─ notificationSlice.ts (알림)
└─ uiSlice.ts         (UI 상태: 모달, 사이드바 등)
```

---

### 3. 훅 모듈 (`hooks`)

**주요 커스텀 훅**:

```typescript
// hooks/useTasks.ts
-useTasks() - // 할일 CRUD
  useTaskFilter() - // 할일 필터링
  // hooks/useCalendar.ts
  useCalendar() - // 캘린더 데이터
  useCalendarView() - // 뷰 전환
  // hooks/useNotification.ts
  useNotification() - // 알림 표시
  // hooks/usePagination.ts
  usePagination(); // 페이지네이션
```

---

### 4. 유틸리티 모듈 (`utils`)

**주요 유틸리티**:

```
utils/
├─ dateUtils.ts       // 날짜 처리
├─ formatUtils.ts     // 형식 변환
├─ validationUtils.ts // 폼 검증
├─ storageUtils.ts    // 로컬 스토리지
├─ errorHandler.ts    // 에러 처리
├─ constants.ts       // 상수 정의
└─ helpers.ts         // 헬퍼 함수
```

**주요 함수**:

```typescript
// dateUtils
-formatDate() -
  parseDate() -
  getDaysInMonth() -
  getWeekNumber() -
  calculateDueDate() -
  // validationUtils
  validateEmail() -
  validateTaskForm() -
  // errorHandler
  handleApiError() -
  showErrorMessage();
```

---

### 5. 타입 정의 모듈 (`types`)

**주요 타입**:

```typescript
// types/index.ts
-User - Task - Calendar - Email - Notification - ApiResponse - ApiError;
```

---

### 6. 상수 모듈 (`constants`)

**주요 상수**:

```typescript
// constants/index.ts
-TASK_STATUS -
  TASK_PRIORITY -
  RECURRENCE_TYPE -
  NOTIFICATION_TYPE -
  API_ENDPOINTS -
  ERROR_MESSAGES;
```

---

## 데이터베이스 스키마

### 주요 테이블

```sql
-- 사용자
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  avatar_url VARCHAR,
  theme VARCHAR DEFAULT 'light',
  language VARCHAR DEFAULT 'ko',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 할일
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR DEFAULT 'NOT_STARTED',
  priority VARCHAR DEFAULT 'MEDIUM',
  due_date TIMESTAMP,
  recurrence VARCHAR DEFAULT 'NONE',
  email_id VARCHAR,
  category_id UUID,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 이메일 메타데이터
CREATE TABLE emails (
  id VARCHAR PRIMARY KEY,
  user_id UUID NOT NULL,
  from_email VARCHAR,
  to_email VARCHAR,
  subject VARCHAR,
  body TEXT,
  timestamp TIMESTAMP,
  importance VARCHAR,
  metadata JSONB,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 이메일과 할일 연결
CREATE TABLE email_task_mapping (
  id UUID PRIMARY KEY,
  email_id VARCHAR,
  task_id UUID,
  confidence DECIMAL,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

-- 알림
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  type VARCHAR NOT NULL,
  title VARCHAR,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 알림 설정
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  push_enabled BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT TRUE,
  in_app_enabled BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

```

---

## API 명세

### 할일 API

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "재료 특성 분석",
  "description": "금요일까지 완료",
  "priority": "HIGH",
  "dueDate": "2025-11-07T18:00:00Z",
  "recurrence": "NONE"
}

Response: 201 Created
{
  "id": "uuid",
  "userId": "uuid",
  "title": "재료 특성 분석",
  "status": "NOT_STARTED",
  "priority": "HIGH",
  "dueDate": "2025-11-07T18:00:00Z",
  "createdAt": "2025-11-04T10:00:00Z"
}
```

```http
GET /api/tasks?status=NOT_STARTED&priority=HIGH

Response: 200 OK
{
  "tasks": [...],
  "total": 10,
  "page": 1
}
```

---

### 캘린더 API

```http
GET /api/calendar/month/2025/11

Response: 200 OK
{
  "year": 2025,
  "month": 11,
  "days": [
    {
      "date": "2025-11-01",
      "tasks": [...]
    }
  ]
}
```

---

### 이메일 API

```http
POST /api/emails/connect

Response: 200 OK
{
  "authUrl": "https://accounts.google.com/o/oauth2/..."
}
```

```http
GET /api/emails

Response: 200 OK
{
  "emails": [...],
  "total": 50,
  "page": 1
}
```

---

### AI 분석 API

```http
POST /api/ai/extract-tasks
Content-Type: application/json

{
  "emailId": "gmail-id",
  "subject": "재료 특성 분석 결과 제출",
  "body": "금요일까지 재료 특성 분석 결과를 제출해주세요..."
}

Response: 200 OK
{
  "tasks": [
    {
      "title": "재료 특성 분석 결과 제출",
      "description": "금요일까지",
      "priority": "HIGH",
      "dueDate": "2025-11-07",
      "confidence": 0.95
    }
  ]
}
```

---

### 알림 API

```http
POST /api/notifications/send
Content-Type: application/json

{
  "type": "TASK_ADDED",
  "taskId": "uuid",
  "message": "새로운 할일이 추가되었습니다"
}

Response: 200 OK
{
  "notificationId": "uuid"
}
```

---

## 개발 우선순위

### Phase 1: 기본 기능 (1-2주)

- [ ] 할일 CRUD 기능
- [ ] 기본 캘린더 뷰 (월간)
- [ ] 기본 UI 컴포넌트

### Phase 2: 핵심 기능 (2-3주)

- [ ] 이메일 연동 (Gmail)
- [ ] AI 기반 할일 추출
- [ ] 알림 시스템 (기본)
- [ ] 캘린더 뷰 확장 (주간, 일간)

### Phase 3: 고급 기능 (2주)

- [ ] 사용자 확인 알림 시스템
- [ ] 우선순위 자동 결정
- [ ] 반복 일정 기능
- [ ] 분석 대시보드 (기본)

### Phase 4: 최적화 및 추가 기능 (1주)

- [ ] 성능 최적화
- [ ] 다크모드
- [ ] 협업 기능 (기본)
- [ ] 배포 및 모니터링

---

## 개발 순서 (의존성 기반)

```
1. 프로젝트 셋업 및 기본 구조
   ├─ Next.js 프로젝트 초기화
   ├─ PostgreSQL 연결
   └─ 개발 환경 구성

2. 할일 관리 시스템
   ├─ 백엔드: Task API
   └─ 프론트엔드: 할일 목록 및 CRUD UI

3. 캘린더 시스템
   ├─ 백엔드: Calendar API
   └─ 프론트엔드: 캘린더 뷰

4. 이메일 연동
   ├─ 백엔드: Gmail 연동 및 모니터링
   └─ 프론트엔드: 이메일 연동 UI

5. AI 분석 시스템
   ├─ 백엔드: NLP 기반 할일 추출
   └─ 프론트엔드: 추출 결과 승인/거부

6. 알림 시스템
   ├─ 백엔드: 알림 서비스 및 스케줄
   └─ 프론트엔드: 알림 표시

7. 설정 및 추가 기능
   ├─ 백엔드: 사용자 설정 저장
   └─ 프론트엔드: 설정 페이지

8. 배포 및 모니터링
   ├─ Railway 배포
   ├─ 에러 모니터링 (Sentry)
   └─ 성능 모니터링 (Datadog)
```

---

## 파일 구조 (권장)

```
smart-task-calendar/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── (dashboard)/
│   │   │   └── api/
│   │   ├── components/
│   │   │   ├── calendar/
│   │   │   ├── tasks/
│   │   │   ├── email/
│   │   │   ├── notifications/
│   │   │   ├── settings/
│   │   │   └── common/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   └── constants/
│   ├── package.json
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── config/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml
└── README.md
```

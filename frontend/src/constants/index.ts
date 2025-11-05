// 할일 상태
export const TASK_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

// 할일 우선순위
export const TASK_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

// API 엔드포인트
export const API_ENDPOINTS = {
  TASKS: "/tasks",
  CALENDAR: "/calendar",
  EMAIL: "/email",
  AUTH: "/auth",
} as const;

// 날짜 형식
export const DATE_FORMAT = {
  DISPLAY: "yyyy년 MM월 dd일",
  INPUT: "yyyy-MM-dd",
  TIME: "HH:mm",
} as const;

// 페이지 크기
export const PAGE_SIZE = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 50,
} as const;


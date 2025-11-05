"use client";

import { useState } from "react";

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  read: boolean;
  important: boolean;
}

const mockEmails: Email[] = [
  {
    id: "1",
    sender: "홍길동",
    subject: "프로젝트 진행 상황 공유",
    preview: "안녕하세요, 이번 주 프로젝트 진행 상황을 공유드립니다. 현재 프론트엔드 개발이 90% 완료되었습니다...",
    time: "오전 10:30",
    read: false,
    important: true,
  },
  {
    id: "2",
    sender: "김철수",
    subject: "회의 일정 변경 안내",
    preview: "예정되었던 회의 일정이 다음과 같이 변경되었습니다. 변경된 일시: 11월 6일 오후 2시...",
    time: "어제",
    read: true,
    important: false,
  },
  {
    id: "3",
    sender: "이영희",
    subject: "자료 요청 드립니다",
    preview: "안녕하세요, 다음 자료를 요청드립니다. 1. 월간 보고서 2. 팀 회의록...",
    time: "2일 전",
    read: true,
    important: false,
  },
  {
    id: "4",
    sender: "박민수",
    subject: "새로운 기능 제안",
    preview: "다음과 같은 새로운 기능을 제안드립니다. 사용자 경험을 개선할 수 있을 것 같습니다...",
    time: "3일 전",
    read: false,
    important: true,
  },
  {
    id: "5",
    sender: "최지영",
    subject: "버그 리포트",
    preview: "대시보드 페이지에서 다음과 같은 버그를 발견했습니다...",
    time: "3일 전",
    read: true,
    important: false,
  },
];

export default function EmailPage() {
  const [emails] = useState<Email[]>(mockEmails);
  const [filter, setFilter] = useState<"all" | "unread" | "important" | "sent">("all");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const filteredEmails = emails.filter((email) => {
    if (filter === "unread") return !email.read;
    if (filter === "important") return email.important;
    return true;
  });

  const unreadCount = emails.filter((email) => !email.read).length;
  const importantCount = emails.filter((email) => email.important).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          이메일
        </h1>
        <button className="btn-primary">📝 새 이메일 작성</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-sm text-gray-600 dark:text-gray-400">전체</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {emails.length}
          </p>
        </div>
        <div className="card text-center bg-blue-50 dark:bg-blue-900/20 hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-sm text-blue-600 dark:text-blue-400">미읽음</p>
          <p className="text-3xl font-bold text-blue-600">{unreadCount}</p>
        </div>
        <div className="card text-center bg-red-50 dark:bg-red-900/20 hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-sm text-red-600 dark:text-red-400">중요</p>
          <p className="text-3xl font-bold text-red-600">{importantCount}</p>
        </div>
        <div className="card text-center bg-yellow-50 dark:bg-yellow-900/20 hover:shadow-md transition-shadow cursor-pointer">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">읽음</p>
          <p className="text-3xl font-bold text-yellow-600">
            {emails.length - unreadCount}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            filter === "all"
              ? "bg-primary-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          📨 받은편지함 ({emails.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            filter === "unread"
              ? "bg-primary-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          📩 미읽음 ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("important")}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            filter === "important"
              ? "bg-primary-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          ⭐ 중요 ({importantCount})
        </button>
        <button
          onClick={() => setFilter("sent")}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            filter === "sent"
              ? "bg-primary-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          📤 보낸편지함 (0)
        </button>
      </div>

      {/* Email List */}
      <div className="card">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredEmails.length > 0 ? (
            filteredEmails.map((email) => (
              <EmailItem
                key={email.id}
                email={email}
                onClick={() => setSelectedEmail(email)}
              />
            ))
          ) : (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              해당 조건의 이메일이 없습니다
            </div>
          )}
        </div>
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <EmailDetailModal
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
        />
      )}

      {/* Info Box */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <svg
            className="w-6 h-6 text-blue-600 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              데모 데이터 안내
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              현재 표시된 이메일은 데모 데이터입니다. 실제 이메일 연동을 위해서는 Gmail API 또는 Outlook API 연동이 필요합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailItem({
  email,
  onClick,
}: {
  email: Email;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
        !email.read
          ? "bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500"
          : ""
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {email.sender[0]}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3
              className={`text-sm font-medium ${
                !email.read
                  ? "text-gray-900 dark:text-white font-bold"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {email.sender}
            </h3>
            <div className="flex items-center space-x-2">
              {email.important && (
                <span className="text-yellow-500 text-xl" title="중요">
                  ⭐
                </span>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {email.time}
              </span>
            </div>
          </div>
          <p
            className={`text-sm mb-1 ${
              !email.read
                ? "text-gray-900 dark:text-white font-semibold"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {email.subject}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {email.preview}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmailDetailModal({
  email,
  onClose,
}: {
  email: Email;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {email.subject}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-lg">
              {email.sender[0]}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {email.sender}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{email.time}</p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {email.preview}
              {"\n\n"}
              이것은 샘플 이메일 내용입니다. 실제 이메일 시스템이 연동되면 전체 내용이 표시됩니다.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 px-6 py-4 flex space-x-3">
          <button className="btn-primary">↩ 답장</button>
          <button className="btn-secondary">↪ 전달</button>
          <button className="btn-secondary">🗑 삭제</button>
        </div>
      </div>
    </div>
  );
}

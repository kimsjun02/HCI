"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                일정 관리
              </h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <nav className="space-y-2">
            <NavItem
              href="/dashboard"
              icon="📊"
              label="대시보드"
              collapsed={!sidebarOpen}
            />
            <NavItem
              href="/tasks"
              icon="✓"
              label="할일"
              collapsed={!sidebarOpen}
            />
            <NavItem
              href="/calendar"
              icon="📅"
              label="캘린더"
              collapsed={!sidebarOpen}
            />
            <NavItem
              href="/email"
              icon="✉️"
              label="이메일"
              collapsed={!sidebarOpen}
            />
            <NavItem
              href="/settings"
              icon="⚙️"
              label="설정"
              collapsed={!sidebarOpen}
            />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              스마트 일정 관리
            </h2>
            <div className="flex items-center space-x-2">
              {/* 테마 토글 버튼 */}
              <ThemeToggle />
              
              {/* 알림 버튼 */}
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg
                  className="w-6 h-6 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              
              {/* 사용자 아바타 */}
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                U
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
  collapsed,
}: {
  href: string;
  icon: string;
  label: string;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      <span className="text-xl">{icon}</span>
      {!collapsed && (
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
      )}
    </Link>
  );
}


"use client";

import { useState } from "react";
import { format } from "date-fns";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          캘린더
        </h1>
        <div className="flex items-center space-x-4">
          <button className="btn-secondary">오늘</button>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              &lt;
            </button>
            <span className="text-lg font-medium">
              {format(currentDate, "yyyy년 MM월")}
            </span>
            <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
              &gt;
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 rounded ${
                view === "month"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              onClick={() => setView("month")}
            >
              월
            </button>
            <button
              className={`px-3 py-1 rounded ${
                view === "week"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              onClick={() => setView("week")}
            >
              주
            </button>
            <button
              className={`px-3 py-1 rounded ${
                view === "day"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              onClick={() => setView("day")}
            >
              일
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-700 dark:text-gray-300 py-2"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square p-2 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
            >
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">다가오는 일정</h2>
        <div className="space-y-3">
          <EventItem title="팀 미팅" time="14:00 - 15:00" color="blue" />
          <EventItem title="고객 미팅" time="16:00 - 17:00" color="green" />
        </div>
      </div>
    </div>
  );
}

function EventItem({
  title,
  time,
  color,
}: {
  title: string;
  time: string;
  color: string;
}) {
  return (
    <div
      className={`flex items-center p-3 rounded-lg border-l-4 ${
        color === "blue"
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-green-500 bg-green-50 dark:bg-green-900/20"
      }`}
    >
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{time}</p>
      </div>
    </div>
  );
}

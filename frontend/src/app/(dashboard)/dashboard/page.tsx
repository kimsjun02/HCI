"use client";

import { useState, useEffect } from "react";
import { taskApi } from "@/services/taskApi.service";
import Link from "next/link";
import type { Task } from "@/types";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskApi.listTasks();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "IN_PROGRESS"
  ).length;
  const notStartedTasks = tasks.filter(
    (t) => t.status === "NOT_STARTED"
  ).length;

  // 오늘 마감인 할일
  const today = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate).toISOString().split("T")[0];
    return dueDate === today;
  });

  // 최근 할일 (최대 5개)
  const recentTasks = tasks
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          대시보드
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="전체 할일"
          value={totalTasks.toString()}
          subtitle={`진행중 ${inProgressTasks}개`}
          color="blue"
        />
        <StatCard
          title="완료된 할일"
          value={completedTasks.toString()}
          subtitle={`${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% 달성`}
          color="green"
        />
        <StatCard
          title="오늘 마감"
          value={todayTasks.length.toString()}
          subtitle="오늘까지"
          color="yellow"
        />
        <StatCard
          title="시작 전"
          value={notStartedTasks.toString()}
          subtitle="대기중"
          color="gray"
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          빠른 작업
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/tasks" className="btn-primary text-center no-underline">
            + 할일 추가
          </Link>
          <Link
            href="/calendar"
            className="btn-secondary text-center no-underline"
          >
            📅 일정 보기
          </Link>
          <Link
            href="/email"
            className="btn-secondary text-center no-underline"
          >
            📧 이메일 확인
          </Link>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            최근 할일
          </h2>
          <Link
            href="/tasks"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            전체 보기 →
          </Link>
        </div>
        {recentTasks.length > 0 ? (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">
            아직 등록된 할일이 없습니다
          </p>
        )}
      </div>

      {/* Urgent Tasks */}
      {notStartedTasks > 0 && (
        <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-start space-x-3">
            <svg
              className="w-6 h-6 text-red-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                시작하지 않은 할일
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                {notStartedTasks}개의 할일이 시작을 기다리고 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: "blue" | "green" | "yellow" | "gray";
}) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    green:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    yellow:
      "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    gray: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
  };

  return (
    <div className={`card ${colorClasses[color]}`}>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <p className="text-4xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {subtitle}
      </p>
    </div>
  );
}

function TaskItem({ task }: { task: Task }) {
  const statusText = {
    NOT_STARTED: "시작 전",
    IN_PROGRESS: "진행중",
    COMPLETED: "완료",
    CANCELLED: "취소됨",
  };

  const statusColor = {
    NOT_STARTED:
      "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    IN_PROGRESS:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    COMPLETED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  const priorityColor = {
    LOW: "text-green-600",
    MEDIUM: "text-yellow-600",
    HIGH: "text-red-600",
  };

  return (
    <Link
      href="/tasks"
      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow no-underline"
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <h4 className="font-medium text-gray-900 dark:text-white">
            {task.title}
          </h4>
          <span
            className={`text-xs font-semibold ${priorityColor[task.priority]}`}
          >
            {task.priority === "HIGH" && "!"}
            {task.priority === "MEDIUM" && "·"}
          </span>
        </div>
        {task.dueDate && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            마감: {new Date(task.dueDate).toLocaleDateString("ko-KR")}
          </p>
        )}
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[task.status]}`}
      >
        {statusText[task.status]}
      </span>
    </Link>
  );
}

"use client";

import { useState, useEffect } from "react";
import { taskApi } from "@/services/taskApi.service";
import type { Task, CreateTaskDto } from "@/types";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | Task["status"]>(
    "ALL"
  );

  // 할일 목록 불러오기
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskApi.listTasks();
      setTasks(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "할일을 불러올 수 없습니다"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 할일 삭제
  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await taskApi.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      alert("삭제에 실패했습니다");
    }
  };

  // 할일 상태 변경 (체크박스)
  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === "COMPLETED" ? "NOT_STARTED" : "COMPLETED";

    try {
      const updated = await taskApi.updateTask(task.id, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      console.error("Status toggle error:", err);
      alert("상태 변경에 실패했습니다");
    }
  };

  // 할일 상태 변경 (드롭다운)
  const handleChangeStatus = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    try {
      const updated = await taskApi.updateTask(taskId, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err) {
      console.error("Status change error:", err);
      alert("상태 변경에 실패했습니다");
    }
  };

  // 할일 수정
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // 필터링된 할일 목록
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "ALL") return true;
    return task.status === filterStatus;
  });

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  const getStatusText = (status: Task["status"]) => {
    switch (status) {
      case "NOT_STARTED":
        return "시작 전";
      case "IN_PROGRESS":
        return "진행중";
      case "COMPLETED":
        return "완료";
      case "CANCELLED":
        return "취소됨";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchTasks} className="btn-primary">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          할일 관리
        </h1>
        <button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          + 새 할일 추가
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setFilterStatus("ALL")}
          className={`px-4 py-2 font-medium ${
            filterStatus === "ALL"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          전체 ({tasks.length})
        </button>
        <button
          onClick={() => setFilterStatus("IN_PROGRESS")}
          className={`px-4 py-2 font-medium ${
            filterStatus === "IN_PROGRESS"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          진행중 ({tasks.filter((t) => t.status === "IN_PROGRESS").length})
        </button>
        <button
          onClick={() => setFilterStatus("COMPLETED")}
          className={`px-4 py-2 font-medium ${
            filterStatus === "COMPLETED"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          완료 ({tasks.filter((t) => t.status === "COMPLETED").length})
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {/* 체크박스 */}
                <input
                  type="checkbox"
                  checked={task.status === "COMPLETED"}
                  onChange={() => handleToggleStatus(task)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3
                      className={`text-lg font-semibold ${
                        task.status === "COMPLETED"
                          ? "line-through text-gray-500"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm">
                    {/* 상태 드롭다운 */}
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleChangeStatus(
                          task.id,
                          e.target.value as Task["status"]
                        )
                      }
                      className={`min-w-[100px] px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                        task.status === "COMPLETED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : task.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : task.status === "CANCELLED"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="NOT_STARTED">시작 전</option>
                      <option value="IN_PROGRESS">진행중</option>
                      <option value="COMPLETED">완료</option>
                      <option value="CANCELLED">취소됨</option>
                    </select>

                    {task.dueDate && (
                      <span className="text-gray-500 dark:text-gray-400">
                        마감:{" "}
                        {new Date(task.dueDate).toLocaleDateString("ko-KR")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="p-2 text-gray-600 hover:text-primary-600"
                  title="수정"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-2 text-gray-600 hover:text-red-600"
                  title="삭제"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && tasks.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            해당 조건의 할일이 없습니다.
          </p>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            아직 등록된 할일이 없습니다.
          </p>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            첫 할일 추가하기
          </button>
        </div>
      )}

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSuccess={() => {
            setIsModalOpen(false);
            setEditingTask(null);
            fetchTasks();
          }}
        />
      )}
    </div>
  );
}

// 할일 추가/수정 모달
function TaskModal({
  task,
  onClose,
  onSuccess,
}: {
  task?: Task | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEditMode = !!task;

  const [formData, setFormData] = useState<CreateTaskDto>({
    userId: task?.userId || "899b078e-7ae0-42ce-851f-425f7ce7be43",
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "MEDIUM",
    status: task?.status || "NOT_STARTED",
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString() : undefined,
    recurrence: "NONE",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("제목을 입력해주세요");
      return;
    }

    try {
      setLoading(true);
      if (isEditMode) {
        await taskApi.updateTask(task.id, formData);
      } else {
        await taskApi.createTask(formData);
      }
      onSuccess();
    } catch (err) {
      console.error("Task save error:", err);
      alert(
        isEditMode ? "할일 수정에 실패했습니다" : "할일 추가에 실패했습니다"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-lg bg-white shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold">
            {isEditMode ? "할일 수정" : "새 할일 추가"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="input"
              placeholder="할일 제목을 입력하세요"
              required
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              설명
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="input"
              rows={3}
              placeholder="상세 설명 (선택사항)"
            />
          </div>

          {/* 우선순위 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              우선순위
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as "LOW" | "MEDIUM" | "HIGH",
                })
              }
              className="input"
            >
              <option value="LOW">낮음</option>
              <option value="MEDIUM">보통</option>
              <option value="HIGH">높음</option>
            </select>
          </div>

          {/* 상태 */}
          {isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                상태
              </label>
              <select
                value={formData.status || "NOT_STARTED"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Task["status"],
                  })
                }
                className="input"
              >
                <option value="NOT_STARTED">시작 전</option>
                <option value="IN_PROGRESS">진행중 🔄</option>
                <option value="COMPLETED">완료 ✅</option>
                <option value="CANCELLED">취소됨 ❌</option>
              </select>
            </div>
          )}

          {/* 마감일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              마감일
            </label>
            <input
              type="date"
              value={
                formData.dueDate
                  ? new Date(formData.dueDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dueDate: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : undefined,
                })
              }
              className="input"
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              취소
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? isEditMode
                  ? "수정 중..."
                  : "추가 중..."
                : isEditMode
                  ? "수정"
                  : "추가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

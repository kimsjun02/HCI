"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    firstName: "태형",
    lastName: "노",
    email: "test@example.com",
    phone: "",
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    urgentAlerts: true,
  });

  const [saved, setSaved] = useState(false);

  // 테마 상태를 로컬 상태와 동기화
  const isDarkMode = theme === "dark";

  const handleSave = () => {
    // 실제로는 API 호출
    console.log("Saving settings:", settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          설정
        </h1>
        {saved && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm font-medium">저장되었습니다!</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-xl">
              {settings.firstName[0]}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                프로필 정보
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                개인 정보를 관리합니다
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                성 (Last Name)
              </label>
              <input
                type="text"
                className="input"
                value={settings.lastName}
                onChange={(e) =>
                  setSettings({ ...settings, lastName: e.target.value })
                }
                placeholder="성을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                이름 (First Name)
              </label>
              <input
                type="text"
                className="input"
                value={settings.firstName}
                onChange={(e) =>
                  setSettings({ ...settings, firstName: e.target.value })
                }
                placeholder="이름을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                이메일
              </label>
              <input
                type="email"
                className="input"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                placeholder="이메일을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                전화번호
              </label>
              <input
                type="tel"
                className="input"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                placeholder="010-1234-5678"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
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
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                알림 설정
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                알림 수신 방법을 선택합니다
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <SettingToggle
              label="이메일 알림"
              description="중요한 업데이트를 이메일로 받습니다"
              checked={settings.emailNotifications}
              onChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
            <SettingToggle
              label="푸시 알림"
              description="실시간 푸시 알림을 받습니다"
              checked={settings.pushNotifications}
              onChange={(checked) =>
                setSettings({ ...settings, pushNotifications: checked })
              }
            />
            <SettingToggle
              label="할일 리마인더"
              description="할일 마감 전에 알림을 받습니다"
              checked={settings.taskReminders}
              onChange={(checked) =>
                setSettings({ ...settings, taskReminders: checked })
              }
            />
            <SettingToggle
              label="긴급 알림"
              description="우선순위가 높은 할일에 대한 알림을 받습니다"
              checked={settings.urgentAlerts}
              onChange={(checked) =>
                setSettings({ ...settings, urgentAlerts: checked })
              }
            />
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                테마 설정
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                화면 테마를 변경합니다
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <SettingToggle
              label="다크 모드"
              description="어두운 테마를 사용합니다"
              checked={isDarkMode}
              onChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </div>

        {/* Account Management */}
        <div className="card border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
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
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                계정 관리
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                계정 설정 및 보안
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="btn-secondary w-full justify-center">
              🔐 비밀번호 변경
            </button>
            <button className="btn-secondary w-full justify-center">
              🔗 연동된 계정 관리
            </button>
            <button className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium">
              🗑️ 계정 삭제
            </button>
          </div>
        </div>

        {/* Save Buttons */}
        <div className="flex justify-end space-x-4 sticky bottom-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary"
          >
            취소
          </button>
          <button onClick={handleSave} className="btn-primary">
            💾 변경사항 저장
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white">{label}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          checked ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

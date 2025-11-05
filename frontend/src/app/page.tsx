export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          스마트 일정 관리 시스템
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI 기반 일정 관리 및 이메일 통합 플랫폼
        </p>
        <div className="space-x-4">
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            대시보드로 이동
          </a>
          <a
            href="/tasks"
            className="inline-block px-6 py-3 bg-white text-primary-600 rounded-lg font-medium border-2 border-primary-600 hover:bg-primary-50 transition-colors"
          >
            할일 관리
          </a>
        </div>
      </div>
    </main>
  );
}


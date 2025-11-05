import React, { useState } from 'react';
import './App.css';
import Toast from './Toast/Toast';

function App() {
  const [isToastOpen, setIsToastOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-28 font-bold text-black mb-8">Toast 컴포넌트 테스트</h1>

        {/* Toast 컴포넌트 테스트 */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-24-bold mb-4">Toast 컴포넌트</h2>
          <button
            onClick={() => setIsToastOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            토스트 표시
          </button>
          <Toast
            isOpen={isToastOpen}
            onClose={() => setIsToastOpen(false)}
            message="URL이 복사 되었습니다."
            type="success"
            duration={5000}
          />
        </section>
      </div>
    </div>
  );
}

export default App;

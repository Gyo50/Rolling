import React, { useState } from 'react';
import './App.css';
import Modal from './Modal/Modal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-28 font-bold text-black mb-8">Modal 컴포넌트 테스트</h1>

        {/* Modal 컴포넌트 테스트 */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-24-bold mb-4">Modal 컴포넌트</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            모달 열기
          </button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            senderName="김동훈"
            relationship="coworker"
            date="2023.07.08"
            content="코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요! 코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요!코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요!코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요!코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요!코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요!"
            buttonText="확인"
          />
        </section>
      </div>
    </div>
  );
}

export default App;

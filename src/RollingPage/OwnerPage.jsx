import React from "react";
import Header from "../components/Header";
import MessageHeader from "../components/MessageHeader";
import DeleteButton from "../components/DeleteButton";

const OwnerPage = () => {
  return (
    <div className="min-h-screen bg-[#f5deb3] flex flex-col">
      {/* 상단 헤더 */}
      <Header />

      {/* 콘텐츠 영역 */}
      <main className="flex flex-col items-center w-full px-6 py-8">
        {/* 상단 메시지 헤더 (To. Ashley Kim 등) */}
        <div className="w-full max-w-7xl flex justify-between items-center mb-4">
          <MessageHeader />
          <DeleteButton />
        </div>

        {/* 메시지 카드 영역 (현재 제외) */}
        <section className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 나중에 메시지 카드 컴포넌트 들어올 자리 */}
          <div className="w-full h-64 bg-white/70 rounded-2xl shadow flex items-center justify-center text-gray-400">
            메시지 카드 컴포넌트 자리 (오류 해결 후 추가 예정)
          </div>
        </section>
      </main>
    </div>
  );
};

export default OwnerPage;

import React, { useState } from "react";
import Header from "../Component/Header/Header";
import MessageHeader from "../Component/Header/MessageHeader";
import DeleteButton from "../Component/Button/Delete-button";
import Modal from "../Component/Modal/Modal";

// 🚨 정적인 메시지 데이터 (ID 추적 및 기타 정보 추가)
const STATIC_MESSAGES = Array.from({ length: 9 }).map((_, index) => ({
  id: index + 1, // 각 메시지를 고유하게 식별
  senderName: `보낸 이 #${index + 1}`,
  content: `안녕하세요, 이것은 ${
    index + 1
  }번째 메시지 카드 내용입니다. 모달창에 표시될 긴 내용입니다.`,
  profileImageURL: `https://placehold.co/40x40/f2dca0/000000?text=${index + 1}`,
  date: `2023.10.${10 + index}`, // 임시 날짜
  relationship: ["동료", "친구", "가족"][index % 3], // 임시 관계 태그
}));

function OwnerPage() {
  // === 메시지 상세보기 모달 상태 ===
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // === 페이지 삭제 확인 모달 상태 (전체 페이지 삭제) ===
  const [isPageDeleteModalOpen, setIsPageDeleteModalOpen] = useState(false);

  // === 메시지 삭제 확인 모달 상태 추가 (개별 메시지 삭제) ===
  const [isMessageDeleteModalOpen, setIsMessageDeleteModalOpen] =
    useState(false);
  const [messageToDeleteId, setMessageToDeleteId] = useState(null); // 삭제할 메시지 ID 추적

  // 카드 클릭 시 모달 열기 핸들러
  const handleCardClick = (message) => {
    setSelectedMessage(message);
    setIsOpen(true);
  };

  // 메시지 상세 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedMessage(null);
  };

  // --- 전체 페이지 삭제 로직 ---
  const handleOpenPageDeleteModal = () => {
    setIsPageDeleteModalOpen(true);
  };

  const handleClosePageDeleteModal = () => {
    setIsPageDeleteModalOpen(false);
  };

  const handleConfirmPageDelete = () => {
    console.log("페이지 전체를 삭제합니다.");
    setIsPageDeleteModalOpen(false);
  };

  // --- 개별 메시지 삭제 로직 ---
  const handleOpenMessageDeleteModal = (id) => {
    setMessageToDeleteId(id); // 삭제할 ID 저장
    setIsMessageDeleteModalOpen(true);
  };

  const handleCloseMessageDeleteModal = () => {
    setIsMessageDeleteModalOpen(false);
    setMessageToDeleteId(null); // ID 초기화
  };

  const handleConfirmMessageDelete = () => {
    // 실제 삭제 로직 (예: 필터링)
    console.log(`${messageToDeleteId}번 메시지를 삭제합니다.`);
    // setSTATIC_MESSAGES(prev => prev.filter(msg => msg.id !== messageToDeleteId));
    handleCloseMessageDeleteModal();
  };

  // 페이지 삭제 확인 모달
  const PageDeleteConfirmModal = () => (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4">
      <h3 className="text-xl font-bold mb-4 text-center">페이지 삭제 확인</h3>
      <p className="text-gray-700 mb-6 text-center">페이지를 삭제하시겠습니까?</p>
      <div className="flex justify-center space-x-3">
        <button
          onClick={handleConfirmPageDelete}
          className="py-2 px-4 bg-purple-600 text-white text-18-regular rounded-lg hover:bg-purple-700 transition flex-1"
        >
          예
        </button>
        <button
          onClick={handleClosePageDeleteModal}
          className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition flex-1"
        >
          아니요
        </button>
      </div>
    </div>
  );

  // 메시지 삭제 확인 모달
  const MessageDeleteConfirmModal = () => (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4">
      <h3 className="text-xl font-bold mb-4 text-center">메시지 삭제 확인</h3>
      <p className="text-gray-700 mb-6 text-center">
        메시지를 삭제하시겠습니까?
      </p>
      <div className="flex justify-center space-x-3">
        <button
          onClick={handleConfirmMessageDelete}
          className="py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition flex-1"
        >
          예
        </button>
        <button
          onClick={handleCloseMessageDeleteModal}
          className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition flex-1"
        >
          아니요
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="overflow-y-scroll owner-page-scrollbar-hide">
        <div className="flex flex-col min-h-screen bg-beige-200">
          {/* 상단 헤더 영역 (고정) */}
          <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-30">
            <div className="mx-auto">
              <Header />
              <div className="flex justify-between items-center px-6">
                <MessageHeader />
              </div>
            </div>
          </div>

          {/* 메시지 카드 영역 */}
          <div className="flex-1 w-full pt-[180px] pb-10 relative">
            <div className="mx-auto px-6 relative max-w-7xl">
              {/* 삭제 버튼 - 페이지 삭제 모달 연결 */}
              <div
                className="absolute top-[-55px] right-8 z-10"
                onClick={handleOpenPageDeleteModal}
              >
                <DeleteButton text="삭제하기" />
              </div>

              {/* 카드 목록 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] mt-[28px] relative z-10">
                {STATIC_MESSAGES.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleCardClick(item)}
                    className="bg-white rounded-xl shadow-md p-6 text-gray-600 flex flex-col justify-between cursor-pointer hover:shadow-lg transition h-[280px]"
                  >
                    {/* 🗑️ 상단: 프로필, 이름, 태그, 휴지통 */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        {/* 프로필 이미지 */}
                        <img
                          src={item.profileImageURL}
                          alt={item.senderName}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        {/* From. 이름 및 태그 */}
                        <div>
                          <div className="font-bold text-gray-900 text-lg">
                            From. {item.senderName}
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            {item.relationship}
                          </span>
                        </div>
                      </div>

                      {/* 개별 메시지 삭제 휴지통 아이콘 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 카드 본문 클릭 방지
                          handleOpenMessageDeleteModal(item.id); // 메시지 삭제 모달 열기
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 transition"
                        aria-label="메시지 삭제"
                      >
                        🗑️
                      </button>
                    </div>

                    {/* 메시지 내용 */}
                    <p className="text-gray-800 line-clamp-4 flex-1">
                      {item.content}
                    </p>

                    {/* 하단: 날짜 */}
                    <div className="mt-4 text-xs text-gray-500">
                      {item.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메시지 상세 모달 렌더링 */}
      {isOpen && selectedMessage && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <Modal
            onClick={(e) => e.stopPropagation()}
            isOpen={isOpen}
            onClose={handleCloseModal}
            senderName={selectedMessage.senderName}
            content={selectedMessage.content}
          />
        </div>
      )}

      {/* 페이지 삭제 확인 모달 렌더링 */}
      {isPageDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center"
          onClick={handleClosePageDeleteModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <PageDeleteConfirmModal />
          </div>
        </div>
      )}

      {/* 🌟 ✅ 메시지 삭제 확인 모달 렌더링 */}
      {isMessageDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center"
          onClick={handleCloseMessageDeleteModal} // 오버레이 클릭 시 닫기
        >
          <div onClick={(e) => e.stopPropagation()}>
            <MessageDeleteConfirmModal />
          </div>
        </div>
      )}
    </>
  );
}

export default OwnerPage;

import React, { useState, useEffect } from "react";
import Header from "../Component/Header/Header.jsx";
import MobileHeader from "../Component/Header/MobileHeader.jsx";
import MessageHeader from "../Component/Header/MessageHeader.jsx";
import DeleteButton from "../Component/Button/Delete-button.jsx";
import Modal from "../Component/Modal/Modal.jsx";
import Card from "../Component/Card/Card.jsx";

// 정적인 메시지 데이터
const STATIC_MESSAGES = Array.from({ length: 15 }).map((_, index) => ({
  id: index + 1,
  senderName: `보낸 이 #${index + 1}`,
  content: `안녕하세요, 이것은 ${
    index + 1
  }번째 메시지 카드 내용입니다. 모달창에 표시될 긴 내용입니다.`,
  profileImageURL: `https://placehold.co/40x40/f2dca0/000000?text=${index + 1}`,
  date: `2023.10.${10 + index}`,
  relationship: ["동료", "친구", "가족"][index % 3],
}));

function OwnerPage() {
  // ==========================
  // 상태 관리
  // ==========================
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isPageDeleteModalOpen, setIsPageDeleteModalOpen] = useState(false);
  const [isMessageDeleteModalOpen, setIsMessageDeleteModalOpen] =
    useState(false);
  const [messageToDeleteId, setMessageToDeleteId] = useState(null);
  const [screenMode, setScreenMode] = useState("pc"); // 'pc' | 'tablet' | 'mobile'

  // ==========================
  // 화면 크기 감지
  // ==========================
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setScreenMode("mobile");
      else if (window.innerWidth < 1024) setScreenMode("tablet");
      else setScreenMode("pc");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ==========================
  // 모달 관련 함수
  // ==========================
  const handleCardClick = (message) => {
    setSelectedMessage(message);
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedMessage(null);
  };

  const handleOpenPageDeleteModal = () => setIsPageDeleteModalOpen(true);
  const handleClosePageDeleteModal = () => setIsPageDeleteModalOpen(false);
  const handleConfirmPageDelete = () => {
    console.log("페이지 전체 삭제!");
    setIsPageDeleteModalOpen(false);
  };

  const handleOpenMessageDeleteModal = (id) => {
    setMessageToDeleteId(id);
    setIsMessageDeleteModalOpen(true);
  };
  const handleCloseMessageDeleteModal = () => {
    setIsMessageDeleteModalOpen(false);
    setMessageToDeleteId(null);
  };
  const handleConfirmMessageDelete = () => {
    console.log(`${messageToDeleteId}번 메시지 삭제`);
    setIsMessageDeleteModalOpen(false);
  };

  // ==========================
  // 삭제 확인 모달
  // ==========================
  const DeleteModal = ({ title, message, onConfirm, onCancel }) => (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-[100]"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
        <p className="text-gray-700 mb-6 text-center">{message}</p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onConfirm}
            className="py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition flex-1"
          >
            예
          </button>
          <button
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition flex-1"
          >
            아니요
          </button>
        </div>
      </div>
    </div>
  );

  // ==========================
  // 렌더링
  // ==========================
  return (
    <>
      <div className="owner-page-scrollbar-hide">
        <div className="flex flex-col min-h-screen bg-beige-200">
          {/* 헤더 */}
          <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-30">
            {screenMode === "mobile" ? (
              <MobileHeader hideCreateButton />
            ) : (
              <>
                <Header hideCreateButton />
                <div className="mx-auto max-w-[1200px]">
                  <MessageHeader hideAvatars={screenMode === "tablet"} />
                </div>
              </>
            )}
          </div>

          {/* 카드 영역 */}
          <div className="flex-1 w-full pt-[102px] sm:pt-[147px] lg:pt-[171px] pb-10 relative">
            <div className="mx-auto max-w-[1200px] px-[24px] relative">
              {/* PC 상단 삭제 버튼 */}
              {screenMode === "pc" && (
                <div className="mx-auto max-w-[1200px] w-full flex justify-end mb-[16px]">
                  <button onClick={handleOpenPageDeleteModal}>
                    <DeleteButton text="삭제하기" />
                  </button>
                </div>
              )}
              {/* ✅ 카드 리스트 */}
              <div
                className="
                  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                  gap-[24px] mt-[28px]
                "
              >
                {STATIC_MESSAGES.map((item) => (
                  <Card
                    key={item.id}
                    senderName={item.senderName}
                    profileImageURL={item.profileImageURL}
                    relationship={item.relationship}
                    content={item.content}
                    date={item.date}
                    onClick={() => handleCardClick(item)}
                    onDeleteClick={(e) => {
                      e.stopPropagation();
                      handleOpenMessageDeleteModal(item.id);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ✅ 모바일/태블릿 하단 삭제 버튼 */}
          {screenMode !== "pc" && (
            <div className="fixed bottom-0 left-0 right-0 z-40 pb-[calc(env(safe-area-inset-bottom)+16px)]">
              <div className="mx-auto max-w-[1200px] px-[24px]">
                <button
                  onClick={handleOpenPageDeleteModal}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-[12px] text-18-bold shadow-lg transition-all"
                >
                  삭제하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메시지 상세 모달 */}
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

      {/* 페이지 삭제 모달 */}
      {isPageDeleteModalOpen && (
        <DeleteModal
          title="페이지 삭제 확인"
          message="페이지를 삭제하시겠습니까?"
          onConfirm={handleConfirmPageDelete}
          onCancel={handleClosePageDeleteModal}
        />
      )}

      {/* 메시지 삭제 모달 */}
      {isMessageDeleteModalOpen && (
        <DeleteModal
          title="메시지 삭제 확인"
          message="이 메시지를 삭제하시겠습니까?"
          onConfirm={handleConfirmMessageDelete}
          onCancel={handleCloseMessageDeleteModal}
        />
      )}
    </>
  );
}

export default OwnerPage;

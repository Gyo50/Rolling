import React, { useState } from "react";
import Header from "../Component/Header/Header.jsx";
import MessageHeader from "../Component/Header/MessageHeader.jsx";
import DeleteButton from "../Component/Button/Delete-button.jsx";
import Modal from "../Component/Modal/Modal.jsx";
import Card from "../Component/Card/Card.jsx";

// 정적인 메시지 데이터
const STATIC_MESSAGES = Array.from({ length: 9 }).map((_, index) => ({
  id: index + 1,
  senderName: `보낸 이 #${index + 1}`,
  content: `안녕하세요, 이것은 ${index + 1}번째 메시지 카드 내용입니다. 모달창에 표시될 긴 내용입니다.`,
  profileImageURL: `https://placehold.co/40x40/f2dca0/000000?text=${index + 1}`,
  date: `2023.10.${10 + index}`,
  relationship: ["동료", "친구", "가족"][index % 3],
}));

function OwnerPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [isPageDeleteModalOpen, setIsPageDeleteModalOpen] = useState(false);
  const [isMessageDeleteModalOpen, setIsMessageDeleteModalOpen] =
    useState(false);
  const [messageToDeleteId, setMessageToDeleteId] = useState(null);

  // 카드 클릭 시 상세 모달
  const handleCardClick = (message) => {
    setSelectedMessage(message);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedMessage(null);
  };

  // 페이지 삭제 관련
  const handleOpenPageDeleteModal = () => setIsPageDeleteModalOpen(true);
  const handleClosePageDeleteModal = () => setIsPageDeleteModalOpen(false);
  const handleConfirmPageDelete = () => {
    console.log("페이지 전체 삭제!");
    setIsPageDeleteModalOpen(false);
  };

  // 개별 메시지 삭제 관련
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

  // 삭제 확인 모달 (내부 정의)
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

  return (
    <>
      <div className="overflow-y-scroll owner-page-scrollbar-hide">
        <div className="flex flex-col min-h-screen bg-beige-200">
          {/* 헤더 */}
          <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-30">
            <div className="mx-auto">
              <Header />
              <div className="flex justify-between items-center px-6 mx-auto">
                <MessageHeader />
              </div>
            </div>
          </div>

          {/* 카드 영역 */}
          <div className="flex-1 w-full pt-[213px] pb-10 relative">
            <div className="mx-auto px-6 relative max-w-7xl">
              {/* 페이지 삭제 버튼 */}
              <div
                className="absolute top-[-63px] right-8 z-10"
                onClick={handleOpenPageDeleteModal}
              >
                <DeleteButton text="삭제하기"/>
              </div>

              {/* 카드 리스트 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] mt-[28px]">
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

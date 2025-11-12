<<<<<<< HEAD
import React from 'react'
import Badge from '../../Component/Badge/Badge'
import Modalbtn from "../../Component/Button/Modal-button"
=======
import React from "react";
import Badge from "../Badge/Badge";
import Modalbtn from "../Button/Modal-button";
>>>>>>> RecipientPage

// TODO: 실제 API 연동 시 아래 URL을 서버에서 제공하는 Endpoint로 교체하세요.
export const MODAL_DATA_API_URL = "https://placeholder.example.com/api/modal";

/**
 * Modal 컴포넌트
 * @param {boolean} isOpen - 모달 열림/닫힘 상태
 * @param {function} onClose - 모달 닫기 함수
 * @param {string} profileImage - 프로필 이미지 URL
 * @param {string} senderName - 보낸 사람 이름
 * @param {string} relationship - 관계 타입 (coworker, other, family, friend)
 * @param {string} date - 날짜
 * @param {string} content - 모달 내용 텍스트
 * @param {string} buttonText - 버튼 텍스트 (기본값: "확인")
 * @param {function} onButtonClick - 버튼 클릭 핸들러
 */

/*******************************변경사항*************************/
// profileImage,senderName,relationship, date, content, apiUrl 삭제
// message객체로  페이지에서 데이터를 받아 처리

function Modal({ isOpen = false, onClose, onButtonClick, message }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleButtonClick = () => {
    onButtonClick?.() || onClose?.();
  };

  // apiUrl은 현재 더미 값이며, 상위 컴포넌트에서 fetch(apiUrl)로 데이터를 받아와 props에 주입하면 됩니다.

  return (
<<<<<<< HEAD
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.54)]"
=======
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#F1F1F1]"
>>>>>>> RecipientPage
      onClick={handleBackdropClick}
    >
      <div className="relative w-[600px] h-[476px] bg-white rounded-2xl shadow-[0px_2px_12px_rgba(0,0,0,0.08)]">
        {/* 헤더 영역 */}
        <div className="relative w-full h-[116px] border-b border-gray-200">
          <div className="absolute left-[39px] top-[40px] flex flex-row items-center gap-4">
            {/* 프로필 이미지 */}
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-full overflow-hidden flex-shrink-0">
              {message ? (
                <img
                  src={message.profileImageURL}
                  alt={message.profileImageURL}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
            </div>

            {/* 이름과 배지 */}
            <div className="flex flex-col items-start gap-1.5">
              <div className="flex flex-row items-start gap-1.5 h-6">
                <span className="text-[20px] leading-6 font-normal text-black">From.</span>
                <span className="text-[20px] leading-6 font-bold text-black">{message.sender}</span>
              </div>
              <Badge text={message.relationship} />
            </div>
          </div>

          {/* 날짜 */}
          <div className="absolute right-[39px] top-[56px]">
            <span className="text-[14px] leading-5 font-normal tracking-[-0.005em] text-gray-400">
              {message.createdAt}
            </span>
          </div>
        </div>

        {/* 내용 영역 */}
        <div className="absolute left-10 top-[116px] w-[520px] h-[256px]">
          <div className="relative w-full h-full overflow-y-auto overflow-x-hidden pr-5">
            {/* 스크롤바 스타일링 */}
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 4px;
              }
              div::-webkit-scrollbar-track {
                background: transparent;
              }
              div::-webkit-scrollbar-thumb {
                background: #cccccc;
                border-radius: 8px;
              }
            `}</style>

            <p className="text-[18px] leading-[28px] font-normal tracking-[-0.01em] text-[#5A5A5A] w-[500px] pt-4">
              {message.content ||
                "코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요!"}
            </p>
          </div>
        </div>

        {/* 버튼 */}
<<<<<<< HEAD
        <div className="absolute left-[240px] bottom-[40px]">
          <Modalbtn onClick={handleButtonClick} text="확인"
          className="px-[15px] py-[7px] text-16-regular text-white"/>
=======
        <div className="absolute left-[240px] bottom-5">
          <Modalbtn onClick={handleButtonClick} />
>>>>>>> RecipientPage
        </div>
      </div>
    </div>
  );
}

/* 사용법
import { useState } from "react";

function App() {
  const [open, setOpen] = useState(false)
  return{
    <button onClick={() => setOpen(true)}>모달 열기</button>
          <Modal
            isOpen={open}
            onClose={() => setOpen(false)}
            senderName="테스터"
            content="모달 내용 테스트" 
          />
  }
}
*/
export default Modal;

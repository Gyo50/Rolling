import React from "react";
import Badge from "../../Component/Badge/Badge";
import Modalbtn from "../../Component/Button/Modal-button";

export const MODAL_DATA_API_URL = "https://placeholder.example.com/api/modal";

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.54)]"
      onClick={handleBackdropClick}
    >
      <div
        className="
          relative
          w-[75%] max-w-[600px]
          bg-white rounded-2xl
          shadow-[0px_2px_12px_rgba(0,0,0,0.08)]
          min-h-[400px]
        "
      >
        {/* 헤더 영역 */}
        <div className="relative w-full h-[116px] border-b border-gray-200 px-6 flex items-center justify-between">
          {/* 왼쪽: 프로필 + From + 배지/날짜 */}
          <div className="flex items-center gap-4">
            {/* 프로필 */}
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-full overflow-hidden">
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

            {/* From + 이름 + (모바일) 배지/날짜 */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[20px] leading-6">From.</span>
                <span className="text-[20px] leading-6 font-bold">
                  {message.sender}
                </span>
              </div>

              {/* 모바일: 배지 + 날짜 */}
              <div className="flex items-center gap-2 sm:hidden">
                <Badge text={message.relationship} />
                <span className="text-[12px] text-gray-400">
                  {message.createdAt}
                </span>
              </div>

              {/* 태블릿/PC: 배지만 */}
              <div className="hidden sm:block">
                <Badge text={message.relationship} />
              </div>
            </div>
          </div>

          {/* 태블릿/PC 날짜 */}
          <span className="hidden sm:block text-[14px] text-gray-400">
            {message.createdAt}
          </span>
        </div>

        {/* 내용 영역 */}
        <div
          className="
            absolute left-10 top-[116px]
            w-[calc(100%-80px)] max-w-[520px]
            h-[256px]
          "
        >
          <div className="relative w-full h-full overflow-y-auto overflow-x-hidden pr-5">
            <p
              className="
                text-[14px] sm:text-[15px] lg:text-[16px]
                leading-[22px] sm:leading-[26px] lg:leading-[28px]
                font-normal tracking-[-0.01em] text-[#5A5A5A]
                w-full max-w-[500px] pt-4
              "
            >
              {message.content ||
                "코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요!"}
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[40px]">
          <Modalbtn
            onClick={handleButtonClick}
            text="확인"
            className="px-[15px] py-[7px] text-16-regular text-white"
          />
        </div>
      </div>
    </div>

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
  
  );
}

export default Modal;
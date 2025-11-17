import React, { useMemo } from "react";
import Badge from "../../Component/Badge/Badge";
import Modalbtn from "../../Component/Button/Modal-button";

export const MODAL_DATA_API_URL = "https://placeholder.example.com/api/modal";

function Modal({ isOpen = false, onClose, onButtonClick, message }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleButtonClick = () => {
    onButtonClick?.() || onClose?.();
  };

  const decodedHtml = useMemo(() => {
    const raw = message?.content || "";
    if (!/[&][lg]t;|&amp;|&#/.test(raw)) return raw;
    const doc = new DOMParser().parseFromString(raw, "text/html");
    return doc.documentElement.textContent || raw;
  }, [message?.content]);
  // 2) 허용 태그만 남기기 (스크립트 차단)
  const contentHtml = useMemo(() => {
    const html = decodedHtml || "";
    return html.replace(/<(?!\/?(b|strong|i|em|u|p|br|span)\b)[^>]*>/gi, "");
  }, [decodedHtml]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.54)]"
      onClick={handleBackdropClick}
    >
      <div
        className="
          relative
          w-[calc(100%-32px)] max-w-[600px]
          bg-white rounded-2xl
          shadow-[0px_2px_12px_rgba(0,0,0,0.08)]
          min-h-[400px]
        "
      >
        {/* 헤더 영역 */}
        <div className="relative pt-[40px] pb-[20px] border-b border-gray-200 mx-6 flex items-center justify-between">
          {/* 왼쪽: 프로필 + From + 배지/날짜 */}
          <div className="relative flex items-center w-full">
            {/* 프로필 */}
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

            {/* From + 이름 + (모바일) 배지/날짜 */}
            <div className="flex flex-col gap-1 mx-[16px] flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[20px] leading-6">From.</span>
                <span className="text-[20px] leading-6 font-bold">{message.sender}</span>
              </div>

              {/* 모바일: 배지 + 날짜 */}
              <div className="flex items-center gap-2">
                <Badge text={message.relationship} type={message.relationship} />
              </div>
            </div>

            {/* 태블릿/PC 날짜 */}
            <p className="max-xs:absolute max-xs:ml-0 max-xs:top-[calc(100%-24px)] max-xs:left-[120px] text-[14px] text-gray-400 ml-auto">
              {message.createdAt}
            </p>
          </div>
        </div>

        {/* 내용 영역 */}
        <div>
          <div className="h-[256px] overflow-y-auto overflow-x-hidden mx-6 mt-4">
            <p
              className="
                text-[14px] sm:text-[15px] lg:text-[16px]
                leading-[22px] sm:leading-[26px] lg:leading-[28px]
                font-normal tracking-[-0.01em] text-[#5A5A5A]
                w-full max-w-[500px]
              "
            >
              <span dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="mb-[40px] mt-[24px] text-center">
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

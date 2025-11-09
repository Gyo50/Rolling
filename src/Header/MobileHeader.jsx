import React, { useState } from "react";
import sharingIcon from "../img/share-24.svg";
import { ReactComponent as PlusIcon } from "../img/add-24.svg";
import { ReactComponent as ArrowIcon } from "../img/arrow_down.svg";

function MobileHeader() {
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const toggleEmojiMenu = () => {
    setShowEmojiMenu((prev) => !prev);
  };

  const toggleShareMenu = () => {
    setShowShareMenu((prev) => !prev);
  };

  // 공유 버튼의 클래스를 조건부로 정의
  const shareButtonClasses =
      `
      flex items-center justify-center 
      border border-gray-300 w-[36px] h-[32px] rounded-md 
      ${showShareMenu ? "border-gray-500" : "bg-white hover:bg-gray-100"}
      `;
  return (
    <>
      {/* 수신자 헤더 */}
      <div className="flex items-center justify-between w-[360px] h-[52px] bg-white relative px-[20px] py-[12px]">
        <div className="text-gray-800 text-18-bold">To. Ashley Kim</div>
      </div>

      <div className="flex items-center justify-between w-[360px] h-[52px] bg-white relative px-[20px] py-[12px]">
        {/* 이모지 + 화살표 */}
        <div className="relative">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-2">
              <button className="flex items-center justify-center gap-1 bg-black bg-opacity-[54%] text-white rounded-full px-[8px] py-[4px] text-14-regular">
                👍&nbsp;24
              </button>
              <button className="flex items-center justify-center gap-1 bg-black bg-opacity-[54%] text-white rounded-full px-[8px] py-[4px] text-14-regular">
                😍&nbsp;16
              </button>
              <button className="flex items-center justify-center gap-1 bg-black bg-opacity-[54%] text-white rounded-full px-[8px] py-[4px] text-14-regular">
                🎉&nbsp;10
              </button>
            </div>

            {/* 화살표 버튼 */}
            <button onClick={toggleEmojiMenu} className="mx-2 transition">
              <ArrowIcon
                className={`w-[12px] h-[6.46px] transition-transform duration-200 ${
                  showEmojiMenu ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          </div>

          {/* 이모지메뉴 */}
          {showEmojiMenu && (
            <div className="absolute right-0 mt-1.5 w-[203px] h-[98px] bg-white rounded-xl shadow-lg p-[16px] grid grid-cols-3 gap-2 justify-items-center">
              {/* 1행 */}
              <button className="flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[8px] py-[4px] text-14-regular">
                👍&nbsp;10
              </button>
              <button className="flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[8px] py-[4px] text-14-regular">
                😍&nbsp;8
              </button>
              <button className="flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[8px] py-[4px] text-14-regular">
                🎉&nbsp;24
              </button>

              {/* 2행 */}
              <button className="flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[8px] py-[4px] text-14-regular">
                👍&nbsp;10
              </button>
              <button className="flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[8px] py-[4px] text-14-regular">
                😍&nbsp;8
              </button>
              <button className="flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[8px] py-[4px] text-14-regular">
                😍&nbsp;24
              </button>
            </div>
          )}
        </div>

        {/* 추가 버튼 */}
        <button className="flex items-center justify-center gap-1 border border-gray-300 text-gray-900 rounded-md bg-white w-[36px] h-[32px]">
          <PlusIcon className="w-[17.91px] h-[16.79px]" />
        </button>

        {/* 구분선 | */}
        <span className="w-[1px] h-[28px] bg-gray-200 mx-2"></span>

        {/* 공유 버튼 + 드롭다운 메뉴 */}
        <div className="relative">
          <button
            onClick={toggleShareMenu}
            // 조건부 클래스 변수 사용
            className={shareButtonClasses}
            aria-expanded={showShareMenu}
          >
            <img
              src={sharingIcon}
              alt="공유"
              className="w-[16px] h-[17.88px]"
            />
          </button>

          {/* 공유 메뉴 */}
          {showShareMenu && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md py-[10px] w-[140px] h-[120px] z-10 text-gray-900 border border-gray-300 text-16-regular">
              <button className="text-left px-4 py-2 hover:bg-gray-100 w-[138px] h-[50px]">
                카카오톡 공유
              </button>
              <button className="text-left px-4 py-2 hover:bg-gray-100 w-[138px] h-[50px]">
                URL 복사
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MobileHeader;

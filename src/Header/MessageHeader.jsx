import React, { useState } from "react";
import sharingIcon from "../img/share-24.svg";
import { ReactComponent as PlusIcon } from "../img/add-24.svg";
import { ReactComponent as ArrowIcon } from "../img/arrow_down.svg";

function MessageHeader() {
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const toggleEmojiMenu = () => {
    setShowEmojiMenu((prev) => !prev);
  };

  const toggleShareMenu = () => {
    setShowShareMenu((prev) => !prev);
  };

  // 공유 버튼의 클래스를 조건부로 정의
  const shareButtonClasses = `
    flex items-center justify-center 
    border border-gray-300 w-[56px] h-[36px] rounded-md 
    
    // 드롭다운이 열려있을 때 적용
    ${showShareMenu ? "border-gray-500" : "bg-white hover:bg-gray-100"} 
  `;

  return (
    <>
      <div className="flex items-center justify-between w-[1200px] h-[68px] bg-white relative mx-auto">
        {/* 왼쪽: 수신자 */}
        <div className="text-gray-800 text-28-bold">To. Ashley Kim</div>

        {/* 오른쪽: 작성자 / 이모지 / 버튼 */}
        <div className="flex items-center gap-3 relative">
          {/* 작성자 프로필 영역 */}
          <div className="flex items-center gap-2">
            {/* 아바타 묶음 */}
            <div className="flex items-center -space-x-[12px]">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3sNaglv_WIugAApob8DnWx3ePYnc33k_vCwJ-0b6NcJF2JdWPR4Ta2-Jr5BbZxrt0-5BBbZJfhMraFULt8VemDX9DiSnTi4LC665QBIhHCg&s=10"
                alt="avatar1"
                className="w-[28px] h-[28px] rounded-full border-2 border-white"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3sNaglv_WIugAApob8DnWx3ePYnc33k_vCwJ-0b6NcJF2JdWPR4Ta2-Jr5BbZxrt0-5BBbZJfhMraFULt8VemDX9DiSnTi4LC665QBIhHCg&s=10"
                alt="avatar2"
                className="w-[28px] h-[28px] rounded-full border-2 border-white"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3sNaglv_WIugAApob8DnWx3ePYnc33k_vCwJ-0b6NcJF2JdWPR4Ta2-Jr5BbZxrt0-5BBbZJfhMraFULt8VemDX9DiSnTi4LC665QBIhHCg&s=10"
                alt="avatar3"
                className="w-[28px] h-[28px] rounded-full border-2 border-white"
              />
              <div className="w-[28px] h-[28px] bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-700 border-2 border-white">
                +6
              </div>
            </div>

            {/* "명 작성했어요" */}
            <span className="text-gray-900">
              <span className="ml-2 text-18-regular">
                <span className="text-18-bold">23명</span>이 작성했어요!
              </span>
            </span>

            {/* 구분선 | */}
            <span className="w-[1px] h-[28px] bg-gray-200 mx-4"></span>
          </div>

          {/* 이모지 + 화살표 */}
          <div className="relative">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-2">
                <button className="flex items-center justify-center gap-1 bg-black bg-opacity-[54%] text-white rounded-full px-[12px] py-[6px]">
                  👍&nbsp;24
                </button>
                <button className="flex items-center justify-center gap-1 bg-black bg-opacity-[54%] text-white rounded-full px-[12px] py-[6px]">
                  😍&nbsp;16
                </button>
                <button className="flex items-center justify-center gap-1 bg-black bg-opacity-[54%] text-white rounded-full px-[12px] py-[6px]">
                  🎉&nbsp;10
                </button>
              </div>

              {/* 화살표 버튼 */}
              <button onClick={toggleEmojiMenu} className="mx-2 transition">
                <ArrowIcon
                  className={`transition-transform duration-200 ${
                    showEmojiMenu ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </div>

            {/* 이모지메뉴 */}
            {showEmojiMenu && (
              <div className="absolute right-5 mt- w-80 bg-white rounded-xl shadow-lg p-[24px] grid grid-cols-4 gap-2 justify-items-center">
                {/* 1행 */}
                <button className="flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[12px] py-[6px] text-16-regular">
                  👍&nbsp;10
                </button>
                <button className="flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[12px] py-[6px] text-16-regular">
                  😍&nbsp;8
                </button>
                <button className="flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[12px] py-[6px] text-16-regular">
                  🎉&nbsp;24
                </button>
                <button className="flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[12px] py-[6px] text-16-regular">
                  😂&nbsp;2
                </button>

                {/* 2행 */}
                <button className="flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[12px] py-[6px] text-16-regular">
                  👍&nbsp;10
                </button>
                <button className="flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[12px] py-[6px] text-16-regular">
                  😍&nbsp;8
                </button>
                <button className="flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[12px] py-[6px] text-16-regular">
                  😍&nbsp;24
                </button>
                <button className="flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[12px] py-[6px] text-16-regular">
                  😍&nbsp;2
                </button>
              </div>
            )}
          </div>

          {/* 추가 버튼 */}
          <button className="flex items-center justify-center gap-1 border border-gray-300 text-gray-900 rounded-md bg-white w-[88px] h-[36px]">
            <PlusIcon className="" />
            추가
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
      </div>
    </>
  );
}

export default MessageHeader;

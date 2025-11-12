import React, { useState } from "react";
import sharingIcon from "../../img/share-24.svg";
import { ReactComponent as PlusIcon } from "../../img/add-24.svg";
import { ReactComponent as ArrowIcon } from "../../img/arrow_down.svg";
import EmojiPicker from "emoji-picker-react";

// ✅ 변경: props 추가로 받아옴 (서버와 연동을 위해 상위에서 상태 관리)
// 기존: function MessageHeader()
// 변경: function MessageHeader({ propEmojiSelect, reactions, setReactions })
function MessageHeader({ propEmojiSelect, reactions, setReactions }) {
  // ✅ 변경사항: 페이지에서 통합 관리하도록 useState 제거 (부모에서 전달받음)
  // const [reactions, setReactions] = useState([]);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [animatedId, setAnimatedId] = useState(null); // 애니메이션 추적용

  const sortedReactions = [...reactions].sort((a, b) => b.count - a.count);

  // 이모지 추가 또는 카운트 증가 처리
  // ✅ 내부 로직 수정됨: 부모에게도 전달하도록 추가
  const handleEmojiSelect = (emojiData, event) => {
    const selectedEmoji =
      typeof emojiData === "string" ? emojiData : emojiData?.emoji || emojiData?.native;

    if (!selectedEmoji) return;

    let updated;
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === selectedEmoji); // 같은 이모지가 있는지 확인
      if (existing) {
        updated = prev.map(
          (r) => (r.emoji === selectedEmoji ? { ...r, count: r.count + 1 } : r) // 같은 이모지가 있을때 count + 1
        );
      } else {
        updated = [...prev, { emoji: selectedEmoji, count: 1, id: Date.now() }]; // 같은 이모지가 없을 때, 새로운 이모지 추가
      }

      return updated;
    });

    // ✅ 추가됨: 서버로 전달할 객체 구성
    const propReactions = {
      emoji: selectedEmoji,
      type: "increase",
    };

    // ✅ 추가됨: 부모로 데이터 전달
    propEmojiSelect(propReactions);

    // 애니메이션 트리거 (1초간 강조)
    const target = reactions.find((r) => r.emoji === selectedEmoji);
    setAnimatedId(target ? target.id : Date.now());
    setTimeout(() => setAnimatedId(null), 250);

    setShowEmojiPicker(false);
  };

  const toggleEmojiMenu = () => {
    if (sortedReactions.length < 3) return;
    setShowEmojiMenu((prev) => !prev);
    if (showEmojiPicker) setShowEmojiPicker(false);
  };

  const toggleShareMenu = () => {
    setShowShareMenu((prev) => !prev);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
    if (showEmojiMenu) setShowEmojiMenu(false);
  };

  const shareButtonClasses = `
        flex items-center justify-center 
        border border-gray-300 w-[56px] h-[36px] rounded-md 
        ${showShareMenu ? "border-gray-500" : "bg-white hover:bg-gray-100"} 
    `;

  const plusButtonClasses = `
        flex items-center justify-center gap-1 border border-gray-300 text-gray-900 rounded-md 
        w-[88px] h-[36px] transition
        ${showEmojiPicker ? "bg-gray-100 border-gray-500" : "bg-white hover:bg-gray-50"}
    `;

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between w-[1200px] h-[68px] bg-white relative mx-auto">
        {/* 왼쪽: 수신자 */}
        <div className="text-gray-800 text-28-bold">To. Ashley Kim</div>

        {/* 오른쪽 */}
        <div className="flex items-center gap-3 relative">
          {/* 작성자 수, 아바타 등 */}
          <div className="flex items-center gap-2">
            <div className="flex items-center -space-x-[12px]">
              {[...Array(3)].map((_, i) => (
                <img
                  key={i}
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3sNaglv_WIugAApob8DnWx3ePYnc33k_vCwJ-0b6NcJF2JdWPR4Ta2-Jr5BbZxrt0-5BBbZJfhMraFULt8VemDX9DiSnTi4LC665QBIhHCg&s=10"
                  alt="avatar"
                  className="w-[28px] h-[28px] rounded-full border-2 border-white"
                />
              ))}
              <div className="w-[28px] h-[28px] bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-700 border-2 border-white">
                +6
              </div>
            </div>
            <span className="ml-2 text-18-regular">
              <span className="text-18-bold">23명</span>이 작성했어요!
            </span>
            <span className="w-[1px] h-[28px] bg-gray-200 mx-4"></span>
          </div>

          {/* 이모지 표시 + 화살표 */}
          {sortedReactions.length > 0 && (
            <div className="relative">
              <div className="flex items-center gap-1">
                {/* 이모지 들어가야 됨. */}
                <div className="flex items-center gap-2">
                  {sortedReactions.slice(0, 3).map((reaction) => (
                    <button
                      key={reaction.id}
                      onClick={() => handleEmojiSelect(reaction.emoji)}
                      className={`flex items-center justify-center gap-1 bg-black bg-opacity-[54%] text-white rounded-full px-[12px] py-[6px] transition-transform duration-150 ${
                        animatedId === reaction.id ? "emoji-animate" : ""
                      }`}
                    >
                      {reaction.emoji}&nbsp;{reaction.count}
                    </button>
                  ))}
                </div>

                {sortedReactions.length >= 3 && (
                  <button onClick={toggleEmojiMenu} className="mx-2 transition">
                    <ArrowIcon
                      className={`transition-transform duration-200 ${
                        showEmojiMenu ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                )}
              </div>

              {showEmojiMenu && sortedReactions.length >= 3 && (
                <div className="absolute right-5 mt-2 w-80 bg-white rounded-xl shadow-lg p-[24px] grid grid-cols-4 gap-2 justify-items-center z-10">
                  {reactions.map((reaction) => (
                    <button
                      key={reaction.id}
                      onClick={() => handleEmojiSelect(reaction.emoji)}
                      className={`flex flex-row items-center justify-center bg-black bg-opacity-[54%] text-white rounded-full px-[12px] py-[6px] text-16-regular w-full transition-transform duration-150 ${
                        animatedId === reaction.id ? "emoji-animate" : ""
                      }`}
                    >
                      {reaction.emoji}&nbsp;{reaction.count}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 이모지 추가 버튼 */}
          <div className="relative z-20">
            <button onClick={toggleEmojiPicker} className={plusButtonClasses}>
              <PlusIcon />
              추가
            </button>

            {showEmojiPicker && (
              <div className="absolute top-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 z-30">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}
          </div>

          <span className="w-[1px] h-[28px] bg-gray-200 mx-2"></span>

          {/* 공유 버튼 */}
          <div className="relative">
            <button
              onClick={toggleShareMenu}
              className={shareButtonClasses}
              aria-expanded={showShareMenu}
            >
              <img src={sharingIcon} alt="공유" />
            </button>

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

      {/* 애니메이션 스타일 */}
      <style>{`
        .emoji-animate {
          transform: scale(1.3) !important;
          transition: transform 0.15s ease-in-out !important;
        }
      `}</style>
    </div>
  );
}

export default MessageHeader;

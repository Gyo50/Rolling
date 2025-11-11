import React, { useState, useEffect } from "react";
import sharingIcon from "../img/share-24.svg";
import { ReactComponent as PlusIcon } from "../img/add-24.svg";
import { ReactComponent as ArrowIcon } from "../img/arrow_down.svg";
import EmojiPicker from "emoji-picker-react";

function MessageHeader() {
  const [reactions, setReactions] = useState([]);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [animatedId, setAnimatedId] = useState(null);
  const [popup, setPopup] = useState({ visible: false, message: "" });

  // 🔹 사용자 식별용 ID
  const [userId] = useState(() => {
    const saved = localStorage.getItem("userId");
    if (saved) return saved;
    const newId = `user-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("userId", newId);
    return newId;
  });

  // 🔹 localStorage 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("reactions");
    if (saved) setReactions(JSON.parse(saved));
  }, []);

  // 🔹 localStorage 저장
  useEffect(() => {
    localStorage.setItem("reactions", JSON.stringify(reactions));
  }, [reactions]);

  // 🔹 팝업 표시
  const showPopup = (msg) => {
    setPopup({ visible: true, message: msg });
    setTimeout(() => setPopup({ visible: false, message: "" }), 2000);
  };

  const sortedReactions = [...reactions].sort((a, b) => b.count - a.count);

  // 🔹 이모지 클릭/추가
  const handleEmojiSelect = (emojiData) => {
    const selectedEmoji =
      typeof emojiData === "string"
        ? emojiData
        : emojiData?.emoji || emojiData?.native;

    if (!selectedEmoji) return;

    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === selectedEmoji);
      if (existing) {
        const userClickedCount =
          existing.users[userId] !== undefined ? existing.users[userId] : 0;

        if (userClickedCount >= 5) {
          showPopup("이 이모지는 최대 5번까지만 누를 수 있어요 😅");
          return prev;
        }

        return prev.map((r) =>
          r.emoji === selectedEmoji
            ? {
                ...r,
                count: r.count + 1,
                users: { ...r.users, [userId]: userClickedCount + 1 },
              }
            : r
        );
      } else {
        // 새 이모지 추가
        return [
          ...prev,
          {
            emoji: selectedEmoji,
            count: 1,
            users: { [userId]: 1 },
            id: Date.now(),
          },
        ];
      }
    });

    const target = reactions.find((r) => r.emoji === selectedEmoji);
    setAnimatedId(target ? target.id : Date.now());
    setTimeout(() => setAnimatedId(null), 250);
    setShowEmojiPicker(false);
  };

  const toggleEmojiMenu = () => {
    setShowEmojiMenu((prev) => !prev);
    if (showEmojiPicker) setShowEmojiPicker(false);
  };

  const toggleShareMenu = () => setShowShareMenu((prev) => !prev);
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
    ${
      showEmojiPicker
        ? "bg-gray-100 border-gray-500"
        : "bg-white hover:bg-gray-50"
    }
  `;

  return (
    <div className="border-b border-gray-200 relative">
      {/* 팝업 */}
      {popup.visible && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-sm px-5 py-3 rounded-lg shadow-lg z-50 animate-fadeIn">
          {popup.message}
        </div>
      )}

      <div className="flex items-center justify-between w-[1200px] h-[68px] bg-white relative mx-auto">
        <div className="text-gray-800 text-28-bold">To. Ashley Kim</div>

        <div className="flex items-center gap-3 relative">
          {/* 작성자 */}
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

          {/* 이모지 표시 */}
          {sortedReactions.length > 0 && (
            <div className="relative">
              <div className="flex items-center gap-1">
                {/* Top3 */}
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

                {/* 화살표 토글 */}
                {sortedReactions.length > 3 && (
                  <button
                    onClick={toggleEmojiMenu}
                    className="mx-2 transition-transform duration-200"
                  >
                    <ArrowIcon
                      className={`transition-transform duration-200 ${
                        showEmojiMenu ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* 1~7번째 이모지 + 7개 이후 +N */}
              {showEmojiMenu && sortedReactions.length > 3 && (
                <div className="absolute right-5 mt-2 w-80 bg-white rounded-xl shadow-lg p-[24px] grid grid-cols-4 gap-2 justify-items-center z-10">
                  {sortedReactions.slice(0, 7).map((reaction) => (
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

                  {sortedReactions.length > 7 && (
                    <div className="flex items-center justify-center bg-black bg-opacity-[54%] rounded-full px-[12px] py-[6px] text-white w-full">
                      +{sortedReactions.length - 7}
                    </div>
                  )}
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

      <style>{`
        .emoji-animate {
          transform: scale(1.3) !important;
          transition: transform 0.15s ease-in-out !important;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default MessageHeader;

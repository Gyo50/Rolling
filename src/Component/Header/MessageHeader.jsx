import React, { useState, useEffect, useCallback } from "react";
import sharingIcon from "../../img/share-24.svg";
import { ReactComponent as PlusIcon } from "../../img/add-24.svg";
import { ReactComponent as ArrowIcon } from "../../img/arrow_down.svg";
import EmojiPicker from "emoji-picker-react";
import Toast from "../Toast/Toast.jsx";

function MessageHeader({ hideAvatars = false }) {
  // ==========================
  // 상태
  // ==========================
  const [reactions, setReactions] = useState([]);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [animatedId, setAnimatedId] = useState(null);
  const [popup, setPopup] = useState({ visible: false, message: "" });
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const AUTO_RESET_ON_LOAD = false;

  const [userId] = useState(() => {
    const saved = localStorage.getItem("userId");
    if (saved) return saved;
    const newId = `user-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("userId", newId);
    return newId;
  });

  // ==========================
  // 로컬스토리지 로드/저장
  // ==========================
  const resetReactions = useCallback(() => {
    localStorage.removeItem("reactions");
    setReactions([]);
    console.log("reactions가 초기화되었습니다!");
  }, []);

  useEffect(() => {
    if (AUTO_RESET_ON_LOAD) {
      resetReactions();
    } else {
      const saved = localStorage.getItem("reactions");
      if (saved) {
        try {
          setReactions(JSON.parse(saved));
        } catch {
          setReactions([]);
        }
      }
    }
    window.resetReactions = resetReactions;
  }, [AUTO_RESET_ON_LOAD, resetReactions]);

  useEffect(() => {
    localStorage.setItem("reactions", JSON.stringify(reactions));
  }, [reactions]);

  // ==========================
  // 팝업 / 토스트
  // ==========================
  const showPopup = (msg) => {
    setPopup({ visible: true, message: msg });
    setTimeout(() => setPopup({ visible: false, message: "" }), 2000);
  };

  const showToast = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setToastOpen(true);
  };

  // ==========================
  // 이모지 처리
  // ==========================
  const sortedReactions = Array.isArray(reactions)
    ? [...reactions].sort((a, b) => b.count - a.count)
    : [];

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

  // ==========================
  // 토글
  // ==========================
  const toggleEmojiMenu = () => {
    setShowEmojiMenu((p) => !p);
    setShowShareMenu(false);
    setShowEmojiPicker(false);
  };
  const toggleShareMenu = () => {
    setShowShareMenu((p) => !p);
    setShowEmojiMenu(false);
    setShowEmojiPicker(false);
  };
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((p) => !p);
    setShowEmojiMenu(false);
    setShowShareMenu(false);
  };

  // ==========================
  // 공유
  // ==========================
  const handleKakaoShare = () => {
    showToast("카카오톡 URL이 복사되었습니다!", "success");
    setShowShareMenu(false);
  };
  const handleCopyURL = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("URL이 복사되었습니다!", "success");
    } catch {
      showToast("복사에 실패했어요 😢", "error");
    }
    setShowShareMenu(false);
  };

  // ==========================
  // 스타일
  // ==========================
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

  // ==========================
  // 렌더링
  // ==========================
  return (
    <div className="border-b border-gray-200 relative mx-auto w-full">
      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        type={toastType}
        duration={2000}
      />

      {popup.visible && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-sm px-5 py-3 rounded-lg shadow-lg z-50 animate-fadeIn">
          {popup.message}
        </div>
      )}

      {/* 반응형 + 토글 */}
      <div
        className="
          flex justify-between items-center flex-wrap w-full py-3 mx-auto bg-white transition-all duration-300 overflow-visible max-w-[1200px] px-[24px]">
        {/* 왼쪽 텍스트 */}
        <div className="text-gray-800 text-28-bold flex-shrink-0 min-w-[160px]">
          To. Ashley Kim
        </div>

        {/* 오른쪽 영역 */}
        <div
          className="flex flex-wrap justify-end items-center gap-2 md:gap-3  min-w-[200px] flex-shrink overflow-visible">
          {/* 작성자 아바타 */}
          {!hideAvatars && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center -space-x-[10px] md:-space-x-[12px]">
                {[...Array(3)].map((_, i) => (
                  <img
                    key={i}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3sNaglv_WIugAApob8DnWx3ePYnc33k_vCwJ-0b6NcJF2JdWPR4Ta2-Jr5BbZxrt0-5BBbZJfhMraFULt8VemDX9DiSnTi4LC665QBIhHCg&s=10"
                    alt="avatar"
                    className="w-[26px] h-[26px] md:w-[28px] md:h-[28px] rounded-full border-2 border-white"
                  />
                ))}
                <div className="w-[26px] h-[26px] md:w-[28px] md:h-[28px] bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-700 border-2 border-white">
                  +6
                </div>
              </div>
              <span className="ml-2 text-[14px] md:text-[18px] whitespace-nowrap">
                <span className="font-semibold">23명</span>이 작성했어요!
              </span>
              <span className="hidden md:block w-[1px] h-[28px] bg-gray-200 mx-4"></span>
            </div>
          )}

          {/* 이모지 반응 */}
          {sortedReactions.length > 0 && (
            <div className="relative flex flex-wrap gap-1 justify-end items-center overflow-visible">
              <div className="flex items-center gap-1">
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

                {/* 이모지 토글 버튼 */}
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

              {/* 토글 메뉴 */}
              {showEmojiMenu && sortedReactions.length > 3 && (
                <div className="absolute right-5 mt-[190px] w-80 bg-white rounded-xl shadow-lg p-[24px] grid grid-cols-4 gap-2 justify-items-center z-50 border border-gray-300">
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

          {/* 이모지 추가 */}
          <div className="relative z-20">
            <button onClick={toggleEmojiPicker} className={plusButtonClasses}>
              <PlusIcon />
              추가
            </button>
            {showEmojiPicker && (
              <div className="absolute top-[calc(100%+8px)] left-1/2 transform -translate-x-1/2 z-50">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}
          </div>

          {/* 구분선 */}
          <span className="hidden md:block w-[1px] h-[28px] bg-gray-200 mx-2"></span>

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
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md py-[10px] w-[140px] z-50 text-gray-900 border border-gray-300 text-16-regular">
                <button
                  onClick={handleKakaoShare}
                  className="text-left px-4 py-2 hover:bg-gray-100 w-full"
                >
                  카카오톡 공유
                </button>
                <button
                  onClick={handleCopyURL}
                  className="text-left px-4 py-2 hover:bg-gray-100 w-full"
                >
                  URL 복사
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 애니메이션 */}
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

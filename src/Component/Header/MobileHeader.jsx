import React, { useState, useEffect, useCallback } from "react";
import sharingIcon from "../../img/share-24.svg";
import { ReactComponent as PlusIcon } from "../../img/add-24.svg";
import { ReactComponent as ArrowIcon } from "../../img/arrow_down.svg";
import Toast from "../Toast/Toast.jsx";
import EmojiPicker from "emoji-picker-react";

// props로 reactions(배열)와 onAddReaction(함수)을 받도록 수정
function MobileHeader({ reactions = [], onAddReaction }) {
  // 상태 관리
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [animatedId, setAnimatedId] = useState(null);
  const [popup, setPopup] = useState({ visible: false, message: "" });

  // Toast 상태
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // 사용자 식별 ID (5회 제한 로직 유지를 위해 남겨둠)
  const [userId] = useState(() => {
    const saved = localStorage.getItem("userId");
    if (saved) return saved;
    const newId = `user-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("userId", newId);
    return newId;
  });

  // 리셋 관련 상수 (유지)
  const AUTO_RESET_ON_LOAD = false;

  // 로컬 스토리지 초기화 함수 (정의 유지)
  const resetReactions = useCallback(() => {
    localStorage.removeItem("reactions");
    console.log("🧹 reactions가 초기화되었습니다! (로컬 스토리지만)");
  }, []);

  // 초기 로딩 시 로직 (API 연동은 OwnerPage에서 담당)
  useEffect(() => {
    if (AUTO_RESET_ON_LOAD) {
      resetReactions();
    }
    window.resetReactions = resetReactions;
  }, [AUTO_RESET_ON_LOAD, resetReactions]);


  // 팝업 (이모지 5회 제한 알림)
  const showPopup = (msg) => {
    setPopup({ visible: true, message: msg });
    setTimeout(() => setPopup({ visible: false, message: "" }), 2000);
  };

  // Toast 표시
  const showToast = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setToastOpen(true);
  };

  // props로 받은 reactions 사용 및 정렬
  const sortedReactions = [...reactions].sort((a, b) => b.count - a.count);

  // 이모지 클릭 / 추가 (props.onAddReaction 사용하도록 수정)
  const handleEmojiSelect = (emojiData) => {
    const selectedEmoji =
      typeof emojiData === "string"
        ? emojiData
        : emojiData?.emoji || emojiData?.native;

    if (!selectedEmoji) return;

    // 5회 제한 체크 로직 (유지)
    const existing = reactions.find((r) => r.emoji === selectedEmoji);
    if (existing) {
      const userClickedCount =
        existing.users?.[userId] !== undefined ? existing.users[userId] : 0;

      if (userClickedCount >= 5) {
        showPopup("이 이모지는 최대 5번까지만 누를 수 있어요 😅");
        setShowEmojiPicker(false);
        return;
      }
    }

    // 상위 컴포넌트로 반응 추가 요청 전달
    if (onAddReaction) {
      onAddReaction(selectedEmoji);
    }

    // 애니메이션 처리
    setAnimatedId(Date.now()); // 클릭 시 애니메이션 실행
    setTimeout(() => setAnimatedId(null), 250);
    setShowEmojiPicker(false);
  };

  // 토글 함수들
  const toggleEmojiMenu = () => {
    setShowEmojiMenu((prev) => {
      const newState = !prev;
      if (newState) {
        setShowEmojiPicker(false);
        setShowShareMenu(false);
      }
      return newState;
    });
  };

  const toggleShareMenu = () => {
    setShowShareMenu((prev) => {
      const newState = !prev;
      if (newState) {
        setShowEmojiMenu(false);
        setShowEmojiPicker(false);
      }
      return newState;
    });
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => {
      const newState = !prev;
      if (newState) {
        setShowEmojiMenu(false);
        setShowShareMenu(false);
      }
      return newState;
    });
  };

  // 공유 기능
  const handleCopyURL = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("URL이 복사되었습니다!", "success");
    setShowShareMenu(false);
  };

  const handleShareKakao = () => {
    showToast("카카오톡 URL이 복사되었습니다!", "success");
    setShowShareMenu(false);
  };

  // 공통 버튼 스타일 (JSX/CSS는 변경 없음)
  const buttonClasses = `flex items-center justify-center rounded-full pl-[10px] pr-[8px] py-[4px] bg-[rgba(0,0,0,0.54)] text-white text-14-regular gap-2`;

  // 렌더링
  return (
    <>
      {/* Toast */}
      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        type={toastType}
        duration={2000}
      />

      {/* 수신자 헤더 */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between min-w-[360px] h-[52px] bg-white relative px-[24px] py-[12px] mx-auto">
          <div className="text-gray-800 text-18-bold text-left">
            To. Ashley Kim
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="relative h-[52px] bg-white flex justify-end items-center px-[24px] mx-auto">
          {/* 팝업 (이모지 제한 안내) */}
          {popup.visible && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-sm px-5 py-3 rounded-lg shadow-lg z-50 animate-fadeIn">
              {popup.message}
            </div>
          )}

          {/* Top3 이모지 */}
          {sortedReactions.slice(0, 3).map((reaction, index) => (
            <button
              key={reaction.id}
              onClick={() => handleEmojiSelect(reaction.emoji)}
              className={`${buttonClasses} ${animatedId === reaction.id ? "emoji-animate" : ""
                } mx-1`}
            >
              <span style={{ fontSize: "14px", lineHeight: "20px" }}>
                {reaction.emoji}
              </span>
              <span>{reaction.count}</span>
            </button>
          ))}

          {/* 토글 화살표 */}
          {sortedReactions.length > 3 && (
            <>
              <button onClick={toggleEmojiMenu} className="mx-[14px] w-[12px]">
                <ArrowIcon
                  className={`transition-transform duration-100 ${showEmojiMenu ? "rotate-180" : "rotate-0"
                    }`}
                />
              </button>

              {showEmojiMenu && (
                <div className="absolute top-[calc(100%+4px)] right-[70px] bg-white rounded-lg shadow-lg p-2 grid grid-cols-3 gap-[8px] justify-items-center z-30 w-[203px] h-[98px] border-gray-200">
                  {sortedReactions.slice(0, 5).map((reaction) => (
                    <button
                      key={reaction.id}
                      onClick={() => handleEmojiSelect(reaction.emoji)}
                      className={`${buttonClasses} ${animatedId === reaction.id ? "emoji-animate" : ""
                        } w-full`}
                    >
                      <span style={{ fontSize: "14px", lineHeight: "20px" }}>
                        {reaction.emoji}
                      </span>
                      <span>{reaction.count}</span>
                    </button>
                  ))}

                  {sortedReactions.length > 5 && (
                    <div className="flex items-center justify-center rounded-full bg-black bg-opacity-[54%] text-white w-full">
                      +{sortedReactions.length - 5}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* 이모지 추가 버튼 */}
          <div className="relative mx-1">
            <button
              onClick={toggleEmojiPicker}
              className="flex items-center justify-center w-[36px] h-[32px] rounded-md border border-gray-300 hover:bg-gray-100"
            >
              <PlusIcon className="w-4 h-4" />
            </button>

            {showEmojiPicker && (
              <div className="absolute top-[calc(100%+4px)] right-0 z-30">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}
          </div>

          {/* 구분선 */}
          <div className="w-[1px] h-6 bg-gray-200 mx-[15px]"></div>

          {/* 공유 버튼 */}
          <div className="relative">
            <button
              onClick={toggleShareMenu}
              className="flex items-center justify-center w-[36px] h-[32px] rounded-md border border-gray-300 hover:bg-gray-100"
            >
              <img src={sharingIcon} alt="공유" className="w-4 h-4" />
            </button>

            {showShareMenu && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md py-[6px] w-[140px] z-10 text-gray-900 border border-gray-300 text-16-regular">
                <button
                  onClick={handleShareKakao}
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

          <style>{`.emoji-animate {transform: scale(1.3) !important; transition: transform 0.15s ease-in-out !important;}@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0);}}.animate-fadeIn {animation: fadeIn 0.3s ease-out;} `}</style>
        </div>
      </div>
    </>
  );
}

export default MobileHeader;
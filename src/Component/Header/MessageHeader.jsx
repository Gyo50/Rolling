import React, { useEffect, useState, useCallback, useMemo } from "react";
import sharingIcon from "../../img/share-24.svg";
import { ReactComponent as PlusIcon } from "../../img/add-24.svg";
import { ReactComponent as ArrowIcon } from "../../img/arrow_down.svg";
import EmojiPicker from "emoji-picker-react";
import Toast from "../Toast/Toast.jsx";
import { Link } from "react-router-dom";
import { EMOJI_TO_ALIAS } from "../../api/recipients";

const ALLOWED_EMOJIS = new Set(Object.keys(EMOJI_TO_ALIAS));

function MessageHeader({ recipient, messageCount = 0, topAvatars = [], onAddReaction, onShare }) {
  const [reactions, setReactions] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [animatedId, setAnimatedId] = useState(null);
  const [popup, setPopup] = useState({ visible: false, message: "" });
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

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
  useEffect(() => {
    const saved = localStorage.getItem("reactions");
    if (saved) {
      try {
        setReactions(JSON.parse(saved));
      } catch {
        setReactions([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("reactions", JSON.stringify(reactions));
  }, [reactions]);

  // ==========================
  // Toast / Popup
  // ==========================
  const showToast = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setToastOpen(true);
  };

  const showPopup = (msg) => {
    setPopup({ visible: true, message: msg });
    setTimeout(() => setPopup({ visible: false, message: "" }), 2000);
  };

  // ==========================
  // 이모지 처리
  // ==========================
  const sortedReactions = useMemo(() => {
    return [...reactions].sort((a, b) => b.count - a.count);
  }, [reactions]);

  const handleEmojiSelect = (emojiData) => {
    const selectedEmoji = typeof emojiData === "string" ? emojiData : emojiData?.emoji || emojiData?.native;
    if (!selectedEmoji) return;

    if (!ALLOWED_EMOJIS.has(selectedEmoji)) {
      showToast("지원하지 않는 이모지입니다.", "error");
      setShowEmojiPicker(false);
      return;
    }

    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === selectedEmoji);
      if (existing) {
        const userClickedCount = existing.users[userId] ?? 0;

        if (userClickedCount >= 5) {
          showToast("이 이모지는 최대 5번까지만 누를 수 있어요 😅", "error");
          return prev;
        }

        return prev.map((r) =>
          r.emoji === selectedEmoji
            ? { ...r, count: r.count + 1, users: { ...r.users, [userId]: userClickedCount + 1 } }
            : r
        );
      } else {
        return [...prev, { emoji: selectedEmoji, count: 1, users: { [userId]: 1 }, id: Date.now() }];
      }
    });

    setAnimatedId(Date.now());
    setTimeout(() => setAnimatedId(null), 250);
    setShowEmojiPicker(false);

    if (typeof onAddReaction === "function") {
      onAddReaction(selectedEmoji);
    }
  };

  // ==========================
  // 토글
  // ==========================
  const toggleEmojiPicker = () => setShowEmojiPicker((p) => !p);
  const toggleEmojiMenu = () => setShowEmojiMenu((p) => !p);
  const toggleShareMenu = () => {
    const next = !showShareMenu;
    setShowShareMenu(next);
    setShowEmojiMenu(false);
    setShowEmojiPicker(false);
    if (next && typeof onShare === "function") onShare();
  };

  // ==========================
  // 공유
  // ==========================
  const handleCopyURL = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("URL이 복사되었습니다!", "success");
    } catch {
      showToast("복사 실패 😢", "error");
    }
    setShowShareMenu(false);
  };

  // ==========================
  // 렌더링
  // ==========================
  return (
    <div className="border-b border-gray-200 relative w-full">
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

      <div className="flex justify-between items-center max-w-[1200px] mx-auto px-6 h-[68px]">
        <Link to="/list" className="text-gray-800 text-28-bold truncate hover:underline">
          {recipient?.name ? `To. ${recipient.name}` : "To. 이름 없는 대상"}
        </Link>

        <div className="flex items-center gap-4">
          {/* 이모지 버튼 */}
          {sortedReactions.slice(0, 3).map((reaction) => (
            <button
              key={reaction.id}
              onClick={() => handleEmojiSelect(reaction.emoji)}
              className={`flex items-center justify-center gap-1 bg-black bg-opacity-[54%] text-white rounded-full px-3 py-1 ${
                animatedId === reaction.id ? "emoji-animate" : ""
              }`}
            >
              {reaction.emoji} {reaction.count}
            </button>
          ))}

          <button onClick={toggleEmojiPicker} className="flex items-center gap-1 border rounded-md px-3 py-1 border-gray-300">
            <PlusIcon /> 추가
          </button>
          {showEmojiPicker && (
            <div className="absolute top-[68px] left-1/2 transform -translate-x-1/2 z-50">
              <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </div>
          )}

          <button onClick={toggleShareMenu} className="flex items-center border rounded-md px-3 py-1 border-gray-300">
            <img src={sharingIcon} alt="공유" />
          </button>
          {showShareMenu && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md py-2 w-[140px] z-50 text-gray-900 border border-gray-300 text-sm">
              <button onClick={handleCopyURL} className="text-left px-4 py-2 hover:bg-gray-100 w-full">
                URL 복사
              </button>
            </div>
          )}
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

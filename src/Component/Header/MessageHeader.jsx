import React, { useEffect, useMemo, useState } from "react";
import sharingIcon from "../../img/share-24.svg";
import { ReactComponent as PlusIcon } from "../../img/add-24.svg";
import { ReactComponent as ArrowIcon } from "../../img/arrow_down.svg";
import EmojiPicker from "emoji-picker-react";
import { Link } from "react-router-dom";
import { EMOJI_TO_ALIAS } from "../../api/recipients";

// Rolling API가 허용하는 이모지를 제한적으로 노출하기 위한 셋
const ALLOWED_EMOJIS = Object.keys(EMOJI_TO_ALIAS);
const ALLOWED_EMOJI_SET = new Set(ALLOWED_EMOJIS);

function MessageHeader({
  recipient,
  messageCount = 0,
  topAvatars = [],
  reactions: initialReactionsProp,
  onShare,
  onAddReaction
}) {
  const memoInitialReactions = useMemo(
    () => (Array.isArray(initialReactionsProp) ? initialReactionsProp : []),
    [initialReactionsProp]
  );

  const [reactions, setReactions] = useState(memoInitialReactions);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [animatedId, setAnimatedId] = useState(null); // 애니메이션 추적용

  useEffect(() => {
    setReactions(memoInitialReactions);
  }, [memoInitialReactions]);

  const sortedReactions = [...reactions].sort((a, b) => b.count - a.count);

  // 이모지 추가 또는 카운트 증가 처리
  const handleEmojiSelect = (emojiData, event) => {
    const selectedEmoji =
      typeof emojiData === "string"
        ? emojiData
        : emojiData?.emoji || emojiData?.native;

    if (!selectedEmoji) return;

    if (!ALLOWED_EMOJI_SET.has(selectedEmoji)) {
      alert('현재 지원하지 않는 이모지입니다. 준비된 이모지를 사용해 주세요.');
      setShowEmojiPicker(false);
      return;
    }

    let updated;
    setReactions((prev) => {
      const existing = prev.find((r) => r.emoji === selectedEmoji);
      if (existing) {
        updated = prev.map((r) =>
          r.emoji === selectedEmoji ? { ...r, count: r.count + 1 } : r
        );
      } else {
        updated = [...prev, { emoji: selectedEmoji, count: 1, id: Date.now() }];
      }
      return updated;
    });

    if (typeof onAddReaction === 'function') {
      // 부모(OwnerPage)에서 API 호출을 수행하도록 콜백 전달
      onAddReaction(selectedEmoji);
    }

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
    const next = !showShareMenu;
    setShowShareMenu(next);
    if (typeof onShare === 'function' && next) {
      onShare();
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
    if (showEmojiMenu) setShowEmojiMenu(false);
  };

  const shareButtonClasses = `
        flex items-center justify-center 
        border border-gray-300 w-[56px] h-[36px] rounded-[6px] bg-white transition
        ${showShareMenu ? "border-gray-500" : "hover:bg-gray-100"} 
    `;

  const plusButtonClasses = `
        flex items-center justify-center gap-1 border border-gray-300 text-gray-900 rounded-[6px]
        w-[88px] h-[36px] transition
        ${
          showEmojiPicker
            ? "bg-gray-100 border-gray-500"
            : "bg-white hover:bg-gray-50"
        }
    `;

  const displayName = recipient?.name ? `To. ${recipient.name}` : 'To. 이름 없는 대상';
  const totalWriters = messageCount ?? 0;
  const visibleAvatars = useMemo(() => topAvatars.slice(0, 3), [topAvatars]);
  const hiddenCount = Math.max(totalWriters - visibleAvatars.length, 0);

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-center w-full bg-white">
        <div className="flex items-center justify-between w-full max-w-[1200px] px-6 h-[68px]">
          {/* 왼쪽: 수신자 */}
          <Link
            to="/list"
            className="text-gray-800 text-28-bold truncate pr-6 hover:underline"
            title={displayName}
          >
            {displayName}
          </Link>

          {/* 오른쪽 */}
          <div className="flex items-center gap-[28px] relative">
            {/* 작성자 수, 아바타 등 */}
            <div className="flex items-center gap-[11px]">
              <div className="flex items-center">
                <div className="flex items-center -space-x-[12px]">
                  {visibleAvatars.map((avatar, i) => (
                    <img
                      key={`${avatar.src}-${i}`}
                      src={avatar.src}
                      alt={avatar.alt || `avatar-${i + 1}`}
                      className="w-[28px] h-[28px] rounded-full border-[1.5px] border-white object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/28x28';
                      }}
                    />
                  ))}
                </div>
                {hiddenCount > 0 && (
                  <div className="ml-2 w-[28px] h-[28px] bg-white border border-[#E3E3E3] rounded-full flex items-center justify-center text-xs text-[#484848]">
                    +{hiddenCount}
                  </div>
                )}
              </div>
              <span className="text-18-regular text-gray-900">
                <span className="text-18-bold">{totalWriters}</span>명이 작성했어요!
              </span>
              <span className="w-px h-[28px] bg-[#EEEEEE]"></span>
            </div>

            {/* 이모지 표시 + 화살표 */}
            <div className="flex items-center gap-2 min-w-[236px] justify-end">
              {sortedReactions.length > 0 && (
                <div className="relative flex items-center gap-2">
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
                    <button
                      onClick={toggleEmojiMenu}
                      className="flex items-center justify-center w-[36px] h-[36px] transition"
                    >
                      <ArrowIcon
                        className={`transition-transform duration-200 ${
                          showEmojiMenu ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                  )}

                  {showEmojiMenu && sortedReactions.length >= 3 && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg p-[24px] grid grid-cols-4 gap-2 justify-items-center z-10">
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
            </div>

            <span className="w-px h-[28px] bg-[#EEEEEE]"></span>

            {/* 이모지 추가 & 공유 버튼 */}
            <div className="flex items-center gap-[13px] min-w-[171px] justify-end">
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

              <span className="w-px h-[28px] bg-[#EEEEEE]"></span>

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
                    <button className="text-left px-4 py-2 hover:bg-gray-100 w-full h-[50px]">
                      카카오톡 공유
                    </button>
                    <button className="text-left px-4 py-2 hover:bg-gray-100 w-full h-[50px]">
                      URL 복사
                    </button>
                  </div>
                )}
              </div>
            </div>
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

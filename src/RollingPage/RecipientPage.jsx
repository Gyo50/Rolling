import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchRecipient,
  fetchRecipientMessages,
  fetchRecipientReactions,
  reactToRecipient,
  normalizeReactionsResponse,
  EMOJI_TO_ALIAS,
} from "../api/recipients";

// 컴포넌트 임포트
import Header from "../Component/Header/Header";
import MobileHeader from "../Component/Header/MobileHeader";
import MessageHeader from "../Component/Header/MessageHeader";
import Modal from "../Component/Modal/Modal";
import UserCard, { defaultMessage } from "../Component/Card/UserCard";
import AddCard from "../Component/Card/AddCard";
import HeaderNobutton from "../Component/Header/HeaderNobutton";

// 상수 정의
const STATIC_MESSAGES = [];
const DEFAULT_AVATAR = "https://placehold.co/28x28";
const DEFAULT_BACKGROUND_COLOR = "bg-beige-200";

function RecipientPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // URL의 recipientId
  const currentRecipientId = id;

  // ====== 상태 관리 ======
  const [recipient, setRecipient] = useState(null); // 페이지 정보
  const [messages, setMessages] = useState([]); // 메시지 리스트
  const [reactions, setReactions] = useState([]); // 반응 목록
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [backgroundValue, setBackgroundValue] = useState(""); // 배경 이미지/색상 값

  const [isOpen, setIsOpen] = useState(false); // 메시지 상세 모달 열림 여부
  const [selectedMessage, setSelectedMessage] = useState(null); // 선택된 메시지
  const [screenMode, setScreenMode] = useState("pc"); // 반응형 모드 (pc / tablet / mobile)

  // ====== 반응형 화면 체크 (OwnerPage 로직 차용) ======
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setScreenMode("mobile");
      else if (window.innerWidth < 1024) setScreenMode("tablet");
      else setScreenMode("pc");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ====== 데이터 로드 (OwnerPage 로직 참고) ======
  const loadData = useCallback(async () => {
    if (!currentRecipientId) return;

    try {
      setLoading(true);
      setError(null);

      // 3가지 데이터를 병렬로 로드
      const [recipientData, messageData, reactionData] = await Promise.all([
        fetchRecipient(currentRecipientId),
        fetchRecipientMessages(currentRecipientId, { limit: 8, offset: 0 }),
        fetchRecipientReactions(currentRecipientId),
      ]);

      setRecipient(recipientData || null);

      // 배경 설정
      if (recipientData) {
        const bg = recipientData.backgroundImageURL || recipientData.backgroundImage;
        if (bg) {
          setBackgroundValue(bg); // 이미지 URL 또는 base64/data URL
        } else if (recipientData.backgroundColor) {
          setBackgroundValue(recipientData.backgroundColor); // 색상 코드
        } else {
          setBackgroundValue(DEFAULT_BACKGROUND_COLOR);
        }
      }

      // 메시지 정리 및 정규화
      const rawMessages =
        messageData?.results || messageData?.messages || messageData?.data || messageData || [];

      const normalizedMessages = rawMessages.map((item) => ({
        id: item.id,
        sender: item.sender || "익명",
        content: item.content || "",
        profileImageURL: item.profileImageURL,
        relationship: item.relationship || "지인",
        createdAt: item.createdAt.split("T")[0] || "", // 모달에서 사용할 필드
      }));

      setMessages(normalizedMessages);

      // 반응 정리 및 정규화
      const normalizedReactions = normalizeReactionsResponse(reactionData);
      setReactions(normalizedReactions);
    } catch (err) {
      console.error("데이터 불러오기 실패:", err);
      setError(new Error(err?.message || "데이터를 불러올 수 없습니다."));
      setRecipient(null);
      setMessages(STATIC_MESSAGES); // 실패 시 빈 배열 대신 STATIC_MESSAGES 사용
      setReactions([]);
      setBackgroundValue(DEFAULT_BACKGROUND_COLOR);
    } finally {
      setLoading(false);
    }
  }, [currentRecipientId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 랜더링 데이터 선택: 메시지가 없거나 로딩 실패 시 더미 데이터 표시
  const messagesToRender =
    messages && messages.length > 0 ? messages : Array(6).fill(defaultMessage);

  // 작성자 프로필 아바타 (OwnerPage 로직 차용)
  const topAvatars = useMemo(() => {
    const unique = [];
    const seen = new Set();
    messages.forEach((msg) => {
      const key = msg.sender || msg.profileImageURL;
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push({
          src: msg.profileImageURL || DEFAULT_AVATAR,
          alt: msg.sender || "작성자",
        });
      }
    });
    return unique.slice(0, 3); // 최대 3개만 표시
  }, [messages]);

  const totalMessageCount = recipient?.messageCount ?? messages.length ?? 0;

  // ====== 반응(이모지) 추가 (OwnerPage 로직 차용) ======
  const handleAddReaction = async (emoji) => {
    if (!currentRecipientId) return;

    // emoji 객체에서 실제 이모지 값 추출 (MessageHeader에서 전달되는 형태에 따라 다를 수 있음)
    const emojiValue = emoji.emoji || emoji;

    try {
      // API에서 별칭(alias)을 요구하는 경우를 대비해 OwnerPage 로직 유지
      // EMOJI_TO_ALIAS는 API 파일에서 임포트되어야 함
      const alias = EMOJI_TO_ALIAS[emojiValue] || emojiValue;

      await reactToRecipient(currentRecipientId, {
        emoji: alias,
        type: "increase",
      });

      // 갱신된 리액션 목록을 다시 불러와 상태 업데이트 (반드시 필요)
      const updated = await fetchRecipientReactions(currentRecipientId);
      setReactions(normalizeReactionsResponse(updated));
    } catch (err) {
      console.error("반응 추가 실패:", err);
      alert("반응 추가에 실패했습니다.");
    }
  };

  // ====== 메시지 작성 페이지로 이동 ======
  const handleAddCardClick = () => {
    if (!currentRecipientId) {
      alert("페이지 ID를 찾을 수 없습니다.");
      return;
    }
    navigate(`/post/${currentRecipientId}/message`);
  };

  // ====== 모달 처리 ======
  // UserCard에서 message 객체를 통째로 전달받도록 수정
  const handleCardClick = (message) => {
    setSelectedMessage(message);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedMessage(null);
  };

  return (
    <>
      {/* 전체 배경 처리 */}
      <div
        className={`owner-page-scrollbar-hide ${
          backgroundValue?.startsWith("bg-") ? backgroundValue : ""
        }`}
        style={{
          ...(backgroundValue?.startsWith("http") || backgroundValue?.startsWith("/")
            ? {
                backgroundImage: `url(${backgroundValue})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                backgroundRepeat: "no-repeat",
              }
            : backgroundValue && !backgroundValue.startsWith("bg-")
            ? {
                backgroundColor: backgroundValue,
              }
            : {}),
        }}
      >
        <div className="flex flex-col min-h-screen">
          {/* 상단 헤더 영역 (고정) */}
          <div className="fixed top-0 left-0 w-full shadow-sm z-30 bg-white">
            <div className="max-w-[1200px] mx-auto">
              {screenMode === "mobile" ? <MobileHeader hideCreateButton /> : <HeaderNobutton />}
              {screenMode !== "mobile" && (
                <div className="mx-auto">
                  <MessageHeader
                    recipient={recipient}
                    messageCount={totalMessageCount}
                    topAvatars={topAvatars}
                    reactions={reactions}
                    onAddReaction={handleAddReaction}
                    hideAvatars={screenMode === "tablet"}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 메시지 카드 영역 */}
          <div className="flex-1 w-full pt-[102px] sm:pt-[147px] lg:pt-[171px] pb-10 relative">
            {loading && <p className="text-center mt-10">로딩 중...</p>}
            {error && !loading && (
              <div className="text-center text-red-500 mt-10">데이터를 불러오지 못했습니다.</div>
            )}

            {/* 카드 목록 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] mt-[28px] relative z-10 px-[24px]">
              {/* 메시지 추가 버튼 */}
              <div onClick={handleAddCardClick} className="cursor-pointer">
                <AddCard />
              </div>
              {messagesToRender.map((message, idx) => (
                <UserCard
                  key={message.id ?? `default-${idx}`}
                  message={message}
                  onClick={() => handleCardClick(message)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 메시지 상세 모달 */}
      {isOpen && selectedMessage && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Modal
              isOpen={isOpen}
              onClose={handleCloseModal}
              message={{
                sender: selectedMessage.sender,
                profileImageURL: selectedMessage.profileImageURL,
                relationship: selectedMessage.relationship,
                createdAt: selectedMessage.createdAt,
                content: selectedMessage.content,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default RecipientPage;

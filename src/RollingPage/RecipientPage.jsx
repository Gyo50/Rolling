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

// 컴포넌트 임포트 (OwnerPage에서 사용된 컴포넌트 구조 유지)
import HeaderNobutton from "../Component/Header/HeaderNobutton"; // OwnerPage와 동일
import MobileHeader from "../Component/Header/MobileHeader";
import MessageHeader from "../Component/Header/MessageHeader";
import Modal from "../Component/Modal/Modal";
import UserCard from "../Component/Card/UserCard"; // 메시지 삭제 기능이 없는 UserCard 유지
import AddCard from "../Component/Card/AddCard"; // 새 메시지 작성 기능 유지

// **[추가]** OwnerPage에서 가져온 색상 매핑
const COLOR_MAP = {
  beige: "#FFE2AD", // 연한 베이지 톤
  purple: "#ECD9FF", // 연한 보라 톤
  green: "#D0F5C3", // 연한 초록 톤
  blue: "#B1E4FF", // 연한 파랑 톤
};

// 상수 정의
const STATIC_MESSAGES = [];
const DEFAULT_AVATAR = "https://placehold.co/28x28";
// const DEFAULT_BACKGROUND_COLOR = "bg-beige-200"; // OwnerPage 스타일을 위해 사용하지 않음

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

  // ====== 반응형 화면 체크 ======
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

  // ====== 데이터 로드 ======
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

      // **[수정]** OwnerPage 스타일: 배경 설정 시 COLOR_MAP 사용
      if (recipientData) {
        const bg = recipientData.backgroundImageURL || recipientData.backgroundImage;
        if (bg) {
          setBackgroundValue(bg); // 이미지 URL 또는 base64/data URL
        } else if (recipientData.backgroundColor) {
          const lowerCaseColor = recipientData.backgroundColor.toLowerCase();
          const mappedColor = COLOR_MAP[lowerCaseColor] || recipientData.backgroundColor;
          setBackgroundValue(mappedColor); // 매핑된 HEX 코드
        } else {
          setBackgroundValue(""); // 기본값 없음 (흰색 또는 기본 CSS 배경)
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
      setMessages(STATIC_MESSAGES);
      setReactions([]);
      setBackgroundValue(""); // 에러 시 배경값 초기화
    } finally {
      setLoading(false);
    }
  }, [currentRecipientId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 랜더링 데이터 선택: 메시지가 없거나 로딩 실패 시 더미 데이터 표시
  const messagesToRender =messages ;

  // 작성자 프로필 아바타
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
  const hasMessages = Array.isArray(messages) && messages.length > 0;
  const isUsingFallbackMessages = messages === STATIC_MESSAGES || !hasMessages;


  // ====== 반응(이모지) 추가 ======
  const handleAddReaction = async (emoji) => {
    if (!currentRecipientId) return;
    const emojiValue = emoji.emoji || emoji;
    try {
      const alias = EMOJI_TO_ALIAS[emojiValue] || emojiValue;
      await reactToRecipient(currentRecipientId, {
        emoji: alias,
        type: "increase",
      });

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
  const handleCardClick = (message) => {
    // 더미 메시지 클릭 방지
    if (!message.id) return; 

    setSelectedMessage(message);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedMessage(null);
  };

  return (
    <>
      {/* 전체 배경 처리 (OwnerPage 스타일) */}
      <div
        className="owner-page-scrollbar-hide relative"
        style={{
          // 배경 이미지/색상 적용 로직
          ...(backgroundValue?.startsWith("http") ||
          backgroundValue?.startsWith("/")
            ? {
                backgroundImage: `url(${backgroundValue})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                backgroundRepeat: "no-repeat",
              }
            : {
                backgroundColor: backgroundValue,
              }),
        }}
      >
        {/* **[추가]** 배경에 투명도(opacity)를 적용하는 오버레이 (OwnerPage 스타일) */}
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
            backgroundColor: backgroundValue?.startsWith("http") || backgroundValue?.startsWith("/") ? '#000' : 'transparent', // 이미지 배경일 때만 검은색 오버레이
            opacity: 0.2 // 투명도
          }}
        />
        
        {/* 상단 헤더 영역 (고정) */}
        <div className="fixed top-0 left-0 w-full shadow-sm z-30 bg-white">
          <div className="w-full mx-auto">
            {screenMode === "mobile" ? (
              <MobileHeader 
              hideCreateButton
              onAddReaction={handleAddReaction}
              recipient={recipient}
              reactions={reactions} />
            ) : (
              // OwnerPage와 동일한 헤더 컴포넌트 사용
              <HeaderNobutton /> 
            )}

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

        {/* 메시지 카드 영역 (OwnerPage의 z-10 구조 유지) */}
        <div className="flex flex-col min-h-screen relative z-10">
          <div className="flex-1 w-full max-w-[1200px] mx-auto pt-[102px] sm:pt-[147px] lg:pt-[171px] pb-10 relative">
            {loading && <p className="text-center mt-10">로딩 중...</p>}
            {error && !loading && (
              <div className="text-center text-red-500 mt-10">데이터를 불러오지 못했습니다.</div>
            )}

            {/* 카드 목록 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] mt-[28px] relative z-10 px-[24px] ">
              {/* 메시지 추가 버튼 (RecipientPage 기능 유지) */}
              <div onClick={handleAddCardClick} className="cursor-pointer w-full min-w-0">
                <AddCard />
              </div>
              
              {/* 실제 메시지 렌더링 */}
              {hasMessages ? (
                messages.map((message) => (
                    <UserCard
                      key={message.id} className="min-w-0"
                      message={message}
                      onClick={() => handleCardClick(message)}
                    />
                ))
              ) : (
                !loading && (
                  <div className="mt-20 text-center text-gray-500 col-span-full">
                    아직 메시지가 없습니다.
                  </div>
                )
              )}

              {/* 로딩 실패 또는 메시지 없을 때 더미 카드 표시 (AddCard와 겹치지 않게 5개만) */}
              {isUsingFallbackMessages && !loading && (
                 messagesToRender.slice(0, 5).map((message, idx) => (
                    <UserCard
                        key={`default-${idx}`}
                        message={message}
                        onClick={() => handleCardClick(message)}
                    />
                 ))
              )}
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
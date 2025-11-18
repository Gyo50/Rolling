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

  // slicing pagination 상태
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // 반응형 체크
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

  // 첫 데이터 로딩
  const loadData = useCallback(async () => {
    if (!currentRecipientId) return;

    try {
      setLoading(true);
      setError(null);
      setHasMore(true);
      setOffset(0);

      // 3가지 데이터를 병렬로 로드
      const [recipientData, messageData, reactionData] = await Promise.all([
        fetchRecipient(currentRecipientId),

        // 전체에 가까운 메시지를 가져옴
        fetchRecipientMessages(currentRecipientId, { limit: 200 }),

        fetchRecipientReactions(currentRecipientId),
      ]);

      // 페이지 정보 설정
      setRecipient(recipientData || null);

      // 배경 처리
      if (recipientData) {
        const bg =
          recipientData.backgroundImageURL || recipientData.backgroundImage;

        if (bg) {
          setBackgroundValue(bg); // 이미지 URL 또는 base64/data URL
        } else if (recipientData.backgroundColor) {
          const lower = recipientData.backgroundColor.toLowerCase();
          const mapped = COLOR_MAP[lower] || recipientData.backgroundColor;
          setBackgroundValue(mapped);// 매핑된 HEX 코드
        }
      }

      // 전체 메시지 fullList
      const fullList =
        messageData?.results ||
        messageData?.messages ||
        messageData?.data ||
        messageData ||
        [];

      // 메시지 정규화
      const normalized = fullList.map((item) => ({
        id: item.id,
        sender: item.sender || "익명",
        content: item.content || "",
        profileImageURL: item.profileImageURL,
        relationship: item.relationship || "지인",
        createdAt: item.createdAt?.split("T")[0] || "",
      }));

      // slicing: 첫 10개 표시
      const firstSlice = normalized.slice(0, 10);
      setMessages(firstSlice);

      // 다음 오프셋(다음 슬라이스 시작 위치)
      setOffset(10);

      // 더 이상 로딩할 메시지가 없다면
      if (normalized.length <= 10) {
        setHasMore(false);
      }

      // 반응
      const normalizedReactions = normalizeReactionsResponse(reactionData);
      setReactions(normalizedReactions);
    } catch (err) {
      console.error("데이터 불러오기 실패:", err);
      setError(new Error("데이터를 불러올 수 없습니다."));
      setMessages(STATIC_MESSAGES);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [currentRecipientId]);

  // 첫 로딩
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 무한 스크롤 loadMoreMessages
  const loadMoreMessages = useCallback(async () => {
    if (!currentRecipientId || isFetchingMore || !hasMore) return;

    try {
      setIsFetchingMore(true);

      // 다시 전체 리스트를 limit=200으로 가져옴
      const messageData = await fetchRecipientMessages(currentRecipientId, {
        limit: 200,
      });

      const fullList =
        messageData?.results ||
        messageData?.messages ||
        messageData?.data ||
        messageData ||
        [];

      const normalized = fullList.map((item) => ({
        id: item.id,
        sender: item.sender || "익명",
        content: item.content || "",
        profileImageURL: item.profileImageURL,
        relationship: item.relationship || "지인",
        createdAt: item.createdAt?.split("T")[0] || "",
      }));

      // slicing: 현재 offset부터 10개
      const sliced = normalized.slice(offset, offset + 10);

      // 더 이상 가져올 메시지가 없다면
      if (sliced.length === 0) {
        setHasMore(false);
        return;
      }

      // 중복 제거 + append
      setMessages((prev) => {
        const existIds = new Set(prev.map((m) => m.id));
        const filtered = sliced.filter((m) => !existIds.has(m.id));
        return [...prev, ...filtered];
      });

      // 다음 offset 위치
      setOffset((prev) => prev + 10);

      // 다음 offset이 전체 길이 이상이면 더 이상 로딩 X
      if (offset + 10 >= normalized.length) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("추가 메시지 로딩 실패:", err);
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
    }
  }, [currentRecipientId, offset, hasMore, isFetchingMore]);
  // ===== 스크롤 이벤트 등록 =====
  useEffect(() => {
    const handleScroll = () => {
      if (loading || isFetchingMore || !hasMore) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      // 바닥에서 100px 남았을 때 다음 로드
      if (scrollTop + windowHeight + 100 >= fullHeight) {
        loadMoreMessages();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, isFetchingMore, hasMore, loadMoreMessages]);

  // ===== 메시지 카드 클릭 =====
  const handleCardClick = (message) => {
    if (!message.id) return;
    setSelectedMessage(message);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedMessage(null);
  };

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

    return unique.slice(0, 3);
  }, [messages]);

  const totalMessageCount = recipient?.messageCount ?? messages.length ?? 0;
  const hasMessages = Array.isArray(messages) && messages.length > 0;

  return (
    <>
      {/* 전체 배경 */}
      <div
        className="owner-page-scrollbar-hide relative"
        style={{
          ...(backgroundValue?.startsWith("http") ||
          backgroundValue?.startsWith("/")
            ? {
                backgroundImage: `url(${backgroundValue})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                backgroundRepeat: "no-repeat",
              }
            : { backgroundColor: backgroundValue }),
        }}
      >
        {/* 배경 오버레이 */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor:
              backgroundValue?.startsWith("http") ||
              backgroundValue?.startsWith("/")
                ? "#000"
                : "transparent",
            opacity: 0.2,
          }}
        />

        {/* 헤더 */}
        <div className="fixed top-0 left-0 w-full shadow-sm z-30 bg-white">
          <div className="mx-auto">
            {screenMode === "mobile" ? (
              <MobileHeader
                hideCreateButton
                onAddReaction={async (emoji) => {
                  const alias = EMOJI_TO_ALIAS[emoji] || emoji;
                  await reactToRecipient(currentRecipientId, {
                    emoji: alias,
                    type: "increase",
                  });
                  const updated = await fetchRecipientReactions(
                    currentRecipientId
                  );
                  setReactions(normalizeReactionsResponse(updated));
                }}
                recipient={recipient}
                reactions={reactions}
              />
            ) : (
              <HeaderNobutton />
            )}

            {screenMode !== "mobile" && (
              <div className="mx-auto">
                <MessageHeader
                  recipient={recipient}
                  messageCount={totalMessageCount}
                  topAvatars={topAvatars}
                  reactions={reactions}
                  onAddReaction={async (emoji) => {
                    const alias = EMOJI_TO_ALIAS[emoji] || emoji;
                    await reactToRecipient(currentRecipientId, {
                      emoji: alias,
                      type: "increase",
                    });
                    const updated = await fetchRecipientReactions(
                      currentRecipientId
                    );
                    setReactions(normalizeReactionsResponse(updated));
                  }}
                  hideAvatars={screenMode === "tablet"}
                />
              </div>
            )}
          </div>
        </div>

        {/* 메시지 카드 영역 */}
        <div className="flex flex-col min-h-screen relative z-10">
          <div className="flex-1 w-full max-w-[1200px] mx-auto pt-[102px] sm:pt-[147px] lg:pt-[171px] pb-10 relative">
            {loading && <p className="text-center mt-10">로딩 중...</p>}
            {error && !loading && (
              <div className="text-center text-red-500 mt-10">
                데이터를 불러오지 못했습니다.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] mt-[28px] relative z-10 px-[24px]">
              {/* 메시지 작성 버튼 */}
              <div
                onClick={() => navigate(`/post/${currentRecipientId}/message`)}
                className="cursor-pointer w-full min-w-0"
              >
                <AddCard />
              </div>

              {/* 메시지 렌더링 */}
              {hasMessages
                ? messages.map((message) => (
                    <UserCard
                      key={message.id}
                      className="min-w-0"
                      message={message}
                      onClick={() => handleCardClick(message)}
                    />
                  ))
                : !loading && (
                    <div className="col-span-full text-center text-gray-500 mt-20">
                      아직 메시지가 없습니다.
                    </div>
                  )}
            </div>

            {/* 추가 로딩 표시 */}
            {isFetchingMore && (
              <p className="text-center mt-4 text-gray-500">불러오는 중...</p>
            )}

            {!hasMore && (
              <p className="text-center mt-6 text-gray-400">
                모든 메시지를 불러왔습니다.
              </p>
            )}
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

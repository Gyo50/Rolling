import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import HeaderNobutton from "../Component/Header/HeaderNobutton";
import MobileHeader from "../Component/Header/MobileHeader";
import MessageHeader from "../Component/Header/MessageHeader";
import DeleteButton from "../Component/Button/Delete-button";
import Modal from "../Component/Modal/Modal";
import Card from "../Component/Card/Card";
import DeleteModal from "../Component/Modal/DeleteModal";

import {
  fetchRecipient,
  fetchRecipientMessages,
  fetchRecipientReactions,
  deleteRecipient,
  reactToRecipient,
  normalizeReactionsResponse,
  EMOJI_TO_ALIAS,
} from "../api/recipients";

const STATIC_MESSAGES = [];

const COLOR_MAP = {
  beige: "#FFE2AD",
  purple: "#ECD9FF",
  green: "#D0F5C3",
  blue: "#B1E4FF",
};

// URL 경로에서 recipientId 추출
const getRecipientIdFromPath = (explicitId, paramsId) => {
  if (explicitId != null) return explicitId;
  if (paramsId != null) return paramsId;
  if (typeof window === "undefined") return null;

  const match = window.location.pathname.match(/\/post\/(\d+)/);
  return match ? match[1] : null;
};

function OwnerPage({ recipientId }) {
  const navigate = useNavigate();
  const { id: paramsId } = useParams();

  // ====== 상태 관리 ======
  const [recipient, setRecipient] = useState(null); // 페이지 정보
  const [messages, setMessages] = useState([]); // 메시지 리스트
  const [reactions, setReactions] = useState([]); // 반응 목록

  const [backgroundValue, setBackgroundValue] = useState("");  // 배경 이미지/색상 값

  const [isOpen, setIsOpen] = useState(false); // 메시지 상세 모달 열림 여부
  const [selectedMessage, setSelectedMessage] = useState(null); // 선택된 메시지

  const [screenMode, setScreenMode] = useState("pc"); // 반응형 모드 (pc / tablet / mobile)

  // 삭제 관련
  const [deleting, setDeleting] = useState(false); // 페이지 삭제 중인지 여부
  const [isPageDeleteModalOpen, setIsPageDeleteModalOpen] = useState(false); // 페이지 삭제 모달 열림
  const [isMessageDeleteModalOpen, setIsMessageDeleteModalOpen] =
    useState(false); // 메시지 삭제 모달 열림
  const [messageToDeleteId, setMessageToDeleteId] = useState(null); // 삭제할 메시지 ID 저장

  // 로딩 관련
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // slicing pagination
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // URL 또는 props로 받은 recipientId 결정
  const currentRecipientId = useMemo(
    () => getRecipientIdFromPath(recipientId, paramsId),
    [recipientId, paramsId]
  );

  // 이 부분은 /owner 이동을 막음  
  /*useEffect(() => {
    if (currentRecipientId) {
      // 로컬 스토리지에서 소유자 키를 확인
      const isOwner = localStorage.getItem(`owner_${currentRecipientId}`) === 'true';

      if (!isOwner) {
        console.warn(`ID ${currentRecipientId}: 소유자 권한 없음. 방문자 페이지로 리다이렉트.`);
        // 소유자가 아니면 '/post/:id' 경로로 리다이렉트 (RecipientPage로 이동)
        navigate(`/post/${currentRecipientId}`, { replace: true });
      }
    }
  }, [currentRecipientId, navigate]);*/

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

  // 첫 데이터 로드
  const loadData = useCallback(async () => {
    if (!currentRecipientId) return;

    try {
      setLoading(true);
      setError(null);
      setHasMore(true);
      setOffset(0);

      const [recipientData, messageData, reactionData] = await Promise.all([
        fetchRecipient(currentRecipientId),

        // 전체 메시지 확보용 limit=200
        fetchRecipientMessages(currentRecipientId, { limit: 200 }),

        fetchRecipientReactions(currentRecipientId),
      ]);

      setRecipient(recipientData || null);

      // 배경 적용
      if (recipientData) {
        const bg =
          recipientData.backgroundImageURL || recipientData.backgroundImage;
        if (bg) {
          setBackgroundValue(bg);
        } else if (recipientData.backgroundColor) {
          const lower = recipientData.backgroundColor.toLowerCase();
          setBackgroundValue(COLOR_MAP[lower] || recipientData.backgroundColor);
        }
      }

      // 전체 메시지를 fullList에 저장
      const fullList =
        messageData?.results ||
        messageData?.messages ||
        messageData?.data ||
        messageData ||
        [];

      const normalized = fullList.map((item) => ({
        id: item.id,
        senderName: item.sender || "익명",
        content: item.content || "",
        profileImageURL: item.profileImageURL,
        relationship: item.relationship || "지인",
        date: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "",
      }));

      // slicing — 첫 10개만 표시
      const firstSlice = normalized.slice(0, 10);
      setMessages(firstSlice);
      setOffset(10);

      if (normalized.length <= 10) setHasMore(false);

      // 반응 정리
      const normalizedReactions = normalizeReactionsResponse(reactionData);
      setReactions(normalizedReactions);
    } catch (err) {
      console.error("데이터 불러오기 실패:", err);
      setError(err);
      setMessages(STATIC_MESSAGES);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [currentRecipientId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // loadMoreMessages
  const loadMoreMessages = useCallback(async () => {
    if (!currentRecipientId || isFetchingMore || !hasMore) return;

    try {
      setIsFetchingMore(true);

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
        senderName: item.sender || "익명",
        content: item.content || "",
        profileImageURL: item.profileImageURL,
        relationship: item.relationship || "지인",
        date: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "",
      }));

      const sliced = normalized.slice(offset, offset + 10);

      if (sliced.length === 0) {
        setHasMore(false);
        return;
      }

      setMessages((prev) => {
        const existIds = new Set(prev.map((m) => m.id));
        return [...prev, ...sliced.filter((m) => !existIds.has(m.id))];
      });

      setOffset((prev) => prev + 10);

      if (offset + 10 >= normalized.length) setHasMore(false);
    } catch (err) {
      console.error("추가 메시지 로딩 실패:", err);
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
    }
  }, [currentRecipientId, offset, hasMore, isFetchingMore]);

  // ====== 스크롤 이벤트 ======
  useEffect(() => {
    const handleScroll = () => {
      if (loading || isFetchingMore || !hasMore) return;

      const scrollTop = window.scrollY;
      const winH = window.innerHeight;
      const fullH = document.documentElement.scrollHeight;

      if (scrollTop + winH + 250 >= fullH) {
        loadMoreMessages();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, isFetchingMore, hasMore, loadMoreMessages]);
  
  // 메시지 카드 클릭 (내용 보기)
  const handleCardClick = (message) => {
    setSelectedMessage(message);
    setIsOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setSelectedMessage(null);
    setIsOpen(false);
  };

  // 모달 열기/닫기
  const handleOpenPageDeleteModal = () => setIsPageDeleteModalOpen(true);
  const handleClosePageDeleteModal = () => setIsPageDeleteModalOpen(false);

  const handleOpenMessageDeleteModal = (id) => {
    setMessageToDeleteId(id);
    setIsMessageDeleteModalOpen(true);
  };

  const handleCloseMessageDeleteModal = () => {
    setMessageToDeleteId(null);
    setIsMessageDeleteModalOpen(false);
  };

  // 페이지 삭제
  const handleConfirmPageDelete = async () => {
    try {
      setDeleting(true);
      await deleteRecipient(currentRecipientId);
      navigate("/list", { replace: true });
    } finally {
      setDeleting(false);
      setIsPageDeleteModalOpen(false);
    }
  };

  // 메시지 삭제
  const handleConfirmMessageDelete = async () => {
    await fetch(
      `https://rolling-api.vercel.app/20-4/messages/${messageToDeleteId}/`,
      { method: "DELETE" }
    );

    setMessages((prev) => prev.filter((msg) => msg.id !== messageToDeleteId));
    handleCloseMessageDeleteModal();
  };

  // 작성자 프로필 아바타
  const topAvatars = useMemo(() => {
    const unique = [];
    const seen = new Set();

    messages.forEach((msg) => {
      const key = msg.senderName || msg.profileImageURL;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push({
          src: msg.profileImageURL || "https://placehold.co/28x28",
          alt: msg.senderName,
        });
      }
    });

    return unique.slice(0, 3); // 최대 3개만 표시
  }, [messages]);

  const totalMessageCount = recipient?.messageCount ?? messages.length ?? 0;

  return (
    <>
      {/* 전체 배경 처리 */}
      <div
        className="owner-page-scrollbar-hide relative"
        style={{
          ...(backgroundValue?.startsWith("http")
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
                ? "#000" // 이미지일 때만 블랙 오버레이
                : "transparent", // 배경색일 때는 투명
            opacity:
              backgroundValue?.startsWith("http") ||
              backgroundValue?.startsWith("/")
                ? 0.2
                : 1,
          }}
        />

        {/* 헤더 */}
        <div className="fixed top-0 left-0 w-full shadow-sm z-30 bg-white">
          {screenMode === "mobile" ? (
            <MobileHeader
              hideCreateButton
              reactions={reactions}
              recipient={recipient}
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
            />
          ) : (
            <HeaderNobutton />
          )}

          {screenMode !== "mobile" && (
            <MessageHeader
              recipient={recipient}
              messageCount={totalMessageCount}
              topAvatars={topAvatars}
              reactions={reactions}
              hideAvatars={screenMode === "tablet"}
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
            />
          )}
        </div>

        {error && !loading && (
          <div className="text-center text-red-500 mt-10">
            데이터를 불러오지 못했습니다.
            <br />
            {error.message}
          </div>
        )}

        {/* 카드 리스트 */}
        <div className="flex flex-col min-h-screen relative z-10">
          <div className="flex-1 w-full max-w-[1200px] mx-auto pt-[124px] sm:pt-[147px] lg:pt-[171px] pb-10">
            {/* PC 삭제 버튼 */}
            {screenMode === "pc" && (
              <div className="flex justify-end px-[24px] mb-[16px]">
                <div onClick={handleOpenPageDeleteModal}>
                  <DeleteButton text={deleting ? "삭제 중..." : "삭제하기"} />
                </div>
              </div>
            )}

            {/* 메시지 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] px-[24px]">
              {messages.map((item) => (
                <Card
                  key={item.id}
                  senderName={item.senderName}
                  profileImageURL={item.profileImageURL}
                  relationship={item.relationship}
                  content={item.content}
                  isHtml
                  date={item.date}
                  onClick={() => handleCardClick(item)}
                  onDeleteClick={(e) => {
                    e.stopPropagation();
                    handleOpenMessageDeleteModal(item.id);
                  }}
                />
              ))}
            </div>

            {isFetchingMore && (
              <p className="text-center mt-4 text-gray-400">불러오는 중...</p>
            )}

            {!hasMore && (
              <p className="text-center mt-6 text-gray-400">
                모든 메시지를 불러왔습니다.
              </p>
            )}
          </div>

          {/* 모바일 삭제 버튼 */}
          {screenMode !== "pc" && (
            <div className="fixed bottom-0 left-0 right-0 z-40 px-[24px] pb-[24px]">
              <div
                onClick={handleOpenPageDeleteModal}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-[12px] text-18-bold shadow-lg text-center"
              >
                {deleting ? "삭제 중..." : "삭제하기"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메시지 모달 */}
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
                sender: selectedMessage.senderName,
                profileImageURL: selectedMessage.profileImageURL,
                relationship: selectedMessage.relationship,
                createdAt: selectedMessage.date,
                content: selectedMessage.content,
              }}
            />
          </div>
        </div>
      )}

      {/* 페이지 삭제 */}
      {isPageDeleteModalOpen && (
        <DeleteModal
          title="페이지 삭제 확인"
          message="페이지를 삭제하시겠습니까?"
          onConfirm={handleConfirmPageDelete}
          onCancel={handleClosePageDeleteModal}
          isLoading={deleting}
        />
      )}

      {/* 메시지 삭제 모달 */}
      {isMessageDeleteModalOpen && (
        <DeleteModal
          title="메시지 삭제 확인"
          message="이 메시지를 삭제하시겠습니까?"
          onConfirm={handleConfirmMessageDelete}
          onCancel={handleCloseMessageDeleteModal}
        />
      )}
    </>
  );
}

export default OwnerPage;

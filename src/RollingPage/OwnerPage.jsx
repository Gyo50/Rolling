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

const STATIC_MESSAGES = Array.from({ length: 3 }).map((_, index) => ({
  id: index + 1,
  senderName: `보낸 이 #${index + 1}`,
  content: `API 로드 실패 시의 샘플 메시지 ${index + 1}입니다.`,
  profileImageURL: `https://placehold.co/40x40?text=${index + 1}`,
  date: "",
  relationship: ["동료", "친구", "가족"][index % 3],
}));

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

  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // ⭐ 이미지 or 색상 통합 값
  const [backgroundValue, setBackgroundValue] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isPageDeleteModalOpen, setIsPageDeleteModalOpen] = useState(false);
  const [isMessageDeleteModalOpen, setIsMessageDeleteModalOpen] =
    useState(false);
  const [messageToDeleteId, setMessageToDeleteId] = useState(null);
  const [screenMode, setScreenMode] = useState("pc");

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

  const currentRecipientId = useMemo(
    () => getRecipientIdFromPath(recipientId, paramsId),
    [recipientId, paramsId]
  );

  const loadData = useCallback(async () => {
    if (!currentRecipientId) {
      setRecipient(null);
      setMessages(STATIC_MESSAGES);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [recipientData, messageData, reactionData] = await Promise.all([
        fetchRecipient(currentRecipientId),
        fetchRecipientMessages(currentRecipientId, { limit: 20 }),
        fetchRecipientReactions(currentRecipientId),
      ]);

      setRecipient(recipientData || null);

      // ⭐ 배경 (이미지 우선 → 없으면 색상)
      if (recipientData) {
        if (recipientData.backgroundImageURL || recipientData.backgroundImage) {
          setBackgroundValue(
            recipientData.backgroundImageURL || recipientData.backgroundImage
          );
        } else if (recipientData.backgroundColor) {
          setBackgroundValue(recipientData.backgroundColor);
        } else {
          setBackgroundValue("");
        }
      }

      const normalizedMessages = (
        messageData?.results ||
        messageData ||
        []
      ).map((item, index) => ({
        id: item.id ?? index,
        senderName: item.sender || "익명",
        content: item.content || "",
        profileImageURL:
          item.profileImageURL ||
          `https://placehold.co/40x40?text=${(item.sender || "U")[0]}`,
        date: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "",
        relationship: item.relationship || "지인",
      }));

      setMessages(normalizedMessages);

      const normalizedReactions = normalizeReactionsResponse(reactionData);
      setReactions(normalizedReactions);
    } catch (err) {
      console.error("데이터 불러오기 실패:", err);
      setError(new Error(err?.message || "데이터를 불러올 수 없습니다."));
      setRecipient(null);
      setMessages(STATIC_MESSAGES);
      setReactions([]);
    } finally {
      setLoading(false);
    }
  }, [currentRecipientId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddReaction = async (emoji) => {
    if (!currentRecipientId) return;
    try {
      const alias = EMOJI_TO_ALIAS[emoji] || emoji;
      await reactToRecipient(currentRecipientId, {
        emoji: alias,
        type: "increase",
      });
      const updated = await fetchRecipientReactions(currentRecipientId);
      setReactions(normalizeReactionsResponse(updated));
    } catch (err) {
      console.error("반응 추가 실패:", err);
    }
  };

  const handleConfirmPageDelete = async () => {
    if (!currentRecipientId || deleting) return;

    try {
      setDeleting(true);
      setDeleteError(null);
      await deleteRecipient(currentRecipientId);
      navigate("/list", { replace: true });
    } catch (err) {
      console.error("페이지 삭제 실패:", err);
      setDeleteError(new Error(err?.message || "페이지 삭제 실패"));
    } finally {
      setDeleting(false);
      setIsPageDeleteModalOpen(false);
    }
  };

  const handleConfirmMessageDelete = () => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageToDeleteId));
    handleCloseMessageDeleteModal();
  };

  const handleCardClick = (message) => {
    setSelectedMessage(message);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedMessage(null);
  };

  const handleOpenPageDeleteModal = () => setIsPageDeleteModalOpen(true);
  const handleClosePageDeleteModal = () => setIsPageDeleteModalOpen(false);

  const handleOpenMessageDeleteModal = (id) => {
    setMessageToDeleteId(id);
    setIsMessageDeleteModalOpen(true);
  };
  const handleCloseMessageDeleteModal = () => {
    setIsMessageDeleteModalOpen(false);
    setMessageToDeleteId(null);
  };

  const topAvatars = useMemo(() => {
    const unique = [];
    const seen = new Set();
    messages.forEach((msg) => {
      const key = msg.senderName || msg.profileImageURL;
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push({
          src: msg.profileImageURL || "https://placehold.co/28x28",
          alt: msg.senderName || "작성자",
        });
      }
    });
    return unique.slice(0, 3);
  }, [messages]);

  const totalMessageCount = recipient?.messageCount ?? messages.length ?? 0;
  const hasMessages = Array.isArray(messages) && messages.length > 0;
  const isUsingFallbackMessages = messages === STATIC_MESSAGES;

  return (
    <>
      {/* 색상 or 이미지 자동 적용 */}
      <div
        className="owner-page-scrollbar-hide"
        style={{
          background: backgroundValue
            ? backgroundValue.startsWith("http") ||
              backgroundValue.startsWith("/")
              ? `url(${backgroundValue})`
              : backgroundValue // 색상
            : undefined,

          // 이미지일 때 = contain (확대 안 됨)
          backgroundSize:
            backgroundValue?.startsWith("http") ||
            backgroundValue?.startsWith("/")
              ? "contain"
              : "cover",

          backgroundRepeat:
            backgroundValue?.startsWith("http") ||
            backgroundValue?.startsWith("/")
              ? "no-repeat"
              : undefined,

          backgroundPosition: "center",
        }}
      >
        
        <div className="flex flex-col min-h-screen">
          {/* 헤더 */}
          <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-30">
            {screenMode === "mobile" ? (
              <MobileHeader hideCreateButton />
            ) : (
              <HeaderNobutton />
            )}

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
          </div>

          {/* 카드 영역 */}
          <div className="flex-1 w-full pt-[102px] sm:pt-[147px] lg:pt-[171px] pb-10 relative">
            <div className="mx-auto max-w-[1200px] px-[24px] relative">
              {/* PC 삭제 버튼 */}
              {screenMode === "pc" && (
                <div className="mx-auto max-w-[1200px] w-full flex justify-end mb-[16px]">
                  <button
                    onClick={handleOpenPageDeleteModal}
                    disabled={deleting}
                  >
                    <DeleteButton text={deleting ? "삭제 중..." : "삭제하기"} />
                  </button>
                </div>
              )}

              {loading && <p className="text-center mt-10">로딩 중...</p>}

              {error && !loading && (
                <div className="text-center text-red-500 mt-10">
                  데이터를 불러오지 못했습니다.
                  <br />
                  {error.message}
                </div>
              )}

              {deleteError && (
                <div className="text-center text-red-500 mt-6">
                  페이지 삭제 실패:
                  <br />
                  {deleteError.message}
                </div>
              )}

              {hasMessages ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] mt-[28px] relative z-10">
                  {messages.map((item) => (
                    <Card
                      key={item.id}
                      senderName={item.senderName}
                      profileImageURL={item.profileImageURL}
                      relationship={item.relationship}
                      content={item.content}
                      date={item.date}
                      onClick={() => handleCardClick(item)}
                      onDeleteClick={(e) => {
                        e.stopPropagation();
                        handleOpenMessageDeleteModal(item.id);
                      }}
                    />
                  ))}
                </div>
              ) : (
                !loading && (
                  <div className="mt-20 text-center text-gray-500">
                    {isUsingFallbackMessages
                      ? "샘플 데이터를 표시합니다."
                      : "아직 메시지가 없습니다."}
                  </div>
                )
              )}
            </div>
          </div>
          {/* 모바일 삭제 버튼 */}
          {screenMode !== "pc" && (
            <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pt-0">
              <div className="mx-auto max-w-[1200px] px-0">
                <button
                  onClick={handleOpenPageDeleteModal}
                  disabled={deleting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-[12px] text-18-bold shadow-lg disabled:bg-gray-400"
                >
                  {deleting ? "삭제 중..." : "삭제하기"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메시지 상세 모달 */}
      {isOpen && selectedMessage && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <Modal
            onClick={(e) => e.stopPropagation()}
            isOpen={isOpen}
            onClose={handleCloseModal}
            senderName={selectedMessage.senderName}
            content={selectedMessage.content}
            profileImage={selectedMessage.profileImageURL}
            relationship={selectedMessage.relationship}
            date={selectedMessage.date}
          />
        </div>
      )}

      {/* 페이지 삭제 모달 */}
      {isPageDeleteModalOpen && (
        <DeleteModal
          title="페이지 삭제 확인"
          message="페이지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
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
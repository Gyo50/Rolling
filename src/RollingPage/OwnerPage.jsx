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
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [reactions, setReactions] = useState([]); // 반응 목록

  const [deleting, setDeleting] = useState(false); // 페이지 삭제 중인지 여부
  const [deleteError, setDeleteError] = useState(null); // 페이지 삭제 에러

  const [backgroundValue, setBackgroundValue] = useState(""); // 배경 이미지/색상 값
  const [isOpen, setIsOpen] = useState(false); // 메시지 상세 모달 열림 여부
  const [selectedMessage, setSelectedMessage] = useState(null); // 선택된 메시지
  const [isPageDeleteModalOpen, setIsPageDeleteModalOpen] = useState(false); // 페이지 삭제 모달 열림
  const [isMessageDeleteModalOpen, setIsMessageDeleteModalOpen] =
    useState(false); // 메시지 삭제 모달 열림
  const [messageToDeleteId, setMessageToDeleteId] = useState(null); // 삭제할 메시지 ID 저장
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

  // URL 또는 props로 받은 recipientId 결정
  const currentRecipientId = useMemo(
    () => getRecipientIdFromPath(recipientId, paramsId),
    [recipientId, paramsId]
  );

  // ====== 데이터 로드 (페이지 정보 / 메시지 / 반응) ======
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

      // 배경
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

      // 메시지
      const rawMessages =
        messageData?.results ||
        messageData?.messages ||
        messageData?.data ||
        messageData ||
        [];

      const normalizedMessages = rawMessages.map((item) => ({
        id: item.id,
        senderName: item.sender || "익명",
        content: item.content || "",
        profileImageURL: item.profileImageURL,
        date: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "",
        relationship: item.relationship || "지인",
      }));

      setMessages(normalizedMessages);

      // 반응 정리
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

  // ====== 반응(이모지) 추가 ======
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

  // ====== 페이지 삭제 ======
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

  // ====== 메시지 삭제 ======
  const handleConfirmMessageDelete = async () => {
    await fetch(
      `https://rolling-api.vercel.app/20-4/messages/${messageToDeleteId}/`,
      {
        method: "DELETE",
      }
    );

    setMessages((prev) =>
      prev.filter((msg) => Number(msg.id) !== Number(messageToDeleteId))
    );

    handleCloseMessageDeleteModal();
  };

  // ====== 메시지 카드 클릭 (내용 보기) ======
  const handleCardClick = (message) => {
    setSelectedMessage(message);
    setIsOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedMessage(null);
  };

  // ====== 모달 열기/닫기 ======
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

  // 작성자 프로필 아바타
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
    return unique.slice(0, 3); // 최대 3개만 표시
  }, [messages]);

  const totalMessageCount = recipient?.messageCount ?? messages.length ?? 0;
  const hasMessages = Array.isArray(messages) && messages.length > 0;
  const isUsingFallbackMessages = messages === STATIC_MESSAGES;

  return (
    <>
      {/* 전체 배경 처리 */}
      <div
        className="owner-page-scrollbar-hide"
        style={{
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
        {/* 헤더 */}
        <div className="fixed top-0 left-0 w-full shadow-sm z-30 bg-white">
          <div className="max-w-[1200px] mx-auto">
            {screenMode === "mobile" ? (
              <MobileHeader hideCreateButton />
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
                  onAddReaction={handleAddReaction}
                  hideAvatars={screenMode === "tablet"}
                />
              </div>
            )}
            </div>
          </div>

        <div className="flex flex-col min-h-screen">
          {/* 카드 영역 */}
          <div className="flex-1 w-full pt-[102px] sm:pt-[147px] lg:pt-[171px] pb-10 relative">
            <div className="mx-auto max-w-[1200px] relative">
              {/* PC 삭제 버튼 */}
              {screenMode === "pc" && (
                <div className="w-full max-w-[1200px] mx-auto flex justify-end px-[24px] mb-[16px]">
                  <div onClick={handleOpenPageDeleteModal} disabled={deleting}>
                    <DeleteButton text={deleting ? "삭제 중..." : "삭제하기"} />
                  </div>
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

              {/* 카드 리스트 */}
              {hasMessages ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] mt-[28px] relative z-10 px-[24px]">
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
            <div className="fixed bottom-0 left-0 right-0 z-40 px-[24px] pt-0">
              <div className="mx-auto max-w-[1200px] px-0">
                <div
                  onClick={handleOpenPageDeleteModal}
                  disabled={deleting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-[12px] text-18-bold shadow-lg disabled:bg-gray-400 flex items-center justify-center text-center"
                >
                  {deleting ? "삭제 중..." : "삭제하기"}
              </div>
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

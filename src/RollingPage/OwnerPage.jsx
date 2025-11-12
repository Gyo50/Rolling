import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Component/Header/Header";
import MobileHeader from "../Component/Header/MobileHeader";
import MessageHeader from "../Component/Header/MessageHeader";
import Card from "../Component/Card/Card";
import DeleteModal from "../Component/Modal/DeleteModal"; // 공통 DeleteModal
import Modal from "../Component/Modal/Modal";
import {
  fetchRecipient,
  fetchRecipientMessages,
  fetchRecipientReactions,
  deleteRecipient,
  reactToRecipient,
  normalizeReactionsResponse,
  EMOJI_TO_ALIAS,
} from "../api/recipients";

// 정적 메시지 fallback
const STATIC_MESSAGES = Array.from({ length: 15 }).map((_, index) => ({
  id: index + 1,
  senderName: `보낸 이 #${index + 1}`,
  content: `샘플 메시지 ${index + 1}`,
  profileImageURL: `https://placehold.co/40x40?text=${index + 1}`,
  date: `2023.10.${10 + index}`,
  relationship: ["동료", "친구", "가족"][index % 3],
}));

const getRecipientIdFromPath = (explicitId, paramsId) => {
  if (explicitId !== undefined && explicitId !== null) return explicitId;
  if (paramsId !== undefined && paramsId !== null) return paramsId;
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/\/post\/(\d+)/);
  return match ? match[1] : null;
};

function OwnerPage({ recipientId }) {
  const navigate = useNavigate();
  const { id: paramsId } = useParams();

  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [screenMode, setScreenMode] = useState("pc");

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const [isPageDeleteModalOpen, setIsPageDeleteModalOpen] = useState(false);
  const [isMessageDeleteModalOpen, setIsMessageDeleteModalOpen] = useState(false);
  const [messageToDeleteId, setMessageToDeleteId] = useState(null);

  const [deleting, setDeleting] = useState(false);

  const currentRecipientId = useMemo(
    () => getRecipientIdFromPath(recipientId, paramsId),
    [recipientId, paramsId]
  );

  // ==========================
  // 데이터 로드
  // ==========================
  useEffect(() => {
    let active = true;
    const loadData = async () => {
      if (!currentRecipientId) {
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

        if (!active) return;

        setRecipient(recipientData || null);
        const normalizedMessages = (messageData?.results || messageData || []).map(
          (item, index) => ({
            id: item.id ?? index,
            senderName: item.sender || "익명",
            content: item.content || "",
            profileImageURL:
              item.profileImageURL ||
              `https://placehold.co/40x40?text=${(item.sender || "U").slice(0, 1)}`,
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
            relationship: item.relationship || "지인",
          })
        );
        setMessages(normalizedMessages.length ? normalizedMessages : STATIC_MESSAGES);

        setReactions(normalizeReactionsResponse(reactionData));
      } catch (err) {
        console.error(err);
        setMessages(STATIC_MESSAGES);
        setReactions([]);
        setError(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [currentRecipientId]);

  // ==========================
  // 화면 모드 감지
  // ==========================
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

  // ==========================
  // 메시지 상세 모달
  // ==========================
  const handleCardClick = (message) => {
    setSelectedMessage(message);
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedMessage(null);
    setIsOpen(false);
  };

  // ==========================
  // 삭제 관련
  // ==========================
  const handleOpenPageDeleteModal = () => setIsPageDeleteModalOpen(true);
  const handleClosePageDeleteModal = () => setIsPageDeleteModalOpen(false);

  const handleConfirmPageDelete = async () => {
    if (!currentRecipientId || deleting) return;
    try {
      setDeleting(true);
      await deleteRecipient(currentRecipientId);
      navigate("/list", { replace: true });
    } catch (err) {
      console.error(err);
      alert("페이지 삭제 실패");
    } finally {
      setDeleting(false);
      setIsPageDeleteModalOpen(false);
    }
  };

  const handleOpenMessageDeleteModal = (id) => {
    setMessageToDeleteId(id);
    setIsMessageDeleteModalOpen(true);
  };
  const handleCloseMessageDeleteModal = () => {
    setMessageToDeleteId(null);
    setIsMessageDeleteModalOpen(false);
  };
  const handleConfirmMessageDelete = () => {
    setMessages((prev) => prev.filter((m) => m.id !== messageToDeleteId));
    setIsMessageDeleteModalOpen(false);
  };

  // ==========================
  // 반응 추가
  // ==========================
  const handleAddReaction = async (emoji) => {
    if (!currentRecipientId) return;
    try {
      const alias = EMOJI_TO_ALIAS[emoji];
      if (!alias) return;
      await reactToRecipient(currentRecipientId, { emoji: alias, type: "increase" });
      const updated = await fetchRecipientReactions(currentRecipientId);
      setReactions(normalizeReactionsResponse(updated));
    } catch (err) {
      console.error(err);
      alert("반응 추가 실패");
    }
  };

  // ==========================
  // topAvatars
  // ==========================
  const topAvatars = useMemo(() => {
    const unique = [];
    const seen = new Set();
    messages.forEach((msg) => {
      const key = msg.senderName || msg.profileImageURL;
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push({
          src: msg.profileImageURL,
          alt: msg.senderName,
        });
      }
    });
    return unique;
  }, [messages]);

  // ==========================
  // 렌더링
  // ==========================
  return (
    <>
      <div className="owner-page-scrollbar-hide">
        <div className="flex flex-col min-h-screen bg-beige-200">
          {/* 헤더 */}
          <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-30">
            {screenMode === "mobile" ? (
              <MobileHeader hideCreateButton />
            ) : (
              <>
                <Header hideCreateButton />
                <div className="mx-auto max-w-[1200px]">
                  <MessageHeader
                    recipient={recipient}
                    messageCount={messages.length}
                    topAvatars={topAvatars}
                    reactions={reactions}
                    onAddReaction={handleAddReaction}
                  />
                </div>
              </>
            )}
          </div>

          {/* 카드 영역 */}
          <div className="flex-1 w-full pt-[102px] sm:pt-[147px] lg:pt-[171px] pb-10 relative">
            <div className="mx-auto max-w-[1200px] px-[24px] relative">
              {screenMode === "pc" && (
                <div className="mx-auto max-w-[1200px] w-full flex justify-end mb-[16px]">
                  <button onClick={handleOpenPageDeleteModal}>삭제하기</button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] mt-[28px] relative z-10">
                {messages.map((msg) => (
                  <Card
                    key={msg.id}
                    {...msg}
                    onClick={() => handleCardClick(msg)}
                    onDeleteClick={(e) => {
                      e.stopPropagation();
                      handleOpenMessageDeleteModal(msg.id);
                    }}
                  />
                ))}
              </div>

              {loading && <p className="text-center mt-10">데이터를 불러오는 중...</p>}
              {error && !loading && <p className="text-center text-red-500 mt-10">데이터 불러오기 실패</p>}
            </div>
          </div>

          {screenMode !== "pc" && (
            <div className="fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)+16px]">
              <div className="mx-auto max-w-[1200px] px-[24px]">
                <button
                  onClick={handleOpenPageDeleteModal}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-[12px]"
                >
                  삭제하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메시지 상세 모달 */}
      {isOpen && selectedMessage && (
        <Modal
          isOpen={isOpen}
          onClose={handleCloseModal}
          {...selectedMessage}
        />
      )}

      {/* 페이지 삭제 모달 */}
      {isPageDeleteModalOpen && (
        <DeleteModal
          title="페이지 삭제 확인"
          message="페이지를 삭제하시겠습니까?"
          onConfirm={handleConfirmPageDelete}
          onCancel={handleClosePageDeleteModal}
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

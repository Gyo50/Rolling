import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Component/Header/Header.jsx";
import MobileHeader from "../Component/Header/MobileHeader.jsx"; // MobileHeader 임포트
import MessageHeader from "../Component/Header/MessageHeader.jsx";
import DeleteButton from "../Component/Button/Delete-button.jsx";
import Modal from "../Component/Modal/Modal.jsx";
import Card from "../Component/Card/Card.jsx"; // Card 컴포넌트 임포트
import DeleteModal from "../Component/Modal/DeleteModal.jsx"; // 추상화된 DeleteModal 임포트 (가정)
// API 함수들 임포트
import {
  fetchRecipient,
  fetchRecipientMessages,
  fetchRecipientReactions,
  deleteRecipient,
  reactToRecipient,
  normalizeReactionsResponse,
  EMOJI_TO_ALIAS
} from "../api/recipients";

// 🚨 정적인 메시지 데이터 (API 로드 실패 시 대체용으로 유지)
const STATIC_MESSAGES = Array.from({ length: 3 }).map((_, index) => ({
  id: index + 1,
  senderName: `보낸 이 #${index + 1}`,
  content: `API 로드 실패 시의 샘플 메시지 ${index + 1}입니다.`,
  profileImageURL: `https://placehold.co/40x40?text=${index + 1}`,
  date: '',
  relationship: ["동료", "친구", "가족"][index % 3],
}));

// HEAD 버전의 ID 추출 헬퍼 함수
const getRecipientIdFromPath = (explicitId, paramsId) => {
  if (explicitId !== undefined && explicitId !== null) return explicitId;
  if (paramsId !== undefined && paramsId !== null) return paramsId;
  if (typeof window === 'undefined') return null;
  const match = window.location.pathname.match(/\/post\/(\d+)/);
  return match ? match[1] : null;
};

function OwnerPage({ recipientId }) {
  const navigate = useNavigate();
  const { id: paramsId } = useParams();

  // === 상태 관리 (API/데이터) ===
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // === 상태 관리 (UI/모달) ===
  const [isOpen, setIsOpen] = useState(false); // 메시지 상세 모달
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isPageDeleteModalOpen, setIsPageDeleteModalOpen] = useState(false);
  const [isMessageDeleteModalOpen, setIsMessageDeleteModalOpen] = useState(false);
  const [messageToDeleteId, setMessageToDeleteId] = useState(null);
  const [screenMode, setScreenMode] = useState("pc"); // 'pc' | 'tablet' | 'mobile'

  // ==========================
  // 1. 반응형 화면 크기 감지 (RollingPage 강점)
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
  // 2. ID 추출 및 데이터 로딩 (HEAD 강점)
  // ==========================
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
        fetchRecipientReactions(currentRecipientId)
      ]);

      setRecipient(recipientData || null);

      const normalizedMessages = (messageData?.results || messageData || []).map(
        (item, index) => ({
          id: item.id ?? index,
          senderName: item.sender || '익명',
          content: item.content || '',
          profileImageURL:
            item.profileImageURL || `https://placehold.co/40x40?text=${(item.sender || 'U').slice(0, 1)}`,
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : '',
          relationship: item.relationship || '지인'
        })
      );

      setMessages(normalizedMessages);

      const normalizedReactions = normalizeReactionsResponse(reactionData);
      setReactions(normalizedReactions);
    } catch (err) {
      console.error('데이터 불러오기 실패:', err);
      const errorMessage = err?.message || '데이터를 불러올 수 없습니다.';
      setError(new Error(errorMessage));
      setRecipient(null);
      setMessages(STATIC_MESSAGES); // 실패 시 샘플 데이터 사용
      setReactions([]);
    } finally {
      setLoading(false);
    }
  }, [currentRecipientId]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  // ==========================
  // 3. API 기반 액션 함수 (HEAD 강점)
  // ==========================

  // 3.1. 페이지 삭제
  const handleConfirmPageDelete = async () => {
    if (!currentRecipientId || deleting) return;

    try {
      setDeleting(true);
      setDeleteError(null);
      await deleteRecipient(currentRecipientId);
      navigate('/list', { replace: true }); // 삭제 성공 시 /list로 이동
    } catch (err) {
      console.error('페이지 삭제 실패:', err);
      const errorMessage = err?.message || '페이지 삭제에 실패했습니다.';
      setDeleteError(new Error(errorMessage));
      alert(`페이지 삭제에 실패했습니다.\n\n${errorMessage}`);
    } finally {
      setDeleting(false);
      setIsPageDeleteModalOpen(false);
    }
  };

  // 3.2. 이모지 반응 추가 위임
  const handleAddReaction = async (emoji) => {
    if (!currentRecipientId) return;
    try {
      // NOTE: MessageHeader에서 5회 제한을 로컬에서 걸어준 후, 통과하면 이 함수를 호출함
      const alias = EMOJI_TO_ALIAS[emoji] || emoji; // API에서 사용하는 alias로 변환 (HEAD 로직 유지)

      await reactToRecipient(currentRecipientId, { emoji: alias, type: 'increase' });
      
      // 반응 목록 다시 로드하여 MessageHeader에 전달된 prop 업데이트
      const updated = await fetchRecipientReactions(currentRecipientId);
      setReactions(normalizeReactionsResponse(updated));
    } catch (err) {
      console.error('반응 추가 실패:', err);
      alert(`반응 추가에 실패했습니다. (API 오류)`);
    }
  };
  
  // 3.3. 개별 메시지 삭제 (API 연동 필요)
  const handleConfirmMessageDelete = () => {
    // TODO: 메시지 삭제 API 호출 로직 구현
    console.log(`메시지 ID ${messageToDeleteId} 삭제 요청 (API 구현 필요)`);
    // 삭제 성공 시 messages 상태 업데이트 후 모달 닫기
    setMessages(prev => prev.filter(msg => msg.id !== messageToDeleteId));
    handleCloseMessageDeleteModal();
  };


  // ==========================
  // 4. 모달 관련 함수 (RollingPage 모달 구조 사용)
  // ==========================

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

  // ==========================
  // 5. 파생 데이터 계산
  // ==========================
  const topAvatars = useMemo(() => {
    const unique = [];
    const seen = new Set();
    messages.forEach((msg) => {
      const key = msg.senderName || msg.profileImageURL;
      if (key && !seen.has(key)) {
        seen.add(key);
        unique.push({
          src: msg.profileImageURL || 'https://placehold.co/28x28',
          alt: msg.senderName || '작성자'
        });
      }
    });
    return unique.slice(0, 3); // 상위 3개만
  }, [messages]);

  const totalMessageCount = recipient?.messageCount ?? messages.length ?? 0;
  const hasMessages = Array.isArray(messages) && messages.length > 0;
  const isUsingFallbackMessages = messages === STATIC_MESSAGES;


  // ==========================
  // 6. 렌더링
  // ==========================
  return (
    <>
      <div className="owner-page-scrollbar-hide">
        <div className="flex flex-col min-h-screen bg-beige-200">
          
          {/* 6.1. 헤더 (반응형 적용) */}
          <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-30">
            {screenMode === "mobile" ? (
              <MobileHeader hideCreateButton />
            ) : (
              <Header />
            )}
            
            <div className="mx-auto">
              <MessageHeader
                recipient={recipient}
                messageCount={totalMessageCount}
                topAvatars={topAvatars}
                reactions={reactions}
                onAddReaction={handleAddReaction} // 이모지 추가 API 위임
                hideAvatars={screenMode === "tablet"} // 태블릿에서 아바타 숨김
              />
            </div>
          </div>

          {/* 6.2. 카드 영역 */}
          <div className="flex-1 w-full pt-[102px] sm:pt-[147px] lg:pt-[171px] pb-10 relative">
            <div className="mx-auto max-w-[1200px] px-[24px] relative">
              
              {/* PC 상단 삭제 버튼 */}
              {screenMode === "pc" && (
                <div className="mx-auto max-w-[1200px] w-full flex justify-end mb-[16px]">
                  <button onClick={handleOpenPageDeleteModal} disabled={deleting}>
                    <DeleteButton text={deleting ? "삭제 중..." : "삭제하기"} />
                  </button>
                </div>
              )}
              
              {/* 로딩 및 에러 메시지 */}
              {loading && (
                <p className="text-center text-gray-600 mt-10">데이터를 불러오는 중입니다...</p>
              )}
              {error && !loading && (
                <div className="text-center text-red-500 mt-10">
                  <p>데이터를 불러오지 못했습니다. 샘플 데이터를 표시합니다.</p>
                  {error.message && <p className="text-xs mt-1">{error.message}</p>}
                </div>
              )}
              {deleteError && (
                <div className="text-center text-red-500 mt-6">
                  <p>페이지 삭제에 실패했습니다.</p>
                  {deleteError.message && <p className="text-xs mt-1">{deleteError.message}</p>}
                </div>
              )}

              {/* 카드 목록 (Card 컴포넌트 사용) */}
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
                        handleOpenMessageDeleteModal(item.id); // 메시지 삭제 모달 열기
                      }}
                    />
                  ))}
                </div>
              ) : (
                !loading && (
                  <div className="mt-20 text-center text-gray-500">
                    {isUsingFallbackMessages
                      ? '샘플 데이터를 표시 중입니다. 수신인을 생성하고 메시지를 작성해 보세요.'
                      : '아직 작성된 메시지가 없습니다.'}
                  </div>
                )
              )}
            </div>
          </div>

          {/* 6.3. 모바일/태블릿 하단 삭제 버튼 */}
          {screenMode !== "pc" && (
            <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pt-0">
              <div className="mx-auto max-w-[1200px] px-0">
                <button
                  onClick={handleOpenPageDeleteModal}
                  disabled={deleting}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-[12px] text-18-bold shadow-lg transition-all disabled:bg-gray-400"
                >
                  {deleting ? "삭제 중..." : "삭제하기"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6.4. 메시지 상세 모달 */}
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

      {/* 6.5. 페이지 삭제 모달 (DeleteModal 추상화 사용) */}
      {isPageDeleteModalOpen && (
        <DeleteModal
          title="페이지 삭제 확인"
          message="페이지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          onConfirm={handleConfirmPageDelete}
          onCancel={handleClosePageDeleteModal}
          isLoading={deleting}
        />
      )}

      {/* 6.6. 메시지 삭제 모달 (DeleteModal 추상화 사용) */}
      {isMessageDeleteModalOpen && (
        <DeleteModal
          title="메시지 삭제 확인"
          message="이 메시지를 삭제하시겠습니까?"
          onConfirm={handleConfirmMessageDelete}
          onCancel={handleCloseMessageDeleteModal}
          // 개별 메시지 삭제는 보통 로딩 상태를 표시하지 않음
        />
      )}
    </>
  );
}

export default OwnerPage;
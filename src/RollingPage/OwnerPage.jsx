import React, { useEffect, useMemo, useState } from "react"; // API 데이터 상태 관리를 위해 useEffect/useState/useMemo 추가
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Component/Header/Header";
import MessageHeader from "../Component/Header/MessageHeader";
import DeleteButton from "../Component/Button/Delete-button";
import Modal from "../Component/Modal/Modal";
import {
  fetchRecipient,
  fetchRecipientMessages,
  fetchRecipientReactions,
  deleteRecipient,
  reactToRecipient,
  normalizeReactionsResponse
} from "../api/recipients"; // 대상/메시지 조회 API 함수 불러오기

// 🚨 정적인 메시지 데이터 (ID 추적 및 기타 정보 추가)
const STATIC_MESSAGES = Array.from({ length: 3 }).map((_, index) => ({
  id: index + 1,
  senderName: `보낸 이 #${index + 1}`,
  content: `현재 메시지를 불러올 수 없습니다. 샘플 메시지 ${index + 1}입니다.`,
  profileImageURL: `https://placehold.co/40x40?text=${index + 1}`,
  date: '',
  relationship: ["동료", "친구", "가족"][index % 3],
}));

const getRecipientIdFromPath = (explicitId, paramsId) => { // 라우터 파라미터 또는 props에서 ID 추출
  if (explicitId !== undefined && explicitId !== null) return explicitId
  if (paramsId !== undefined && paramsId !== null) return paramsId
  if (typeof window === 'undefined') return null
  const match = window.location.pathname.match(/\/post\/(\d+)/)
  return match ? match[1] : null
}

function OwnerPage({ recipientId }) {
  const navigate = useNavigate();
  const { id: paramsId } = useParams(); // React Router의 useParams로 URL 파라미터 가져오기
  // === 메시지/대상 데이터 ===
  const [recipient, setRecipient] = useState(null) // 대상 상세 정보 상태
  const [messages, setMessages] = useState([]) // 메시지 목록 상태
  const [loading, setLoading] = useState(false) // 로딩 여부 표시
  const [error, setError] = useState(null) // 에러 정보를 저장
  const [reactions, setReactions] = useState([])
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [favorites, setFavorites] = useState(new Set()) // 즐겨찾기 상태 관리

  const currentRecipientId = useMemo(
    () => getRecipientIdFromPath(recipientId, paramsId), // 우선순위: props → useParams → URL 에서 ID 추출
    [recipientId, paramsId]
  )

  // 즐겨찾기 로컬 스토리지 키 생성
  const getFavoritesKey = (recipientId) => `favorites_${recipientId}`

  // 즐겨찾기 상태 로드
  useEffect(() => {
    if (!currentRecipientId) return
    try {
      const stored = localStorage.getItem(getFavoritesKey(currentRecipientId))
      if (stored) {
        const favoriteIds = JSON.parse(stored)
        setFavorites(new Set(favoriteIds))
      }
    } catch (err) {
      console.error('즐겨찾기 로드 실패:', err)
    }
  }, [currentRecipientId])

  // 즐겨찾기 토글 함수
  const toggleFavorite = (messageId) => {
    if (!currentRecipientId) return
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(messageId)) {
        newFavorites.delete(messageId)
      } else {
        newFavorites.add(messageId)
      }
      // 로컬 스토리지에 저장
      try {
        localStorage.setItem(
          getFavoritesKey(currentRecipientId),
          JSON.stringify(Array.from(newFavorites))
        )
      } catch (err) {
        console.error('즐겨찾기 저장 실패:', err)
      }
      return newFavorites
    })
  }

  useEffect(() => {
    let active = true // 비동기 처리 중 컴포넌트가 언마운트될 경우를 대비한 플래그

    const loadData = async () => {
      if (!currentRecipientId) { // ID가 없으면 기본 목업 데이터만 보여줌
        setRecipient(null)
        setMessages(STATIC_MESSAGES)
        return
      }

      try {
        setLoading(true) // API 호출 시작 표시
        setError(null) // 이전 에러 초기화

        const [recipientData, messageData, reactionData] = await Promise.all([
          fetchRecipient(currentRecipientId), // 대상 상세 정보 요청
          fetchRecipientMessages(currentRecipientId, { limit: 20 }), // 메시지 목록 요청
          fetchRecipientReactions(currentRecipientId) // 현재 수신인의 반응 카운트 요청
        ])

        if (!active) return // 컴포넌트가 언마운트되면 상태 업데이트 중단

        setRecipient(recipientData || null) // 대상 정보 저장 (없으면 null)

        const normalizedMessages = (messageData?.results || messageData || []).map(
          (item, index) => ({
            id: item.id ?? index, // ID가 없으면 index로 대체
            senderName: item.sender || '익명', // 보낸 사람 기본값 처리
            content: item.content || '', // 내용 기본값 처리
            profileImageURL:
              item.profileImageURL || `https://placehold.co/40x40?text=${(item.sender || 'U').slice(0, 1)}`, // 프로필 이미지 없을 때 대체 이미지
            date: item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : '', // 날짜 포맷 변환
            relationship: item.relationship || '지인' // 관계 기본값 처리
          })
        )

        setMessages(normalizedMessages)

        const normalizedReactions = normalizeReactionsResponse(reactionData)
        setReactions(normalizedReactions)
      } catch (err) {
        if (!active) return // 언마운트 시 상태 업데이트 중단
        console.error('데이터 불러오기 실패:', err)
        const errorMessage = err?.response?.data
          ? Object.entries(err.response.data)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('\n')
          : err?.message || '데이터를 불러올 수 없습니다.'
        setError(new Error(errorMessage)) // 에러 저장
        setRecipient(null) // 대상 정보 초기화
        setMessages(STATIC_MESSAGES) // 샘플 데이터로 대체
        setReactions([])
      } finally {
        if (active) setLoading(false) // 로딩 종료
      }
    }

    loadData() // 비동기 호출 실행

    return () => {
      active = false // 언마운트 시 플래그 변경
    }
  }, [currentRecipientId])

  // === 메시지 상세보기 모달 상태 ===
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // === 페이지 삭제 확인 모달 상태 (전체 페이지 삭제) ===
  const [isPageDeleteModalOpen, setIsPageDeleteModalOpen] = useState(false);

  // === 메시지 삭제 확인 모달 상태 추가 (개별 메시지 삭제) ===
  const [isMessageDeleteModalOpen, setIsMessageDeleteModalOpen] =
    useState(false);

  // 카드 클릭 시 모달 열기 핸들러
  const handleCardClick = (message) => {
    setSelectedMessage(message);
    setIsOpen(true);
  };

  // 메시지 상세 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedMessage(null);
  };

  // --- 전체 페이지 삭제 로직 ---
  const handleOpenPageDeleteModal = () => {
    setIsPageDeleteModalOpen(true);
  };

  const handleClosePageDeleteModal = () => {
    setIsPageDeleteModalOpen(false);
  };

  const handleConfirmPageDelete = () => {
    if (!currentRecipientId || deleting) return

    const confirmDeletion = async () => {
      try {
        setDeleting(true)
        setDeleteError(null)
        await deleteRecipient(currentRecipientId)
        navigate('/list', { replace: true })
      } catch (err) {
        console.error('페이지 삭제 실패:', err)
        const errorMessage = err?.response?.data
          ? Object.entries(err.response.data)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('\n')
          : err?.message || '페이지 삭제에 실패했습니다.'
        setDeleteError(new Error(errorMessage))
        alert(`페이지 삭제에 실패했습니다.\n\n${errorMessage}`)
      } finally {
        setDeleting(false)
        setIsPageDeleteModalOpen(false)
      }
    }

    confirmDeletion()
  };

  // --- 개별 메시지 삭제 로직 ---
  const handleOpenMessageDeleteModal = () => {
    setIsMessageDeleteModalOpen(true);
  };

  const handleCloseMessageDeleteModal = () => {
    setIsMessageDeleteModalOpen(false);
  };

  const handleConfirmMessageDelete = () => {
    // 실제 삭제 로직 (예: 필터링)
    // TODO: 메시지 삭제 API 호출 구현 필요
    handleCloseMessageDeleteModal();
  };

  // 페이지 삭제 확인 모달
  const PageDeleteConfirmModal = ({ isLoading = false }) => (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4">
      <h3 className="text-xl font-bold mb-4 text-center">페이지 삭제 확인</h3>
      <p className="text-gray-700 mb-6 text-center">페이지를 삭제하시겠습니까?</p>
      <div className="flex justify-center space-x-3">
        <button
          onClick={handleConfirmPageDelete}
          disabled={isLoading}
          className="py-2 px-4 bg-purple-600 text-white text-18-regular rounded-lg hover:bg-purple-700 transition flex-1 disabled:bg-gray-400"
        >
          {isLoading ? '삭제 중...' : '예'}
        </button>
        <button
          onClick={handleClosePageDeleteModal}
          disabled={isLoading}
          className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition flex-1 disabled:text-gray-400 disabled:border-gray-200"
        >
          아니요
        </button>
      </div>
    </div>
  );

  // 메시지 삭제 확인 모달
  const MessageDeleteConfirmModal = () => (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4">
      <h3 className="text-xl font-bold mb-4 text-center">메시지 삭제 확인</h3>
      <p className="text-gray-700 mb-6 text-center">
        메시지를 삭제하시겠습니까?
      </p>
      <div className="flex justify-center space-x-3">
        <button
          onClick={handleConfirmMessageDelete}
          className="py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition flex-1"
        >
          예
        </button>
        <button
          onClick={handleCloseMessageDeleteModal}
          className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition flex-1"
        >
          아니요
        </button>
      </div>
    </div>
  );

  const topAvatars = useMemo(() => {
    const unique = []
    const seen = new Set()
    messages.forEach((msg) => {
      const key = msg.senderName || msg.profileImageURL
      if (key && !seen.has(key)) {
        seen.add(key)
        unique.push({
          src: msg.profileImageURL || 'https://placehold.co/28x28',
          alt: msg.senderName || '작성자'
        })
      }
    })
    return unique
  }, [messages])

  const totalMessageCount = recipient?.messageCount ?? messages.length ?? 0
  const isUsingFallbackMessages = messages === STATIC_MESSAGES
  const hasMessages = Array.isArray(messages) && messages.length > 0

  // 즐겨찾기된 메시지를 먼저 보이도록 정렬
  const sortedMessages = useMemo(() => {
    if (!hasMessages) return []
    return [...messages].sort((a, b) => {
      const aIsFavorite = favorites.has(a.id)
      const bIsFavorite = favorites.has(b.id)
      if (aIsFavorite && !bIsFavorite) return -1
      if (!aIsFavorite && bIsFavorite) return 1
      return 0 // 같은 그룹 내에서는 원래 순서 유지
    })
  }, [messages, favorites, hasMessages])

  const handleAddReaction = async (emoji) => {
    if (!currentRecipientId) return
    try {
      // API가 모든 이모지를 직접 지원하므로 이모지를 그대로 전송
      await reactToRecipient(currentRecipientId, { emoji: emoji, type: 'increase' })
      const updated = await fetchRecipientReactions(currentRecipientId)
      setReactions(normalizeReactionsResponse(updated))
    } catch (err) {
      console.error('반응 추가 실패:', err)
      const errorMessage = err?.response?.data
        ? Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n')
        : err?.message || '반응 추가에 실패했습니다.'
      alert(`반응 추가에 실패했습니다.\n\n${errorMessage}`)
    }
  }

  return (
    <>
      <div className="overflow-y-scroll owner-page-scrollbar-hide">
        <div className="flex flex-col min-h-screen bg-beige-200">
          {/* 상단 헤더 영역 (고정) */}
          <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-30">
            <div className="mx-auto">
              <Header />
              <div className="flex justify-between items-center">
                <MessageHeader
                  recipient={recipient}
                  messageCount={totalMessageCount}
                  topAvatars={topAvatars}
                  reactions={reactions}
                  onAddReaction={handleAddReaction}
                />
              </div>
            </div>
          </div>

          {/* 메시지 카드 영역 */}
          <div className="flex-1 w-full pt-[180px] pb-10 relative">
            <div className="mx-auto px-6 relative max-w-7xl">
              {/* 삭제 버튼 - 페이지 삭제 모달 연결 */}
              <div
                className="absolute top-[-55px] right-8 z-10"
                onClick={handleOpenPageDeleteModal}
              >
                <DeleteButton text="삭제하기" />
              </div>

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

              {/* 카드 목록 */}
              {hasMessages ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] mt-[28px] relative z-10">
                  {sortedMessages.map((item) => {
                    const isFavorite = favorites.has(item.id)
                    return (
                  <div
                    key={item.id}
                    onClick={() => handleCardClick(item)}
                    className="bg-white rounded-xl shadow-md p-6 text-gray-600 flex flex-col justify-between cursor-pointer hover:shadow-lg transition h-[280px]"
                  >
                    {/* 🗑️ 상단: 프로필, 이름, 태그, 즐겨찾기, 휴지통 */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        {/* 프로필 이미지 */}
                        <img
                          src={item.profileImageURL}
                          alt={item.senderName}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://placehold.co/40x40?text=?'
                            }}
                        />
                        {/* From. 이름 및 태그 */}
                        <div>
                          <div className="font-bold text-gray-900 text-lg">
                            From. {item.senderName}
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            {item.relationship}
                          </span>
                        </div>
                      </div>

                      {/* 즐겨찾기 및 삭제 버튼 */}
                      <div className="flex items-center gap-2">
                        {/* 즐겨찾기 버튼 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          className={`p-2 transition ${
                            isFavorite
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                        >
                          {isFavorite ? '⭐' : '☆'}
                        </button>
                        {/* 개별 메시지 삭제 휴지통 아이콘 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenMessageDeleteModal();
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 transition"
                          aria-label="메시지 삭제"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* 메시지 내용 */}
                    <p className="text-gray-800 line-clamp-4 flex-1">
                        {item.content || '내용이 없습니다.'}
                    </p>

                    {/* 하단: 날짜 */}
                    <div className="mt-4 text-xs text-gray-500">
                        {item.date || '날짜 정보 없음'}
                    </div>
                  </div>
                    )
                  })}
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
        </div>
      </div>

      {/* 메시지 상세 모달 렌더링 */}
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

      {/* 페이지 삭제 확인 모달 렌더링 */}
      {isPageDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center"
          onClick={handleClosePageDeleteModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <PageDeleteConfirmModal isLoading={deleting} />
          </div>
        </div>
      )}

      {/* 🌟 ✅ 메시지 삭제 확인 모달 렌더링 */}
      {isMessageDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center"
          onClick={handleCloseMessageDeleteModal} // 오버레이 클릭 시 닫기
        >
          <div onClick={(e) => e.stopPropagation()}>
            <MessageDeleteConfirmModal />
          </div>
        </div>
      )}
    </>
  );
}

export default OwnerPage;

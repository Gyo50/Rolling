import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Component/Header/Header'
import CardList from '../Component/CardList/CardList'
import PrimaryMain from '../Component/Button/Primary-main'
import styles from './ListPage.module.css'
import { fetchRecipients, fetchRecipientReactions, normalizeReactionsResponse } from '../api/recipients'

// 최근 3시간 내 생성된 롤링페이퍼인지 확인하는 함수
function isWithin3Hours(createdAt) {
  if (!createdAt) return false
  const createdTime = new Date(createdAt).getTime()
  const now = Date.now()
  const threeHoursInMs = 3 * 60 * 60 * 1000
  return (now - createdTime) < threeHoursInMs
}

function NavigableCard({ card, isRecent }) {
  const navigate = useNavigate()

  const handleNavigate = useCallback(() => {
    const cardId = card?.id
    if (cardId === undefined || cardId === null) return
    navigate(`/post/${cardId}`)
  }, [card, navigate])

  return (
    <div
      onClick={handleNavigate}
      className="cursor-pointer"
    >
      <CardList recipient={card} isRecent={isRecent} />
    </div>
  )
}

const ITEMS_PER_PAGE = 16

function RecentPage() {
  const navigate = useNavigate()
  const [recentCards, setRecentCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let active = true

    const loadRecipients = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // pagination을 모두 따라가며 수신인 전체 목록을 불러온다
        const limit = 50
        let offset = 0
        let aggregated = []
        let hasNext = true

        while (hasNext) {
          const data = await fetchRecipients({ limit, offset })
          
          if (!active) {
            return
          }

          const results = Array.isArray(data?.results) ? data.results : []
          aggregated = aggregated.concat(results)
          
          if (data?.next) {
            offset += limit
          } else {
            hasNext = false
          }
        }

        // 각 수신인에 대한 반응 카운트를 따로 요청하여 카드에 전달하고 총합 계산
        const enriched = await Promise.all(
          aggregated.map(async (item) => {
            if (!item?.id) {
              return { ...item, reactions: [], totalReactions: 0 }
            }
            
            try {
              const reactionData = await fetchRecipientReactions(item.id)
              const normalized = normalizeReactionsResponse(reactionData)
              const totalReactions = normalized.reduce((acc, reaction) => acc + (reaction.count || 0), 0)
              
              return { ...item, reactions: normalized, totalReactions }
            } catch (err) {
              console.error('반응 데이터를 불러오지 못했습니다:', err)
              return { ...item, reactions: [], totalReactions: 0 }
            }
          })
        )

        // 최근 순 정렬: 생성일이 최신인 순서대로
        const sortedByRecent = [...enriched].sort((a, b) => {
          const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        })

        if (!active) {
          return
        }

        setRecentCards(sortedByRecent)
      } catch (err) {
        if (!active) {
          return
        }
        
        console.error('수신인 목록 불러오기 실패:', err)
        
        const errorMessage = err?.response?.data
          ? Object.entries(err.response.data)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('\n')
          : err?.message || '알 수 없는 오류가 발생했습니다.'
        setError(new Error(errorMessage))
        setRecentCards([])
      } finally {
        if (active) setLoading(false)
      }
    }

    loadRecipients()

    return () => {
      active = false
    }
  }, [])

  // 검색어로 필터링하는 함수
  const filterCards = useCallback((cards, query) => {
    if (!query || query.trim() === '') return cards
    const lowerQuery = query.toLowerCase().trim()
    return cards.filter((card) => {
      const name = card?.name || ''
      return name.toLowerCase().includes(lowerQuery)
    })
  }, [])

  // 필터링된 카드 목록
  const filteredRecentCards = useMemo(
    () => filterCards(recentCards, searchQuery),
    [recentCards, searchQuery, filterCards]
  )

  // 페이지네이션 계산
  const totalPages = useMemo(() => {
    const pages = Math.ceil(filteredRecentCards.length / ITEMS_PER_PAGE)
    return pages > 0 ? pages : 1
  }, [filteredRecentCards.length])

  // 검색어가 변경되면 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // totalPages가 변경되면 현재 페이지가 범위를 벗어나지 않도록 조정
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPageCards = filteredRecentCards.slice(startIndex, endIndex)

  // 페이지 번호 배열 생성 (최대 5개씩 표시)
  const getPageNumbers = useMemo(() => {
    if (totalPages <= 0) return []
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }, [totalPages, currentPage])

  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-center shadow-[0_1px_0_rgba(237,237,237,1)] bg-white">
        <div className={`w-full max-w-[1199px] ${styles.headerShell}`}>
          <Header />
        </div>
      </header>

      <main className={`flex flex-col items-center gap-[50px] pt-[30px] pb-6 min-[769px]:pb-[172px] overflow-hidden min-[769px]:overflow-visible ${styles.mainLayout}`}>
        {/* 검색창 */}
        <div className={`w-full max-w-[1160px] ${styles.searchContainer}`}>
          <div className="relative">
            <input
              type="text"
              placeholder="롤링페이퍼 이름으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg text-16-regular focus:outline-none focus:ring-2 focus:ring-[#9935FF] focus:border-transparent ${styles.searchInput}`}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="검색어 지우기"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <section className={`w-full max-w-[1160px] flex flex-col gap-4 ${styles.section}`}>
          <div className={`flex items-center justify-between ${styles.sectionHeader}`}>
            <h2 
              onClick={() => navigate('/list')}
              className={`text-24-bold text-gray-900 ${styles.sectionTitle} cursor-pointer hover:text-purple-600 transition-colors`}
            >
              모든 롤링페이지
              {!loading && !error && (
                <span className="text-16-regular text-gray-500 ml-2">
                  ({searchQuery ? filteredRecentCards.length : recentCards.length}개
                  {searchQuery && filteredRecentCards.length !== recentCards.length && ` / 전체 ${recentCards.length}개`})
                </span>
              )}
            </h2>
          </div>
          {loading ? (
            <p className="text-14-regular text-gray-500">데이터를 불러오는 중입니다...</p>
          ) : error ? (
            <div className="text-14-regular text-red-500">
              <p>데이터를 불러오지 못했습니다.</p>
              {error.message && <p className="text-xs mt-1">{error.message}</p>}
            </div>
          ) : filteredRecentCards.length === 0 && searchQuery ? (
            <div className="text-14-regular text-gray-500 py-8 text-center">
              &quot;{searchQuery}&quot;에 대한 검색 결과가 없습니다.
            </div>
          ) : filteredRecentCards.length === 0 ? (
            <div className="text-14-regular text-gray-500 py-8 text-center">
              아직 작성된 롤링페이퍼가 없습니다.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4 w-full">
                {currentPageCards.map((card) => {
                  const isRecent = isWithin3Hours(card?.createdAt)
                  return (
                    <div key={card.id} className="flex justify-center items-start">
                      <NavigableCard card={card} isRecent={isRecent} />
                    </div>
                  )
                })}
              </div>
              
              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8 mb-4">
                  {/* 이전 페이지 버튼 */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg text-16-regular transition-colors ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    이전
                  </button>
                  
                  {/* 첫 페이지 */}
                  {getPageNumbers.length > 0 && getPageNumbers[0] > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="px-3 py-2 rounded-lg text-16-regular text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        1
                      </button>
                      {getPageNumbers[0] > 2 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                    </>
                  )}
                  
                  {/* 페이지 번호 버튼 */}
                  {getPageNumbers.map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 rounded-lg text-16-regular transition-colors ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white font-bold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  {/* 마지막 페이지 */}
                  {getPageNumbers.length > 0 && getPageNumbers[getPageNumbers.length - 1] < totalPages && (
                    <>
                      {getPageNumbers[getPageNumbers.length - 1] < totalPages - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-2 rounded-lg text-16-regular text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  
                  {/* 다음 페이지 버튼 */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg text-16-regular transition-colors ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <div className={`w-full max-w-[1201px] flex flex-col items-center mt-[-8px] ${styles.bottomShell}`}>
          <div
            className={`relative flex justify-center [&>button]:w-[280px] [&>button]:h-[56px] [&>button]:bg-[#9935FF] [&>button]:rounded-[12px] [&>button]:px-6 [&>button]:py-[14px] [&>button]:gap-[10px] [&>button]:font-[700] [&>button]:text-[18px] [&>button]:leading-[28px] [&>button]:tracking-[-0.01em] [&>button]:shadow-[0_4px_10px_rgba(153,53,255,0.2)] ${styles.bottomButtonWrap}`}
          >
            <PrimaryMain text="나도 만들어보기" to="/post" />
          </div>
        </div>
      </main>
    </div>
  )
}

export default RecentPage

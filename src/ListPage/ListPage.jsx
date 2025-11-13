import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Component/Header/Header'
import CardList from '../Component/CardList/CardList' // 가정된 컴포넌트 경로
import PrimaryMain from '../Component/Button/Primary-main' // 가정된 컴포넌트 경로
import LeftArrow from '../Component/Button/Left-arrow' // 가정된 컴포넌트 경로
import RightArrow from '../Component/Button/Right-arrow' // 가정된 컴포넌트 경로
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import styles from './ListPage.module.css' // 가정된 CSS 모듈 경로
import { fetchRecipients, fetchRecipientReactions, normalizeReactionsResponse } from '../api/recipients' // API 함수 임포트

const CARDS_PER_VIEW = 4
const CARDS_PER_GROUP = 2
const CARD_GAP = 20

// 최근 3시간 내 생성된 롤링페이퍼인지 확인하는 함수
function isWithin3Hours(createdAt) {
  if (!createdAt) return false
  const createdTime = new Date(createdAt).getTime()
  const now = Date.now()
  const threeHoursInMs = 3 * 60 * 60 * 1000
  return (now - createdTime) < threeHoursInMs
}

function NavigableCard({ card, rank, isRecent }) {
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
      <CardList recipient={card} rank={rank} isRecent={isRecent} />
    </div>
  )
}

function PlaceholderCard({ index }) {
  return (
    <div
      key={`placeholder-${index}`}
      aria-hidden="true"
      className={styles.placeholderCard}
    />
  )
}

function RollingSwiper({ cards, sliderKey, viewportWidth }) {
  const swiperRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const safeCards = useMemo(() => (Array.isArray(cards) ? cards : []), [cards])

  const isMobile = viewportWidth <= 360
  const isTablet = viewportWidth > 360 && viewportWidth <= 1024
  const isDesktop = viewportWidth > 1024
  // 화면 크기에 따라 보이는 카드 수
  const visibleCount = isDesktop ? CARDS_PER_VIEW : isTablet ? 3 : 1
  const totalSlides = safeCards.length
  // maxStartIndexForLastCard: 마지막 카드가 완전히 보이도록 하는 최대 시작 인덱스
  const maxStartIndexForLastCard = Math.max(totalSlides - visibleCount, 0)
  // maxStartIndexWithEmpty: 빈칸까지 보이는 위치 (데스크탑에서만 사용)
  const maxStartIndexWithEmpty = Math.max(totalSlides - visibleCount + 1, 0)
  const showNavigation = isDesktop && totalSlides > CARDS_PER_VIEW
  const cardGap = isMobile ? 12 : CARD_GAP

  const displayCards = useMemo(() => {
    if (!showNavigation) return safeCards
    if (totalSlides >= CARDS_PER_VIEW) return safeCards
    const placeholders = Array.from({ length: CARDS_PER_VIEW - totalSlides }, (_, index) => ({
      id: `placeholder-${sliderKey}-${index}`,
      placeholder: true
    }))
    return [...safeCards, ...placeholders]
  }, [safeCards, showNavigation, sliderKey, totalSlides])

  useEffect(() => {
    setActiveIndex(0)
    if (swiperRef.current) {
      swiperRef.current.slideTo(0, 0)
      swiperRef.current.update()
    }
  }, [displayCards])

  const handleSlideChange = useCallback((swiper) => {
    // requestAnimationFrame을 사용하여 성능 최적화
    requestAnimationFrame(() => {
      // Swiper의 실제 activeIndex를 사용하되, 최대 인덱스를 초과하지 않도록 제한
      const currentIndex = swiper.activeIndex
      // 데스크탑: 빈칸까지 이동 가능, 모바일/태블릿: 마지막 카드까지만 이동 가능
      const maxAllowed = isDesktop ? maxStartIndexWithEmpty : maxStartIndexForLastCard
      const clamped = Math.min(currentIndex, maxAllowed)
      
      // 터치 스크롤로 인한 이동인 경우, 최대 인덱스를 초과하면 제한
      if (clamped !== currentIndex && currentIndex > maxAllowed) {
        // 최대 인덱스를 초과했으면 최대 인덱스로 이동
        swiper.slideTo(maxAllowed, 300) // 300ms 애니메이션
        setActiveIndex(maxAllowed)
      } else {
        // activeIndex를 항상 Swiper의 실제 인덱스와 동기화
        setActiveIndex(clamped)
      }
    })
  }, [isDesktop, maxStartIndexForLastCard, maxStartIndexWithEmpty])

  const slideBy = useCallback(
    (delta) => {
      const swiper = swiperRef.current
      if (!swiper) return
      
      const currentIndex = activeIndex
      let step = isDesktop ? CARDS_PER_GROUP : viewportWidth > 768 ? 3 : 1
      
      // 오른쪽으로 이동할 때 마지막 처리
      if (delta > 0 && totalSlides > visibleCount) {
        if (isDesktop) {
          if (currentIndex < maxStartIndexForLastCard) {
            const remainingToLastCard = maxStartIndexForLastCard - currentIndex
            if (remainingToLastCard < step) {
              step = remainingToLastCard
            }
          } else if (currentIndex < maxStartIndexWithEmpty) {
            const remainingToEmpty = maxStartIndexWithEmpty - currentIndex
            if (remainingToEmpty < step) {
              step = remainingToEmpty
            }
          } else {
            return
          }
        } 
        else { // 모바일/태블릿
          if (currentIndex < maxStartIndexForLastCard) {
            const remainingToLastCard = maxStartIndexForLastCard - currentIndex
            if (remainingToLastCard < step) {
              step = remainingToLastCard
            }
          } else {
            return
          }
        }
      }
      
      // 목표 인덱스 계산
      const proposedTarget = currentIndex + delta * step
      let target = Math.max(proposedTarget, 0)
      
      if (isDesktop) {
        target = Math.min(target, maxStartIndexWithEmpty)
      } else {
        target = Math.min(target, maxStartIndexForLastCard)
      }
      
      if (target !== currentIndex) {
        const originalSlidesPerGroup = swiper.params.slidesPerGroup
        if (isDesktop && (target >= maxStartIndexForLastCard || currentIndex >= maxStartIndexForLastCard)) {
          swiper.params.slidesPerGroup = 1
        }
        swiper.slideTo(target, 300)
        if (isDesktop && (target >= maxStartIndexForLastCard || currentIndex >= maxStartIndexForLastCard)) {
          swiper.params.slidesPerGroup = originalSlidesPerGroup
        }
        setActiveIndex(target)
      }
    },
    [activeIndex, maxStartIndexForLastCard, maxStartIndexWithEmpty, isDesktop, totalSlides, visibleCount, viewportWidth]
  )

  const handleWheel = useCallback(
    (event) => {
      // 데스크탑에서만 휠 이벤트 처리 (모바일/태블릿에서는 터치 이벤트가 우선)
      if (!isDesktop) return
      const delta = event.deltaY > 0 ? 1 : -1
      slideBy(delta)
    },
    [isDesktop, slideBy]
  )

  return (
    <div className={`relative flex items-center ${styles.swiperShell}`} onWheel={handleWheel}>
      {showNavigation && activeIndex > 0 && (
        <div
          className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
          onClick={() => slideBy(-1)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              slideBy(-1)
            }
          }}
        >
          <LeftArrow />
        </div>
      )}

      <Swiper
        spaceBetween={cardGap}
        slidesPerView={isDesktop ? CARDS_PER_VIEW : viewportWidth > 768 ? 3 : 'auto'}
        slidesPerGroup={isDesktop ? CARDS_PER_GROUP : viewportWidth > 768 ? 3 : 1}
        allowTouchMove={!isDesktop}
        loop={false}
        touchEventsTarget="container"
        touchStartPreventDefault={false}
        touchRatio={1}
        touchAngle={45}
        threshold={5}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={handleSlideChange}
        className={`w-full ${styles.swiperInstance}`}
      >
        {displayCards.map((card, index) => {
          // 인기 탑 8의 경우 rank 전달 (1,2,3등만 배지 표시)
          const rank = sliderKey === 'popular' && !card.placeholder ? index + 1 : null
          // 최근 섹션의 경우 3시간 내 생성 여부 확인
          const isRecent = sliderKey === 'recent' && !card.placeholder ? isWithin3Hours(card?.createdAt) : false
          return (
            <SwiperSlide
              key={`${sliderKey}-${card.id ?? index}`}
              className={`flex justify-center ${styles.swiperSlide}`}
            >
              {card.placeholder ? (
                <PlaceholderCard index={index} />
              ) : (
                <NavigableCard card={card} rank={rank} isRecent={isRecent} />
              )}
            </SwiperSlide>
          )
        })}
      </Swiper>

      {showNavigation && (() => {
        const canMoveRight = isDesktop
          ? activeIndex < maxStartIndexWithEmpty
          : activeIndex < maxStartIndexForLastCard
        return canMoveRight
      })() && (
        <div
          className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
          onClick={() => slideBy(1)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              slideBy(1)
            }
          }}
        >
          <RightArrow />
        </div>
      )}
    </div>
  )
}

function ListPage() {
  const navigate = useNavigate()
  const [viewportWidth, setViewportWidth] = useState(() => {
    if (typeof window === 'undefined') return 1920
    const measured = window.innerWidth || document.documentElement.clientWidth || 1920
    return Math.round(measured)
  })
  const [popularCards, setPopularCards] = useState([])
  const [recentCards, setRecentCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    let timeoutId = null
    const handleResize = () => {
      if (timeoutId) return
      timeoutId = setTimeout(() => {
        const measured = window.innerWidth || document.documentElement.clientWidth || 1920
        setViewportWidth(Math.round(measured))
        timeoutId = null
      }, 150)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadRecipients = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // [1] 전체 수신인 목록 집계
        const limit = 50
        let offset = 0
        let aggregated = []
        let hasNext = true

        while (hasNext) {
          const data = await fetchRecipients({ limit, offset })
          
          if (!active) return

          const results = Array.isArray(data?.results) ? data.results : []
          aggregated = aggregated.concat(results)
          
          if (data?.next) {
            offset += limit
          } else {
            hasNext = false
          }
        }

        // ------------------------------------------------------------------
        // [2] ⭐ 배치 처리 (Batch Processing) 적용: API 안정성 개선 ⭐
        // ------------------------------------------------------------------
        const BATCH_SIZE = 10; // 한 번에 10개씩 요청
        let enriched = [];

        for (let i = 0; i < aggregated.length; i += BATCH_SIZE) {
            if (!active) return
            const batch = aggregated.slice(i, i + BATCH_SIZE);
            
            const batchResults = await Promise.all(
                batch.map(async (item) => {
                    if (!item?.id) return { ...item, reactions: [], totalReactions: 0 }
                    
                    try {
                        // 개별 수신인의 반응 데이터를 가져옴
                        const reactionData = await fetchRecipientReactions(item.id)
                        const normalized = normalizeReactionsResponse(reactionData)
                        const totalReactions = normalized.reduce((acc, reaction) => acc + (reaction.count || 0), 0)
                        
                        return { ...item, reactions: normalized, totalReactions }
                    } catch (err) {
                        // 개별 반응 데이터 로드 실패 시에도 전체 로딩을 멈추지 않음
                        console.error(`반응 데이터를 불러오지 못했습니다 (ID: ${item.id}):`, err)
                        return { ...item, reactions: [], totalReactions: 0 }
                    }
                })
            );
            enriched = enriched.concat(batchResults);
        }
        // ------------------------------------------------------------------

        // [3] 데이터 정렬 및 상태 업데이트
        
        // 인기 순 정렬: 반응 수가 많은 순서대로
        const sortedByReaction = [...enriched].sort((a, b) => (b.totalReactions ?? 0) - (a.totalReactions ?? 0))
        
        // 최근 순 정렬: 생성일이 최신인 순서대로
        const sortedByRecent = [...enriched].sort((a, b) => {
          const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        })

        if (!active) return

        setPopularCards(sortedByReaction)
        setRecentCards(sortedByRecent)
      } catch (err) {
        if (!active) return
        
        console.error('수신인 목록 불러오기 실패:', err)
        
        const errorMessage = err?.response?.data
          ? Object.entries(err.response.data)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('\n')
          : err?.message || '알 수 없는 오류가 발생했습니다.'
        setError(new Error(errorMessage))
        setPopularCards([])
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


  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-center shadow-[0_1px_0_rgba(237,237,237,1)] bg-white">
        <div className={`w-full max-w-[1199px] ${styles.headerShell}`}>
          <Header />
        </div>
      </header>

      <main className={`flex flex-col items-center gap-[50px] pt-[30px] pb-6 min-[769px]:pb-[172px] overflow-hidden min-[769px]:overflow-visible ${styles.mainLayout}`}>
        <section className={`w-full max-w-[1160px] flex flex-col gap-4 ${styles.section}`}>
          <div className={`flex items-center justify-between ${styles.sectionHeader}`}>
            <h2 className={`text-24-bold text-gray-900 ${styles.sectionTitle}`}>
              인기 TOP 8 🔥
            </h2>
            </div>
          {loading ? (
            <p className="text-14-regular text-gray-500">데이터를 불러오는 중입니다...</p>
          ) : error ? (
            <div className="text-14-regular text-red-500">
              <p>데이터를 불러오지 못했습니다.</p>
              {error.message && <p className="text-xs mt-1">{error.message}</p>}
            </div>
          ) : (
            <RollingSwiper cards={popularCards} sliderKey="popular" viewportWidth={viewportWidth} />
          )}
        </section>

        <section className={`w-full max-w-[1160px] flex flex-col gap-4 ${styles.section}`}>
          <div className={`flex items-center justify-between ${styles.sectionHeader}`}>
            <h2 
              onClick={() => navigate('/recent')}
              className={`text-24-bold text-gray-900 ${styles.sectionTitle} cursor-pointer hover:text-purple-600 transition-colors`}
            >
              최근에 만든 롤링 페이퍼 ⭐️️
              {!loading && !error && (
                <span className="text-16-regular text-gray-500 ml-2">
                  ({recentCards.length}개)
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
          ) : (
            <RollingSwiper cards={recentCards} sliderKey="recent" viewportWidth={viewportWidth} />
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

export default ListPage
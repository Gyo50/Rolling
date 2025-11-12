import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Component/Header/Header'
import CardList from '../Component/CardList/CardList'
import PrimaryMain from '../Component/Button/Primary-main'
import LeftArrow from '../Component/Button/Left-arrow'
import RightArrow from '../Component/Button/Right-arrow'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import styles from './ListPage.module.css'
import { fetchRecipients, fetchRecipientReactions, normalizeReactionsResponse } from '../api/recipients'

const CARDS_PER_VIEW = 4
const CARDS_PER_GROUP = 2
const CARD_GAP = 20

function NavigableCard({ card }) {
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
      <CardList recipient={card} />
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
  const isDesktop = viewportWidth > 1024
  const visibleCount = isDesktop ? CARDS_PER_VIEW : 1
  const totalSlides = safeCards.length
  const maxStartIndex = Math.max(totalSlides - visibleCount, 0)
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

  const handleSlideChange = (swiper) => {
    const clamped = Math.min(swiper.activeIndex, maxStartIndex)
    if (clamped !== activeIndex) {
      setActiveIndex(clamped)
    }
  }

  const slideBy = useCallback(
    (delta) => {
      const swiper = swiperRef.current
      if (!swiper) return
      const step = isDesktop ? CARDS_PER_GROUP : viewportWidth > 768 ? 3 : 1
      const target = Math.min(Math.max(swiper.activeIndex + delta * step, 0), maxStartIndex)
      swiper.slideTo(target)
    },
    [isDesktop, maxStartIndex, viewportWidth]
  )

  const handleWheel = useCallback(
    (event) => {
      if (isDesktop) return
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
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={handleSlideChange}
        className={`w-full ${styles.swiperInstance}`}
      >
        {displayCards.map((card, index) => (
          <SwiperSlide
            key={`${sliderKey}-${card.id ?? index}`}
            className={`flex justify-center ${styles.swiperSlide}`}
          >
            {card.placeholder ? <PlaceholderCard index={index} /> : <NavigableCard card={card} />}
          </SwiperSlide>
        ))}
      </Swiper>

      {showNavigation && activeIndex < maxStartIndex && (
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

    const handleResize = () => {
      const measured = window.innerWidth || document.documentElement.clientWidth || 1920
      setViewportWidth(Math.round(measured))
    }
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    let active = true

    const loadRecipients = async () => {
      try {
        setLoading(true)
        setError(null)
        // 수신인 목록을 불러와 리스트 카드에 필요한 기본 데이터 확보
        const data = await fetchRecipients({ limit: 12 })
        if (!active) return
        const results = Array.isArray(data?.results) ? data.results : []

        // 각 수신인에 대한 반응 카운트를 따로 요청하여 카드에 전달
        const enriched = await Promise.all(
          results.map(async (item) => {
            if (!item?.id) return { ...item, reactions: [] }
            try {
              const reactionData = await fetchRecipientReactions(item.id)
              const normalized = normalizeReactionsResponse(reactionData)
              return { ...item, reactions: normalized }
            } catch (err) {
              console.error('반응 데이터를 불러오지 못했습니다:', err)
              return { ...item, reactions: [] }
            }
          })
        )

        setPopularCards(enriched)
        setRecentCards([...enriched].reverse())
      } catch (err) {
        if (!active) return
        setError(err)
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

      <main className={`flex flex-col items-center gap-[74px] pt-[54px] pb-6 min-[769px]:pb-[172px] overflow-hidden min-[769px]:overflow-visible ${styles.mainLayout}`}>
        <section className={`w-full max-w-[1160px] flex flex-col gap-4 ${styles.section}`}>
          <div className={`flex items-center justify-between ${styles.sectionHeader}`}>
            <h2 className={`text-24-bold text-gray-900 ${styles.sectionTitle}`}>인기 롤링 페이퍼 🔥</h2>
            </div>
          {loading ? (
            <p className="text-14-regular text-gray-500">데이터를 불러오는 중입니다...</p>
          ) : error ? (
            <p className="text-14-regular text-red-500">데이터를 불러오지 못했습니다.</p>
          ) : (
            <RollingSwiper cards={popularCards} sliderKey="popular" viewportWidth={viewportWidth} />
          )}
        </section>

        <section className={`w-full max-w-[1160px] flex flex-col gap-4 ${styles.section}`}>
          <div className={`flex items-center justify-between ${styles.sectionHeader}`}>
            <h2 className={`text-24-bold text-gray-900 ${styles.sectionTitle}`}>최근에 만든 롤링 페이퍼 ⭐️️</h2>
            </div>
          {loading ? (
            <p className="text-14-regular text-gray-500">데이터를 불러오는 중입니다...</p>
          ) : error ? (
            <p className="text-14-regular text-red-500">데이터를 불러오지 못했습니다.</p>
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





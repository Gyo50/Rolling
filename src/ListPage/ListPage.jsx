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

const CARDS_PER_VIEW = 4
const CARDS_PER_GROUP = 2
const CARD_GAP = 20

const POPULAR_CARDS = Array.from({ length: 12 }, (_, index) => ({ id: index }))
const RECENT_CARDS = Array.from({ length: 12 }, (_, index) => ({ id: index + 100 }))

function NavigableCard({ cardId }) {
  const navigate = useNavigate()

  const handleNavigate = useCallback(() => {
    if (cardId === undefined || cardId === null) return
    navigate(`/post/${cardId}`)
  }, [cardId, navigate])

  return (
    <div
      onClick={handleNavigate}
      className="cursor-pointer"
    >
      <CardList />
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

  const isMobile = viewportWidth <= 360
  const isDesktop = viewportWidth > 1024
  const visibleCount = isDesktop ? CARDS_PER_VIEW : 1
  const totalSlides = cards.length
  const maxStartIndex = Math.max(totalSlides - visibleCount, 0)
  const showNavigation = isDesktop && totalSlides > CARDS_PER_VIEW
  const cardGap = isMobile ? 12 : CARD_GAP

  const displayCards = useMemo(() => {
    if (!showNavigation) return cards
    if (totalSlides >= CARDS_PER_VIEW) return cards
    const placeholders = Array.from({ length: CARDS_PER_VIEW - totalSlides }, (_, index) => ({
      id: `placeholder-${sliderKey}-${index}`,
      placeholder: true
    }))
    return [...cards, ...placeholders]
  }, [cards, showNavigation, sliderKey, totalSlides])

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
            {card.placeholder ? <PlaceholderCard index={index} /> : <NavigableCard cardId={card.id} />}
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

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const handleResize = () => {
      const measured = window.innerWidth || document.documentElement.clientWidth || 1920
      setViewportWidth(Math.round(measured))
    }
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
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
          <RollingSwiper cards={POPULAR_CARDS} sliderKey="popular" viewportWidth={viewportWidth} />
        </section>

        <section className={`w-full max-w-[1160px] flex flex-col gap-4 ${styles.section}`}>
          <div className={`flex items-center justify-between ${styles.sectionHeader}`}>
            <h2 className={`text-24-bold text-gray-900 ${styles.sectionTitle}`}>최근에 만든 롤링 페이퍼 ⭐️️</h2>
            </div>
          <RollingSwiper cards={RECENT_CARDS} sliderKey="recent" viewportWidth={viewportWidth} />
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





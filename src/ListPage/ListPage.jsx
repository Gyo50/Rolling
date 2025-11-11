import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Header/Header'
import CardList from '../CardList/CardList'
import PrimaryMain from '../Button/Primary-main'
import LeftArrow from '../Button/Left-arrow'
import RightArrow from '../Button/Right-arrow'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

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
      className="w-[275px] h-[260px] rounded-[16px] border border-dashed border-gray-200 bg-[#F8F8F8]"
    />
  )
}

function RollingSwiper({ cards, sliderKey }) {
  const swiperRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const totalSlides = cards.length
  const maxStartIndex = Math.max(totalSlides - CARDS_PER_VIEW, 0)
  const showNavigation = totalSlides > CARDS_PER_VIEW

  const displayCards = useMemo(() => {
    if (totalSlides >= CARDS_PER_VIEW) return cards
    const placeholders = Array.from({ length: CARDS_PER_VIEW - totalSlides }, (_, index) => ({
      id: `placeholder-${sliderKey}-${index}`,
      placeholder: true
    }))
    return [...cards, ...placeholders]
  }, [cards, sliderKey, totalSlides])

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

  const slideBy = (delta) => {
    const swiper = swiperRef.current
    if (!swiper) return
    const target = Math.min(Math.max(swiper.activeIndex + delta, 0), maxStartIndex)
    swiper.slideTo(target)
  }

  if (!showNavigation) {
    return (
      <div className="flex w-full justify-start gap-5">
        {displayCards.map((card, index) =>
          card.placeholder ? (
            <PlaceholderCard key={`${sliderKey}-${card.id}`} index={index} />
          ) : (
            <NavigableCard key={`${sliderKey}-${card.id}`} cardId={card.id} />
          )
        )}
      </div>
    )
  }

  return (
    <div className="relative flex items-center">
      {activeIndex > 0 && (
        <div
          className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
          onClick={() => slideBy(-CARDS_PER_GROUP)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              slideBy(-CARDS_PER_GROUP)
            }
          }}
        >
          <LeftArrow />
        </div>
      )}

      <Swiper
        spaceBetween={CARD_GAP}
        slidesPerView={CARDS_PER_VIEW}
        slidesPerGroup={CARDS_PER_GROUP}
        allowTouchMove={false}
        loop={false}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={handleSlideChange}
        className="w-full"
      >
        {displayCards.map((card, index) => (
          <SwiperSlide key={`${sliderKey}-${card.id}`} className="!w-[275px] flex justify-center">
            {card.placeholder ? <PlaceholderCard index={index} /> : <NavigableCard cardId={card.id} />}
          </SwiperSlide>
        ))}
      </Swiper>

      {activeIndex < maxStartIndex && (
        <div
          className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
          onClick={() => slideBy(CARDS_PER_GROUP)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              slideBy(CARDS_PER_GROUP)
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
  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-center shadow-[0_1px_0_rgba(237,237,237,1)] bg-white">
        <div className="w-full max-w-[1199px]">
          <Header />
        </div>
      </header>

      <main className="flex flex-col items-center gap-16 py-16">
        <section className="w-full max-w-[1160px] flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-24-bold text-gray-900">인기 롤링 페이퍼 🔥</h2>
          </div>
          <RollingSwiper cards={POPULAR_CARDS} sliderKey="popular" />
        </section>

        <section className="w-full max-w-[1160px] flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-24-bold text-gray-900">최근에 만든 롤링 페이퍼 ⭐️️</h2>
          </div>
          <RollingSwiper cards={RECENT_CARDS} sliderKey="recent" />
        </section>

        <div className="w-full max-w-[1201px] flex flex-col items-center">
          <PrimaryMain
            className="mt-6 shadow-[0_4px_10px_rgba(153,53,255,0.2)]"
            text="나도 만들어보기"
            to="/post"
          />
        </div>
      </main>
    </div>
  )
}

export default ListPage


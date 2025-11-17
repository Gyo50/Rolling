import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Component/Header/Header";
import CardList from "../Component/CardList/CardList";
import PrimaryMain from "../Component/Button/Primary-main";
import LeftArrow from "../Component/Button/Left-arrow";
import RightArrow from "../Component/Button/Right-arrow";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styles from "./ListPage.module.css";
import {
  fetchRecipients,
  fetchRecipientReactions,
  normalizeReactionsResponse,
} from "../api/recipients";

const CARDS_PER_VIEW = 4;
const CARDS_PER_GROUP = 2;
const CARD_GAP = 20;

// 최근 3시간 내 생성된 롤링페이퍼인지 확인하는 함수
function isWithin3Hours(createdAt) {
  if (!createdAt) return false;
  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  const threeHoursInMs = 3 * 60 * 60 * 1000;
  return now - createdTime < threeHoursInMs;
}

function NavigableCard({ card, rank, isRecent }) {
  const navigate = useNavigate();

  const handleNavigate = useCallback(() => {
    const cardId = card?.id;
    if (cardId === undefined || cardId === null) return;
    navigate(`/post/${cardId}`);
  }, [card, navigate]);

  return (
    <div onClick={handleNavigate} className="cursor-pointer">
      <CardList recipient={card} rank={rank} isRecent={isRecent} />
    </div>
  );
}

function PlaceholderCard({ index }) {
  return <div key={`placeholder-${index}`} aria-hidden="true" className={styles.placeholderCard} />;
}

function RollingSwiper({ cards, sliderKey, viewportWidth }) {
  const swiperRef = useRef(null);
  const swiperShellRef = useRef(null); // Swiper 래퍼 DOM 요소를 위한 Ref
  const [activeIndex, setActiveIndex] = useState(0);

  const safeCards = useMemo(() => (Array.isArray(cards) ? cards : []), [cards]);

  const isMobile = viewportWidth <= 360
  const isDesktop = viewportWidth > 1024
  const useAutoSlides = !isDesktop
  // 화면 크기에 따라 보이는 카드 수
  const visibleCount = isDesktop ? CARDS_PER_VIEW : 1
  const totalSlides = safeCards.length
  // 마지막 카드가 완전히 보이는 최대 시작 인덱스
  const maxStartIndexForLastCard = Math.max(totalSlides - visibleCount, 0)
  const showNavigation = isDesktop && totalSlides > CARDS_PER_VIEW
  const cardGap = isMobile ? 12 : CARD_GAP

  const displayCards = useMemo(() => {
    if (!showNavigation) return safeCards;
    if (totalSlides >= CARDS_PER_VIEW) return safeCards;
    const placeholders = Array.from({ length: CARDS_PER_VIEW - totalSlides }, (_, index) => ({
      id: `placeholder-${sliderKey}-${index}`,
      placeholder: true,
    }));
    return [...safeCards, ...placeholders];
  }, [safeCards, showNavigation, sliderKey, totalSlides]);

  useEffect(() => {
    setActiveIndex(0);
    if (swiperRef.current) {
      swiperRef.current.slideTo(0, 0);
      swiperRef.current.update();
    }
  }, [displayCards]);

  const handleSlideChange = useCallback((swiper) => {
    // requestAnimationFrame을 사용하여 성능 최적화
    requestAnimationFrame(() => {
      // Swiper의 실제 activeIndex를 사용하되, 최대 인덱스를 초과하지 않도록 제한
      const currentIndex = swiper.activeIndex
      // 모든 화면에서 마지막 카드가 완전히 보이는 위치까지만 허용
      const clamped = Math.min(currentIndex, maxStartIndexForLastCard)

      // 터치 스크롤로 인한 이동인 경우, 최대 인덱스를 초과하면 제한
      if (clamped !== currentIndex && currentIndex > maxStartIndexForLastCard) {
        // 최대 인덱스를 초과했으면 최대 인덱스로 이동
        swiper.slideTo(maxStartIndexForLastCard, 300) // 300ms 애니메이션
        setActiveIndex(maxStartIndexForLastCard)
      } else {
        // activeIndex를 항상 Swiper의 실제 인덱스와 동기화
        setActiveIndex(clamped)
      }
    })
  }, [isDesktop, maxStartIndexForLastCard])

  const slideBy = useCallback(
    (delta) => {
      const swiper = swiperRef.current;
      if (!swiper) return;

      // activeIndex를 우선 사용 (swiper.activeIndex와 동기화되어 있음)
      const currentIndex = activeIndex
      let step = CARDS_PER_GROUP

      // 오른쪽으로 이동할 때 마지막 처리
      if (delta > 0 && totalSlides > visibleCount) {
        if (currentIndex < maxStartIndexForLastCard) {
          const remainingToLastCard = maxStartIndexForLastCard - currentIndex
          if (remainingToLastCard < step) {
            step = remainingToLastCard
          }
        } else {
          return
        }
      }

      // 목표 인덱스 계산
      const proposedTarget = currentIndex + delta * step
      let target = Math.max(proposedTarget, 0)

      // 마지막 카드가 완전히 보이는 위치까지만 이동 허용
      target = Math.min(target, maxStartIndexForLastCard)

      // 실제로 이동할 수 있는지 확인
      if (target !== currentIndex) {
        const originalSlidesPerGroup = swiper.params.slidesPerGroup
        if (target >= maxStartIndexForLastCard || currentIndex >= maxStartIndexForLastCard) {
          swiper.params.slidesPerGroup = 1
        }
        swiper.slideTo(target, 300); // 300ms 애니메이션
        // 원래 설정 복원
        if (target >= maxStartIndexForLastCard || currentIndex >= maxStartIndexForLastCard) {
          swiper.params.slidesPerGroup = originalSlidesPerGroup
        }
        setActiveIndex(target); // activeIndex 즉시 업데이트
      }
    },
    [activeIndex, maxStartIndexForLastCard, isDesktop, totalSlides, visibleCount]
  )

  const handleWheel = useCallback(
    (event) => {
      if (!isDesktop) return;

      const swiper = swiperRef.current;
      if (!swiper) return;

      const delta = event.deltaY > 0 ? 1 : -1;
      const goingRight = delta > 0;
      const goingLeft = delta < 0;

      // Swiper 6부터는 isEnd, isBeginning이 제공됨.
      const reachedEnd = swiper.isEnd || swiper.activeIndex >= maxStartIndexForLastCard;
      const reachedBeginning = swiper.isBeginning || swiper.activeIndex === 0;

      let shouldPreventDefault = true;

      if (goingRight && reachedEnd) {
        shouldPreventDefault = false;
      }
      else if (goingLeft && reachedBeginning) {
        shouldPreventDefault = false;
      }

      if (shouldPreventDefault) {
        event.preventDefault();
        event.stopPropagation();
        slideBy(delta);
      }

    },
    [isDesktop, slideBy, maxStartIndexForLastCard]
  );

  useEffect(() => {
    const element = swiperShellRef.current;
    if (!element || !isDesktop) return undefined;

    // passive: false를 사용하여 preventDefault()가 정상 작동하도록 보장
    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel, isDesktop]);

  const slidesOffset = useMemo(() => {
    if (isDesktop) return 0
    if (isMobile) return 16
    if (viewportWidth <= 768) return 20
    return 24
  }, [isDesktop, isMobile, viewportWidth])

  return (
    <div
      ref={swiperShellRef}
      className={`relative flex items-center ${styles.swiperShell}`}
    >
      {showNavigation && activeIndex > 0 && (
        <div
          className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
          onClick={() => slideBy(-1)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              slideBy(-1);
            }
          }}
        >
          <LeftArrow />
        </div>
      )}

      <Swiper
        spaceBetween={cardGap}
        slidesPerView={useAutoSlides ? 'auto' : CARDS_PER_VIEW}
        slidesPerGroup={useAutoSlides ? 1 : CARDS_PER_GROUP}
        slidesOffsetBefore={slidesOffset}
        slidesOffsetAfter={slidesOffset}
        allowTouchMove={!isDesktop}
        loop={false}
        touchEventsTarget="container"
        touchStartPreventDefault={false}
        touchRatio={1}
        touchAngle={45}
        threshold={5}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
        className={`w-full ${styles.swiperInstance}`}
      >
        {displayCards.map((card, index) => {
          // 인기 탑 8의 경우 rank 전달 (1,2,3등만 배지 표시)
          const rank = sliderKey === "popular" && !card.placeholder ? index + 1 : null;
          // 최근 섹션의 경우 3시간 내 생성 여부 확인
          const isRecent =
            sliderKey === "recent" && !card.placeholder ? isWithin3Hours(card?.createdAt) : false;
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
          );
        })}
      </Swiper>

      {showNavigation && (() => {
        // 오른쪽 화살표 표시 조건
        return activeIndex < maxStartIndexForLastCard
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
  );
}

function ListPage() {
  const navigate = useNavigate();
  const [viewportWidth, setViewportWidth] = useState(() => {
    if (typeof window === "undefined") return 1920;
    const measured = window.innerWidth || document.documentElement.clientWidth || 1920;
    return Math.round(measured);
  });
  const [popularCards, setPopularCards] = useState([]);
  const [recentCards, setRecentCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    // 리사이즈 이벤트에 대한 throttle 적용 및 passive 옵션 추가
    let timeoutId = null;
    const handleResize = () => {
      // throttle: 150ms마다 한 번만 실행하여 성능 최적화
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        const measured = window.innerWidth || document.documentElement.clientWidth || 1920;
        setViewportWidth(Math.round(measured));
        timeoutId = null;
      }, 150);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      if (timeoutId) clearTimeout(timeoutId); // 컴포넌트 언마운트 시 타이머 정리
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadRecipients = async () => {
      try {
        setLoading(true);
        setError(null);

        // pagination을 모두 따라가며 수신인 전체 목록을 불러온다
        const limit = 50;
        let offset = 0;
        let aggregated = [];
        let hasNext = true;

        while (hasNext) {
          const data = await fetchRecipients({ limit, offset });

          if (!active) {
            return;
          }

          const results = Array.isArray(data?.results) ? data.results : [];
          aggregated = aggregated.concat(results);

          if (data?.next) {
            offset += limit;
          } else {
            hasNext = false;
          }
        }

        // 각 수신인에 대한 반응 카운트를 따로 요청하여 카드에 전달하고 총합 계산
        const enriched = await Promise.all(
          aggregated.map(async (item) => {
            if (!item?.id) {
              return { ...item, reactions: [], totalReactions: 0 };
            }

            try {
              const reactionData = await fetchRecipientReactions(item.id);
              const normalized = normalizeReactionsResponse(reactionData);
              const totalReactions = normalized.reduce(
                (acc, reaction) => acc + (reaction.count || 0),
                0
              );

              return { ...item, reactions: normalized, totalReactions };
            } catch (err) {
              console.error("반응 데이터를 불러오지 못했습니다:", err);
              return { ...item, reactions: [], totalReactions: 0 };
            }
          })
        );

        // 인기 순 정렬:
        // 1순위: 이모지가 많은 순 (totalReactions > 0)
        // 2순위: 이모지가 없고 작성한 사람이 있을 경우 (totalReactions === 0 && messageCount > 0)
        // 3순위: 아무것도 없는 경우 (totalReactions === 0 && messageCount === 0)
        const sortedByReaction = [...enriched]
          .sort((a, b) => {
            const aReactions = a.totalReactions ?? 0;
            const bReactions = b.totalReactions ?? 0;
            const aMessageCount = Number(a.messageCount ?? 0);
            const bMessageCount = Number(b.messageCount ?? 0);

            // 1순위: 이모지가 있는 경우
            const aHasReactions = aReactions > 0;
            const bHasReactions = bReactions > 0;

            if (aHasReactions && !bHasReactions) return -1; // a가 1순위
            if (!aHasReactions && bHasReactions) return 1; // b가 1순위

            // 둘 다 이모지가 있으면 이모지 수로 정렬
            if (aHasReactions && bHasReactions) {
              return bReactions - aReactions;
            }

            // 둘 다 이모지가 없는 경우
            // 2순위: 작성한 사람이 있는 경우
            const aHasMessages = aMessageCount > 0;
            const bHasMessages = bMessageCount > 0;

            if (aHasMessages && !bHasMessages) return -1; // a가 2순위
            if (!aHasMessages && bHasMessages) return 1; // b가 2순위

            // 둘 다 작성한 사람이 있으면 작성한 사람 수로 정렬
            if (aHasMessages && bHasMessages) {
              return bMessageCount - aMessageCount;
            }

            // 둘 다 아무것도 없는 경우 (3순위) - 순서 유지
            return 0;
          })
          .slice(0, 8);

        // 최근 순 정렬: 생성일이 최신인 순서대로
        const sortedByRecent = [...enriched].sort((a, b) => {
          const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

        if (!active) {
          return;
        }

        setPopularCards(sortedByReaction);
        setRecentCards(sortedByRecent);
      } catch (err) {
        if (!active) {
          return;
        }

        console.error("수신인 목록 불러오기 실패:", err);

        const errorMessage = err?.response?.data
          ? Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join("\n")
          : err?.message || "알 수 없는 오류가 발생했습니다.";
        setError(new Error(errorMessage));
        setPopularCards([]);
        setRecentCards([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadRecipients();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-white">
      <header className=" mx-auto bg-white ">
        <div className={`${styles.headerShell}`}>
          <Header />
        </div>
      </header>

      <main className="flex flex-col items-center w-full pt-[50px] pb-6 gap-[50px] overflow-visible px-6 max-ta:px-0 max-ta:overflow-hidden max-xt:w-full max-xt:pt-[50px] max-xt:items-start max-xt:gap-[74px] max-xs:pt-[50px] max-xs:gap-[74px] max-xs:items-start">
        {/* **[참고]** max-w 컨테이너와 패딩을 분리하기 위한 구조 변경 */}
        <section className="w-full flex flex-col gap-4 max-w-[1160px] max-ta:max-w-full">
          <div className="max-xt:px-6 max-xs:px-5"> {/* 제목용 패딩 래퍼 */}
            <div className={`flex items-center justify-between max-xt:flex-col max-xt:items-start gap-4 ${styles.sectionHeaderRow}`}>
              <h2 className="mb-4 text-24-bold text-gray-900 max-xt:text-24-bold max-xs:text-[20px] max-xs:leading-[30px] max-xs:mb-3">
                인기 TOP 8 🔥
              </h2>
            </div>
            {loading ? (
              <p className="text-14-regular text-gray-500 translate-x-6 max-ta:translate-x-0 text-center">데이터를 불러오는 중입니다...</p>
            ) : error ? (
              <div className="text-14-regular text-red-500">
                <p>데이터를 불러오지 못했습니다.</p>
                {error.message && <p className="text-xs mt-1">{error.message}</p>}
              </div>
            ) : (
              // Swiper는 내부 slidesOffset으로 모바일 패딩을 처리함
              <RollingSwiper cards={popularCards} sliderKey="popular" viewportWidth={viewportWidth} />
            )}
          </div>
        </section>

        {/* **[참고]** max-w 컨테이너와 패딩을 분리하기 위한 구조 변경 */}
        <section className="w-full flex flex-col gap-4 max-w-[1160px] max-ta:max-w-full">
          <div className="max-xt:px-6 max-xs:px-5"> {/* 제목용 패딩 래퍼 */}
            <div className={`flex items-center justify-between max-xt:items-start gap-4 max-xt:flex-row ${styles.sectionHeaderRow}`}>
              <h2
                className="mb-4 text-24-bold text-gray-900 max-xt:text-24-bold max-xs:text-[20px] max-xs:leading-[30px] max-xs:mb-3"
              >
                최근에 만든 롤링 페이퍼 ⭐️️
                {!loading && !error && (
                  <span className="text-16-regular text-gray-500 ml-2">({recentCards.length}개)</span>
                )}
              </h2>
              <button
                onClick={() => navigate('/recent')}
                className="
                            hover:text-purple-600 
                            transition-colors
                            relative
                            after:content-['>']
                            after:ml-1
                            after:group-hover:text- purple-600
                            max-xt:pr-[24px]
                          "
                >
                전체보기
              </button>
            </div>
            {loading ? (
              <p className="text-14-regular text-gray-500 translate-x-6 max-ta:translate-x-0 text-center">데이터를 불러오는 중입니다...</p>
            ) : error ? (
              <div className="text-14-regular text-red-500">
                <p>데이터를 불러오지 못했습니다.</p>
                {error.message && <p className="text-xs mt-1">{error.message}</p>}
              </div>
            ) : (
              // Swiper는 내부 slidesOffset으로 모바일 패딩을 처리함
              <RollingSwiper cards={recentCards} sliderKey="recent" viewportWidth={viewportWidth} />
            )}
          </div>
        </section>

        <div className="w-full flex flex-col items-center max-w-[1160px] mt-12 mb-12 max-ta:max-w-full max-xt:px-6 max-xs:px-5">
          <PrimaryMain text="나도 만들어보기" to="/post" />
        </div>
      </main>
    </div>
  );
}

export default ListPage;
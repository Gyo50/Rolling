import React, { useMemo } from 'react'
import profile01 from './assets/profile01.svg'
import profile02 from './assets/profile02.svg'
import profile03 from './assets/profile03.svg'
import pattern01 from '../Card_list/assets/pattern01.svg'
import pattern02 from '../Card_list/assets/pattern02.svg'
import pattern03 from '../Card_list/assets/pattern03.svg'
import pattern04 from '../Card_list/assets/pattern04.svg'
import { REACTION_ALIAS_TO_EMOJI } from '../../api/recipients'

const COLOR_STYLE_MAP = {
  beige: { hex: '#FFE2AD', pattern: pattern02 },
  purple: { hex: '#ECD9FF', pattern: pattern01 },
  blue: { hex: '#B1E4FF', pattern: pattern03 },
  green: { hex: '#D0F5C3', pattern: pattern04 }
}//컬러 카드 리스트

const DEFAULT_BACKGROUND =
  "https://mblogthumb-phinf.pstatic.net/MjAyMTAzMDVfOTYg/MDAxNjE0OTU1MTgyMzYz.ozwJXDtUw0V_Gniz6i7qgDOkNs09MX-rJdCcaw6AAeAg.DZivXhGnQDUUx7kgkRXNOEI0DEltAo6p9Jk9SDBbxRcg.JPEG.sosohan_n/IMG_3725.JPG?type=w800"

function CardList({ recipient }) {
  // API에서 내려온 수신인 정보(name, messageCount 등)를 카드 UI에 반영
  const name = recipient?.name || 'To.Sowon'
  // messageCount는 API가 문자열을 줄 수도 있어 Number 변환 후 기본값 처리
  const messageCount = useMemo(() => {
    if (recipient?.messageCount === undefined || recipient?.messageCount === null) return 30
    const parsed = Number(recipient.messageCount)
    return Number.isNaN(parsed) ? 30 : parsed
  }, [recipient?.messageCount])
  const backgroundImageURL = recipient?.backgroundImageURL || null
  const backgroundColorName = recipient?.backgroundColor || null

  const colorStyle = backgroundColorName
    ? COLOR_STYLE_MAP[backgroundColorName] || { hex: backgroundColorName }
    : null

  const isImageCard = Boolean(backgroundImageURL || (!colorStyle && !backgroundColorName))

  const backgroundStyle = isImageCard
    ? {
        backgroundImage: `url('${backgroundImageURL || DEFAULT_BACKGROUND}')`,
        backgroundColor: 'transparent'
      }
    : {
        backgroundImage: 'none',
        backgroundColor: colorStyle?.hex || '#FFE2AD'
      }

  const titleClass = isImageCard
    ? 'text-24-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] text-white'
    : 'text-24-bold text-gray-900'

  const infoClass = isImageCard
    ? 'mb-5 text-16-regular leading-[1.5] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]'
    : 'mb-5 text-16-regular leading-[1.5] text-gray-700'

  const topReactions = useMemo(() => {
    if (!Array.isArray(recipient?.reactions)) return []
    return [...recipient.reactions]
      .filter((item) => item && item.emoji)
      .map((item, index) => {
        const emojiValue = item.emoji
        const resolvedEmoji = REACTION_ALIAS_TO_EMOJI[emojiValue] || emojiValue

        return {
          id: item.id ?? `${emojiValue}-${index}`,
          emoji: resolvedEmoji,
          count: typeof item.count === 'number' ? item.count : Number(item.count) || 0
        }
      })
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  }, [recipient?.reactions])

  const reactionBadgeClass = isImageCard
    ? 'bg-black/60 text-white'
    : 'bg-white/80 text-gray-900 border border-white/60 shadow-sm'
//가을님 작업 복붙했어요
  return (
    <div
      data-cardlist
      className="
        relative overflow-hidden flex-shrink-0
        w-[208px] h-[232px] rounded-[16px] box-border
        pt-6 pr-5 pb-5 pl-5
        min-[361px]:w-[275px] min-[361px]:h-[260px]
        min-[361px]:pt-[30px] min-[361px]:pr-6 min-[361px]:pb-5 min-[361px]:pl-6
        border border-grayscale-500/20
        shadow-[0_2px_13px_rgba(0,0,0,0.08)]
        bg-cover bg-center
        transition-colors duration-200
      "
      style={{
        ...backgroundStyle,
        color: isImageCard ? '#FFFFFF' : '#2B2B2B'
      }}
    >
      {isImageCard && (
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
      )}
      {!isImageCard && colorStyle?.pattern && (
        <img
          src={colorStyle.pattern}
          alt=""
          aria-hidden="true"
          className="absolute right-0 bottom-[-10px] pointer-events-none z-0 select-none"
        />
      )}
      <div
        className={`flex flex-col gap-3 relative z-[1] ${isImageCard ? 'text-white' : 'text-gray-900'}`}
      >
        <div className={titleClass}>{name}</div>

        <div className="flex items-center">
          <img
            className="w-7 h-7 rounded-full border border-white object-cover relative ml-0"
            src={profile01}
            alt="profile01"
          />
          <img
            className="w-7 h-7 rounded-full border border-white object-cover relative ml-[-10px]"
            src={profile02}
            alt="profile02"
          />
          <img
            className="w-7 h-7 rounded-full border border-white object-cover relative ml-[-10px]"
            src={profile03}
            alt="profile03"
          />
          <span className="inline-flex items-center justify-center ml-[-10px] relative z-[1]">
            <span
              className="
                flex items-center justify-center
                w-7 h-7
                rounded-full bg-[#FFFFFF] text-12-regular
              "
              style={{ color: '#000000' }}
            >
              +27
            </span>
          </span>
        </div>

        <div className={infoClass}>
          <span className={`text-16-bold ${isImageCard ? 'drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]' : 'text-gray-900'}`}>
            {messageCount} 
          </span>
          명이 작성했어요!
        </div>
      </div>

      {topReactions.length > 0 && (
        <div
          className="
            flex items-end gap-2
            mt-[17px] pt-[18px]
            max-[360px]:mt-4 max-[360px]:pt-[14px]
            border-t border-grayscale-500/40
            absolute z-[1]
          "
        >
          {topReactions.map((reaction) => (
            <div
              key={reaction.id}
              className={`
                min-w-[66px] h-9 px-3 py-2 flex justify-center items-center
                rounded-[32px] text-16-regular gap-1
                ${reactionBadgeClass}
              `}
            >
              <span>{reaction.emoji}</span>
              <span>{reaction.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CardList


import React from 'react'

/**
 * Badge 컴포넌트
 * @param {string} type - 'coworker'(동료), 'other'(지인), 'family'(가족), 'friend'(친구), 'emoji'(이모지)
 * @param {string} text - 배지에 표시할 텍스트 (관계 타입일 때만)
 * @param {string} emoji - 이모지 배지일 때 표시할 이모지
 * @param {number} count - 이모지 배지일 때 표시할 숫자
 */
function Badge({ type = 'coworker', text, emoji, count }) {
  // 관계 타입 배지
  const relationshipBadges = {
    coworker: {
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      defaultText: '동료'
    },
    other: {
      bgColor: 'bg-beige-100',
      textColor: 'text-beige-500',
      defaultText: '지인'
    },
    family: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-500',
      defaultText: '가족'
    },
    friend: {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-500',
      defaultText: '친구'
    }
  }

  // 이모지 배지
  if (type === 'emoji') {
    return (
      <div 
        className="flex flex-row items-center gap-0.5 py-2 px-3 w-[66px] h-9 rounded-[32px]"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.54)' }}
      >
        <span className="w-5 h-5 text-base leading-5 text-black flex items-center justify-center flex-shrink-0">
          {emoji}
        </span>
        <span className="w-5 h-5 text-base leading-5 text-white flex items-center justify-center flex-shrink-0">
          {count}
        </span>
      </div>
    )
  }

  // 관계 타입 배지
  const badgeStyle = relationshipBadges[type] || relationshipBadges.coworker
  const displayText = text || badgeStyle.defaultText

  return (
    <div className={`flex flex-row justify-center items-center px-2 gap-2.5 h-5 ${badgeStyle.bgColor} rounded`}>
      <span className={`text-[14px] leading-5 tracking-[-0.005em] font-normal ${badgeStyle.textColor}`}>
        {displayText}
      </span>
    </div>
  )
}

export default Badge

import React from 'react'

/**
 * BadgeCoworker 컴포넌트 - 동료 배지
 * @param {string} text - 배지에 표시할 텍스트 (기본값: '동료')
 */
function BadgeCoworker({ text = '동료' }) {
  return (
    <div className="inline-flex flex-row justify-center items-center px-2 gap-2.5 h-5 bg-purple-100 rounded">
      <span className="text-[14px] leading-5 tracking-[-0.005em] font-normal text-purple-600">
        {text}
      </span>
    </div>
  )
}

export default BadgeCoworker



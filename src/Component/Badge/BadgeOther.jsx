import React from 'react'

/**
 * BadgeOther 컴포넌트 - 지인 배지
 * @param {string} text - 배지에 표시할 텍스트 (기본값: '지인')
 */
function BadgeOther({ text = '지인' }) {
  return (
    <div className="inline-flex flex-row justify-center items-center px-2 gap-2.5 h-5 bg-beige-100 rounded">
      <span className="text-[14px] leading-5 tracking-[-0.005em] font-normal text-beige-500">
        {text}
      </span>
    </div>
  )
}

export default BadgeOther



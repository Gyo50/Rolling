import React from 'react'

/**
 * BadgeFamily 컴포넌트 - 가족 배지
 * @param {string} text - 배지에 표시할 텍스트 (기본값: '가족')
 */
function BadgeFamily({ text = '가족' }) {
  return (
    <div className="inline-flex flex-row justify-center items-center px-2 gap-2.5 h-5 bg-green-100 rounded">
      <span className="text-[14px] leading-5 tracking-[-0.005em] font-normal text-green-500">
        {text}
      </span>
    </div>
  )
}

export default BadgeFamily



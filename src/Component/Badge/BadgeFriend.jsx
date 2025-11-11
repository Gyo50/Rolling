import React from 'react'

/**
 * BadgeFriend 컴포넌트 - 친구 배지
 * @param {string} text - 배지에 표시할 텍스트 (기본값: '친구')
 */
function BadgeFriend({ text = '친구' }) {
  return (
    <div className="inline-flex flex-row justify-center items-center px-2 gap-2.5 h-5 bg-blue-100 rounded">
      <span className="text-[14px] leading-5 tracking-[-0.005em] font-normal text-blue-500">
        {text}
      </span>
    </div>
  )
}

export default BadgeFriend



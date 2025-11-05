import React, { useEffect, useState } from 'react'

/**
 * Toast 컴포넌트
 * @param {boolean} isOpen - 토스트 표시 여부
 * @param {function} onClose - 토스트 닫기 함수
 * @param {string} message - 표시할 메시지
 * @param {string} type - 토스트 타입 ('success', 'error', 'info')
 * @param {number} duration - 자동 닫힘 시간 (밀리초, 기본값: 5000ms)
 * @param {boolean} showCloseButton - 닫기 버튼 표시 여부 (기본값: true)
 */
function Toast({ 
  isOpen = false, 
  onClose,
  message = 'URL이 복사 되었습니다.',
  type = 'success',
  duration = 5000,
  showCloseButton = true
}) {
  const [visible, setVisible] = useState(isOpen)

  useEffect(() => {
    setVisible(isOpen)
  }, [isOpen])

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [visible, duration])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300) // 애니메이션 시간
  }

  if (!visible) return null

  // 아이콘 색상 설정
  const iconColors = {
    success: 'bg-green-500',
    error: 'bg-error',
    info: 'bg-blue-500'
  }

  // 체크 아이콘 SVG
  const CheckIcon = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <path 
        d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" 
        fill="white"
      />
    </svg>
  )

  // 닫기 아이콘 SVG
  const CloseIcon = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer"
      onClick={handleClose}
    >
      <path 
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" 
        fill="#CCCCCC"
      />
    </svg>
  )

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="relative w-[524px] h-16 bg-black/80 rounded-lg flex items-center px-[30px]">
        {/* 아이콘과 메시지 */}
        <div className="flex flex-row items-center gap-3 flex-1">
          {type === 'success' && (
            <div className={`w-6 h-6 ${iconColors[type]} rounded-full flex items-center justify-center flex-shrink-0`}>
              <CheckIcon />
            </div>
          )}
          <span className="text-[16px] leading-[26px] font-normal text-white tracking-[-0.01em]">
            {message}
          </span>
        </div>

        {/* 닫기 버튼 */}
        {showCloseButton && (
          <button 
            onClick={handleClose}
            className="absolute right-[30px] top-5 w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        )}
      </div>

      {/* 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Toast

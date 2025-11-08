import React from 'react'
import Badge from '../Badge/Badge'

/**
 * Modal 컴포넌트
 * @param {boolean} isOpen - 모달 열림/닫힘 상태
 * @param {function} onClose - 모달 닫기 함수
 * @param {string} profileImage - 프로필 이미지 URL
 * @param {string} senderName - 보낸 사람 이름
 * @param {string} relationship - 관계 타입 (coworker, other, family, friend)
 * @param {string} date - 날짜
 * @param {string} content - 모달 내용 텍스트
 * @param {string} buttonText - 버튼 텍스트 (기본값: "확인")
 * @param {function} onButtonClick - 버튼 클릭 핸들러
 */
const MODAL_DATA_API_URL = 'https://placeholder.example.com/api/modal'

function Modal({ 
  isOpen = false, 
  onClose,
  profileImage,
  senderName = '김동훈',
  relationship = 'coworker',
  date = '2023.07.08',
  content = '',
  buttonText = '확인',
  onButtonClick,
  apiUrl = MODAL_DATA_API_URL
}) {
  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.()
    }
  }

  const handleButtonClick = () => {
    onButtonClick?.() || onClose?.()
  }

  // 현재 apiUrl은 더미 링크입니다. 실제 서비스에서는 상위 컴포넌트에서 fetch(apiUrl) 등을 통해
  // senderName, relationship, date, content, profileImage 값을 받아 props로 내려주면 됩니다.

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div className="relative w-[600px] h-[476px] bg-white rounded-2xl shadow-[0px_2px_12px_rgba(0,0,0,0.08)]">
        {/* 헤더 영역 */}
        <div className="relative w-full h-[116px] border-b border-gray-200">
          <div className="absolute left-[39px] top-[40px] flex flex-row items-center gap-4">
            {/* 프로필 이미지 */}
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-full overflow-hidden flex-shrink-0">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt={senderName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
            </div>

            {/* 이름과 배지 */}
            <div className="flex flex-col items-start gap-1.5">
              <div className="flex flex-row items-start gap-1.5 h-6">
                <span className="text-[20px] leading-6 font-normal text-black">From.</span>
                <span className="text-[20px] leading-6 font-bold text-black">{senderName}</span>
              </div>
              <Badge type={relationship} />
            </div>
          </div>

          {/* 날짜 */}
          <div className="absolute right-[39px] top-[56px]">
            <span className="text-[14px] leading-5 font-normal tracking-[-0.005em] text-gray-400">
              {date}
            </span>
          </div>
        </div>

        {/* 내용 영역 */}
        <div className="absolute left-10 top-[116px] w-[520px] h-[256px]">
          <div className="relative w-full h-full overflow-y-auto overflow-x-hidden pr-5">
            {/* 스크롤바 스타일링 */}
            <style jsx>{`
              div::-webkit-scrollbar {
                width: 4px;
              }
              div::-webkit-scrollbar-track {
                background: transparent;
              }
              div::-webkit-scrollbar-thumb {
                background: #CCCCCC;
                border-radius: 8px;
              }
            `}</style>
            
            <p className="text-[18px] leading-[28px] font-normal tracking-[-0.01em] text-[#5A5A5A] w-[500px] pt-4 whitespace-pre-line">
              {content || `⭐ 스프린트의 최종 목표 ⭐

🧑‍🤝‍🧑 좋은 동료를 얻어가며 함께 성장하기
🏆 최선의 팀 프로젝트 결과물 완성하기
🌞 매일 조금씩 성장하는 개발자 되기
🧑🏻‍💻 협업 잘 하는 개발자로 성장하기
🧘 포기하지 않고 끝까지 완주하기

모달 스크롤 기능을 확인하기 위한 문장도 이어집니다. 코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요! 코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요!

마지막으로 한 번 더 반복합니다. 코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요! 코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요!`}
            </p>
          </div>
        </div>

        {/* 버튼 */}
        <div className="absolute left-[240px] bottom-5">
          <button
            onClick={handleButtonClick}
            className="flex flex-row justify-center items-center px-4 py-1.5 w-[120px] h-10 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
          >
            <span className="text-[16px] leading-[26px] font-normal text-white text-center tracking-[-0.01em]">
              {buttonText}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal

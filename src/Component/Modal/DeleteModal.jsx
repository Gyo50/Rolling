import React from 'react';

/**
 * 재사용 가능한 삭제 확인 모달 컴포넌트
 *
 * @param {object} props
 * @param {string} props.title - 모달의 제목 (예: "페이지 삭제 확인")
 * @param {string} props.message - 사용자에게 표시할 확인 메시지 (예: "페이지를 삭제하시겠습니까?")
 * @param {function} props.onConfirm - "예" 버튼 클릭 시 실행할 함수 (API 호출 등)
 * @param {function} props.onCancel - "아니요" 또는 배경 클릭 시 실행할 함수
 * @param {boolean} [props.isLoading=false] - 확인 버튼을 비활성화하고 로딩 상태를 표시할지 여부
 */
function DeleteModal({ title, message, onConfirm, onCancel, isLoading = false }) {
  // 모달 내부 클릭 시 배경 닫힘 이벤트 방지
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-[100] p-4"
      onClick={onCancel} // 배경 클릭 시 닫기
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full"
        onClick={handleModalClick} // 모달 내부 클릭 이벤트 버블링 방지
      >
        <h3 className="text-xl font-bold mb-4 text-center text-gray-900">
          {title}
        </h3>
        <p className="text-gray-700 mb-6 text-center text-16-regular">
          {message}
        </p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              py-3 px-4 text-white text-18-regular rounded-lg transition flex-1 
              ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }
            `}
          >
            {isLoading ? '처리 중...' : '예'}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={`
              py-3 px-4 border border-gray-300 rounded-lg text-gray-700 transition flex-1 
              ${isLoading 
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                  : 'hover:bg-gray-100'
              }
            `}
          >
            아니요
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
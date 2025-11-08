import React from 'react'
import addIcon from './assets/addButton.svg';

// 카드 추가 컴포넌트
function AddCard() {
  return (
    <>
      <div
        className="
          w-[384px] h-[280px]
          rounded-[16px]
          p-[28px_24px_24px_24px]
          shadow-[0_2px_13px_rgba(0,0,0,0.08)]
          bg-white
          flex justify-center items-center
        "
      >
        <button
          className="
            w-[56px] h-[56px]
            flex justify-center items-center
          "
        >
          <img src={addIcon} alt='추가' />
        </button>
      </div>
    </>
  )
}

export default AddCard
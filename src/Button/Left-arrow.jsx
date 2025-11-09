import React from 'react'
import Leftarrow from '../img/arrow_left.svg';


function LeftArrow() {
  return (
    <>
      <button className="w-[40px] h-[40px] bg-white/90 backdrop-blur-xs shadow-[0_4px_8px_0_rgba(0,0,0,0.08)] rounded-full border-gray-300 border flex justify-center items-center
      hover:shadow-lg active:shadow-sm">
        <img src={Leftarrow} alt="" />
      </button>
    </>
  )
}

export default LeftArrow
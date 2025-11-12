import React from 'react'
import Right_arrow from '../../img/arrow_right.svg';  


function Rightarrow() {
  return (
    <>
        <button className="w-[40px] h-[40px] bg-white/90 backdrop-blur-xs shadow-[0_4px_8px_0_rgba(0,0,0,0.08)] rounded-full border-gray-300 border flex justify-center items-center
        hover:shadow-lg active:shadow-sm">
        <img src={Right_arrow} alt="" />
      </button>
    </>
  )
}

export default Rightarrow
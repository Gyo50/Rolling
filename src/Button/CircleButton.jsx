import React from 'react'
import plus from '../img/plus.png';

function Circlebutton() {
  return (
    <>
      <div className="w-[56px] h-[56px] inline-block bg-gray-500 rounded-full 
      hover:bg-gray-600 
      disabled:bg-gray-300 
      active:bg-gray-700 
      focus:bg-gray-700">
          <a className='w-full h-full flex justify-center justify-items-center items-center rounded-full' href="/"><img className='w-[24px] h-[24px]' src={plus} alt="플러스" /></a>
      </div>
    </>
  )
}

export default Circlebutton
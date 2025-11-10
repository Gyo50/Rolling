import React from 'react'
import Emoji from '../../img/add-24.svg';


function IconButton() {
  return (
    <>
    <button className="flex items-center justify-center justify-items-center gap-1 bg-white border border-gray-300 rounded-md w-[88px] h-[36px]
    disabled:bg-gray-300 disabled:border-gray-300 disabled:text-white
    hover:bg-gray-100
    active:bg-gray-100 active:border-gray-300
    focus:border-gray-500
    enabled:border-gray-300">
          <img src={Emoji} alt="이모지"/>
          <span className="text-16-regular text-gray-900 pl-1">추가</span>
    </button>
    </>
  );
}

export default IconButton;
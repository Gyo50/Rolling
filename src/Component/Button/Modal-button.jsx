import React from 'react'

function Modalbutton({ text = "버튼",onClick, disabled = false }) {

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-[120px] h-[40px] bg-purple-600 rounded-md text-16-regular text-white 
      hover:bg-purple-700 
      disabled:bg-gray-300 
      active:bg-purple-800 
      focus:bg-purple-800"
    >
      {text}
    </button>
  )
}

export default Modalbutton
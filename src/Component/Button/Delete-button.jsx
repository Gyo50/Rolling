import React from "react";

function Deletebutton({ text = "버튼", disabled = false }) {

  return (
    <>
      <button
        disabled={disabled}
        className="w-[92px] h-[39px] bg-purple-500 rounded-md text-16-regular text-white 
        hover:bg-purple-700 
        disabled:bg-gray-300 
        active:bg-purple-800 
        focus:bg-purple-800"
      >
        {text}
      </button>
    </>
  );
}

export default Deletebutton;

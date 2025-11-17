import React from "react";
import { useNavigate } from "react-router-dom";

function PrimaryPc({ text = "버튼", to = "/", disabled = false, onClick }) {
  const navigate = useNavigate();

  const handleClick = (event) => {
    if (disabled) return;
    if (onClick) {
      onClick(event);
    }
    if (to && to !== "/" && typeof to === 'string') {
      navigate(to);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className="w-[100%] h-[56px] bg-purple-500 rounded-xl text-18-bold text-white 
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

export default PrimaryPc;

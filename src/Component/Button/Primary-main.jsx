import React from "react";
import { useNavigate } from "react-router-dom";

function PrimaryMain({ text = "생성하기", onClick, to = "/", disabled = false }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    // ✅ 1) 부모에서 onClick이 전달되면 먼저 실행
    if (onClick) {
      onClick(e);
    }

    // ✅ 2) to가 있을 때만 navigate 실행
    if (!disabled && to) {
      navigate(to);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled}
        className="w-[320px] md:w-[720px] h-[56px] bg-purple-500 rounded-xl text-18-bold text-white
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

export default PrimaryMain;

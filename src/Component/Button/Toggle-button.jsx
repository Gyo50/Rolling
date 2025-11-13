import React from "react";

function ToggleButton({ active = 'color', onChange }) {
  const handleChange = (value) => {
    if (typeof onChange === 'function') {
      onChange(value) // 외부에서 상태를 제어할 수 있도록 선택값 전달
    }
  }

  return (
    <div className="relative w-[244px] h-[40px] flex bg-gray-100 rounded-md overflow-hidden">
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-white border-[2px] border-purple-600 rounded-md transition-transform duration-300 ease-in-out
          ${active === "image" ? "translate-x-full" : "translate-x-0"}`}
      ></div>
      <button
        className={`relative w-1/2 h-full text-16-bold z-10 transition-colors duration-300
          ${active === "color" ? "text-purple-700" : "text-gray-500"}`}
        onClick={() => handleChange("color")}
        type="button"
      >
        컬러
      </button>
      <button
        className={`relative w-1/2 h-full text-16-bold z-10 transition-colors duration-300
          ${active === "image" ? "text-purple-700" : "text-gray-500"}`}
        onClick={() => handleChange("image")}
        type="button"
      >
        이미지
      </button>
    </div>
  );
}

export default ToggleButton;

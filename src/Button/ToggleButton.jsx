import React, { useState } from "react";


function ToggleButton() {
  const [active, setActive] = useState("color");

  return (
    <div className="relative w-[244px] h-[40px] flex bg-gray-100 rounded-md overflow-hidden">
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-white border-[2px] border-purple-600 rounded-md transition-transform duration-300 ease-in-out
          ${active === "image" ? "translate-x-full" : "translate-x-0"}`}
      ></div>
      <button
        className={`relative w-1/2 h-full text-16-bold z-10 transition-colors duration-300
          ${active === "color" ? "text-purple-700" : "text-gray-500"}`}
        onClick={() => setActive("color")}
      >
        컬러
      </button>
      <button
        className={`relative w-1/2 h-full text-16-bold z-10 transition-colors duration-300
          ${active === "image" ? "text-purple-700" : "text-gray-500"}`}
        onClick={() => setActive("image")}
      >
        이미지
      </button>
    </div>
  );
}

export default ToggleButton;

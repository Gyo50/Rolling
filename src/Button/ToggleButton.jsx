import React from "react";

function ToggleButton() {
  return (
    <>
      <div className="w-[244px] h-[40px] flex items-center">
        <div className="w-[122px] h-[40px] flex justify-center items-center border border-gray-200">
          <button className="w-full h-full px-4 py-[7px] text-16-bold text-purple-700 bg-gray-100 rounded flex justify-center items-center">
            컬러
          </button>
        </div>
        <div className="w-[122px] h-[40px] flex justify-center items-center border border-gray-200">
          <button className="w-full h-full px-4 py-[7px] text-16-bold text-gray-500 bg-gray-50 rounded flex justify-center items-center">
            이미지
          </button>
        </div>
      </div>
    </>
  );
}

export default ToggleButton;

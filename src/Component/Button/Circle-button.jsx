import React from "react";
import plus from "../../img/plus.svg";

function Circlebutton() {
  return (
    <>
      <button
        tabIndex={-1}
        className="w-[56px] h-[56px] flex justify-center items-center bg-gray-500 rounded-full group-hover:bg-gray-600 disabled:bg-gray-300  group-active:bg-gray-700 
        group-focus:bg-gray-700"
      >
        <img className="w-[24px] h-[24px]" src={plus} alt="플러스" />
      </button>
    </>
  );
}

export default Circlebutton;

import React from "react";
import Circlebutton from "../../Component/Button/Circle-button";

// 카드 추가 컴포넌트
function AddCard() {
  return (
    <>
      <div
        tabIndex="0"
        className="
          w-full
          h-[230px] sm:h-[280px]
          rounded-[16px]
          p-[28px_24px_24px_24px]
          shadow-[0_2px_13px_rgba(0,0,0,0.08)]
          bg-white
          flex justify-center items-center
          group
        "
      >
        <div
          className="
            w-[56px] h-[56px]
            flex justify-center items-center
          "
        >
          <Circlebutton />
        </div>
      </div>
    </>
  );
}

export default AddCard;

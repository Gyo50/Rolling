import React from "react";
import DeleteButton from "../Button/Delete-button";

// 카드 컴포넌트
function Card() {
  return (
    <>
      <div
        className="
          w-[384px] h-[280px]
          rounded-[16px]
          p-[28px_24px_24px_24px]
          shadow-[0_2px_13px_rgba(0,0,0,0.08)]
          bg-white
          flex flex-col
          relative
        "
      >
        <div
          className="
            flex justify-between
            pb-4
            border-b border-[rgba(238,238,238,1)]
          "
        >
          <div className="flex flex-wrap">
            <img
              className="w-14 h-14 rounded-full"
              src="https://entertainimg.kbsmedia.co.kr/cms/uploads/PERSON_20220112081105_4217f0cc8e5e82a908647d8e1de448a5.jpg"
              alt="프로필 이미지"
            />

            <div className="flex flex-col gap-[5px] pl-[10px]">
              <div className="text-20-regular text-black">
                From.&nbsp;<span className="text-20-bold text-black">남주혁</span>
              </div>

              <div
                className="
                w-[41px] h-5
                text-[14px] text-purple-600
                rounded-[5px] bg-purple-100
                px-[5px]
                flex items-center justify-center
              "
              >
                동료
              </div>
            </div>
          </div>
          <DeleteButton />
        </div>

        <div
          className="
            w-[336px] h-[106px]
            text-[18px] leading-[1.5]
            mt-4
            text-grayscale-600
          "
        >
          소원아 생일 축하해~~~~!
        </div>

        <div
          className="
            text-[12px] text-grayscale-400
            absolute bottom-6 left-6
          "
        >
          2023.01.29
        </div>
      </div>
    </>
  );
}

export default Card;

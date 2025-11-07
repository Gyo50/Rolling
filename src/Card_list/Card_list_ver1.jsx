import React from 'react';
import '../index.css';
import profile01 from './assets/profile01.svg';
import profile02 from './assets/profile02.svg';
import profile03 from './assets/profile03.svg';
import pattern01 from './assets/pattern01.svg';
/*import pattern02 from './assets/pattern02.svg';
import pattern03 from './assets/pattern03.svg';
import pattern04 from './assets/pattern04.svg';*/

/* 색깔 배경(보라색ver ) */
function CardList() {
  return (
    <>
      <div
        className="
          relative overflow-hidden
          w-[275px] h-[260px] rounded-[16px] box-border
          pt-[30px] pr-6 pb-5 pl-6
          bg-[rgba(220,185,255,0.4)]
          border border-[rgba(128,128,128,0.2)]
          shadow-[0_2px_13px_rgba(0,0,0,0.08)]
        "
      >
        <img
          className="absolute right-0 bottom-[-10px] pointer-events-none z-0"
          src={pattern01}
          alt="pattern01"
        />

        <div className="flex flex-col gap-3 z-[1] relative">
          <div className="text-[24px] font-bold">To.Sowon</div>

          <div className="flex items-center">
            <img
              className="w-7 h-7 rounded-full border border-white object-cover relative ml-0"
              src={profile01}
              alt="profile01"
            />
            <img
              className="w-7 h-7 rounded-full border border-white object-cover relative ml-[-10px]"
              src={profile02}
              alt="profile02"
            />
            <img
              className="w-7 h-7 rounded-full border border-white object-cover relative ml-[-10px]"
              src={profile03}
              alt="profile03"
            />
            <span
              className="
                inline-flex items-center justify-center
                w-[33px] h-7 py-[7px] px-[5px]
                rounded-full bg-white text-[12px] font-semibold text-gray-500
                ml-[-10px] relative z-0
              "
            >
              +27
            </span>
          </div>

          <div className="mb-5 text-[16px] leading-[1.5]">
            <span className="font-bold">30</span>명이 작성했어요!
          </div>
        </div>

        <div
          className="
            flex items-end
            mt-[17px] pt-[18px]
            border-t border-[rgba(128,128,128,0.4)]
            absolute z-[1]
          "
        >
          <div
            className="
              w-[66px] h-9 mr-2
              bg-black/60
              flex justify-center items-center
              rounded-[32px] px-3 py-2
              text-white
            "
          >
            👍 20
          </div>
          <div
            className="
              w-[66px] h-9 mr-2
              bg-black/60
              flex justify-center items-center
              rounded-[32px] px-3 py-2
              text-white
            "
          >
            😍 12
          </div>
          <div
            className="
              w-[66px] h-9
              bg-black/60
              flex justify-center items-center
              rounded-[32px] px-3 py-2
              text-white
            "
          >
            😢 7
          </div>
        </div>
      </div>
    </>
  );
}

export default CardList;
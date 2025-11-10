import React from 'react';
import profile01 from './assets/profile01.svg';
import profile02 from './assets/profile02.svg';
import profile03 from './assets/profile03.svg';

function CardList2() {
  return (
    <>
      <div
        className="
          relative overflow-hidden
          w-[275px] h-[260px] rounded-[16px] box-border
          pt-[30px] pr-6 pb-5 pl-6
          bg-white
          border border-grayscale-500/20
          shadow-[0_2px_13px_rgba(0,0,0,0.08)]
          bg-cover bg-center
        "
        style={{
          backgroundImage:
            "url('https://mblogthumb-phinf.pstatic.net/MjAyMTAzMDVfOTYg/MDAxNjE0OTU1MTgyMzYz.ozwJXDtUw0V_Gniz6i7qgDOkNs09MX-rJdCcaw6AAeAg.DZivXhGnQDUUx7kgkRXNOEI0DEltAo6p9Jk9SDBbxRcg.JPEG.sosohan_n/IMG_3725.JPG?type=w800')",
        }}
      >
        <div className="flex flex-col gap-3 relative z-[1]">
          <div className="text-24-bold text-white">To.Sowon</div>

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
                rounded-full bg-white text-12-regular text-grayscale-500
                ml-[-10px] relative z-0
              "
            >
              +27
            </span>
          </div>

          <div className="mb-5 text-white text-16-regular leading-[1.5]">
            <span className="text-16-bold">30</span>명이 작성했어요!
          </div>
        </div>

        <div
          className="
            flex items-end
            mt-[17px] pt-[18px]
            border-t border-grayscale-500/40
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
            👍&nbsp;20
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
            😍&nbsp;12
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
            😢&nbsp;7
          </div>
        </div>
      </div>
    </>
  );
}

export default CardList2;

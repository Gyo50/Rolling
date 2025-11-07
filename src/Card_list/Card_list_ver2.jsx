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
          bg-[rgba(220,185,255,0.4)]
          border border-[rgba(128,128,128,0.2)]
          shadow-[0_2px_13px_rgba(0,0,0,0.08)]
          bg-cover bg-center
        "
        style={{
          backgroundImage:
            "url('https://mblogthumb-phinf.pstatic.net/MjAyMTAzMDVfOTYg/MDAxNjE0OTU1MTgyMzYz.ozwJXDtUw0V_Gniz6i7qgDOkNs09MX-rJdCcaw6AAeAg.DZivXhGnQDUUx7kgkRXNOEI0DEltAo6p9Jk9SDBbxRcg.JPEG.sosohan_n/IMG_3725.JPG?type=w800')",
        }}
      >
        <div className="flex flex-col gap-3 relative z-[1]">
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
            <span className="font-bold">30명</span>이 작성했어요!
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
              w-[65px] h-9 mr-2
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
              w-[65px] h-9 mr-2
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
              w-[65px] h-9
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

export default CardList2;

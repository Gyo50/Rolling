import React from "react";
import Header from "../Component/Header/Header";
import introImg01 from "../img/img_intro01.svg";
import introImg02 from "../img/img_intro02.png";
import PrimaryMain from "../Component/Button/Primary-main";

export default function MainPage() {
  return (
    <>
      <Header />
      <div className="max-w-[1200px] m-auto mt-[55px] p-[0_24px_0_24px]">
        <div className="flex p-[40px] rounded-[16px] bg-surface items-center flex-shrink-0 justify-between flex-col overflow-hidden md:flex-row md:h-[324px] md:pl-[60px] md:p-[0]">
          <div className="flex flex-col mb-[36px] w-full md:mb-[0] md:w-[auto]">
            <span className="bg-purple-600 text-white text-14-bold h-[28px] px-[12px] rounded-[32px] self-start inline-flex items-center sm:h-[32px]">
              Point. 01
            </span>
            <p className="inline-flex self-start text-18-bold text-gray-900 mt-[16px] mb-[8px] sm:text-24-bold">
              누구나 손쉽게, 온라인
              <br className="hidden md:block" />
              롤링 페이퍼를 만들 수 있어요.
            </p>
            <p className="text-gray-500 text-15-bold sm:text-18-bold">
              로그인 없이 자유롭게 만들어요.
            </p>
          </div>
          <div className="w-[720px] overflow-hidden whitespace-nowrap">
            <div className="inline-flex animate-scrollX md:animate-none md:translate-x-0">
              <img src={introImg01} alt="" className="w-full" />
              <img src={introImg01} alt="" className="w-full md:hidden" />
            </div>
          </div>
        </div>
        <div className="flex flex-col p-[40px] rounded-[16px] bg-surface items-center flex-shrink-0 mt-[30px] overflow-hidden justify-between md:flex-row-reverse md:h-[324px] md:p-[0]">
          <div className="flex mb-[36px] flex-col flex-shrink-0 w-full md:pl-[40px] md:pr-[60px] lg:pr-[192px] md:mb-[0] md:w-[auto]">
            <span className="bg-purple-600 text-white text-14-bold h-[28px] px-[12px] rounded-[32px] self-start inline-flex items-center sm:h-[32px]">
              Point. 02
            </span>
            <p className="inline-flex self-start text-18-bold text-gray-900 mt-[16px] mb-[8px] sm:text-24-bold">
              서로에게 이모지로 감정을
              <br className="hidden md:block" />
              표현해보세요.
            </p>
            <p className="text-gray-500 text-15-bold sm:text-18-bold">
              롤링 페이퍼에 이모지를 추가할 수 있어요.
            </p>
          </div>
          <div className="md:pl-[125px] w-[420px] md:w-[auto]">
            <img src={introImg02} alt="" className="w-full" />
          </div>
        </div>
      </div>
      <div className="m-[72px_0_24px_0] flex justify-center md:m-[53px_0_174px_0]">
        <PrimaryMain text="구경해보기" to="/list" />
      </div>
    </>
  );
}

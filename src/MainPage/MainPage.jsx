import React from "react";
import Header from "../Component/Header/Header";
import introImg01 from "../img/img_intro01.svg";
import introImg02 from "../img/img_intro02.jpg";
import PrimaryMain from "../Component/Button/Primary-main";

export default function MainPage() {
  return (
    <>
      <Header />
      <div className="max-w-[1200px] m-auto mt-[55px] p-[0_24px_0_24px]">
        <div className="flex flex-row items-center justify-between p-[40px] rounded-[16px] bg-surface flex-shrink-0 overflow-hidden h-[324px] pl-[60px] max-xt:flex-col max-xt:h-auto max-xt:p-[24px]">
          <div className="flex flex-col w-auto max-xt:w-full max-xt:mb-[24px] flex-shrink-0">
            <span className="bg-purple-600 text-white text-16-bold h-[32px] px-[14px] rounded-[32px] self-start inline-flex items-center max-xt:text-14-bold max-xt:h-[28px]">
              Point. 01
            </span>
            <p className="inline-flex self-start text-24-bold text-gray-900 mt-[16px] mb-[8px] max-xt:text-18-bold">
              누구나 손쉽게, 온라인
              <br className="max-xt:hidden" />
              롤링 페이퍼를 만들 수 있어요.
            </p>
            <p className="text-gray-500 text-18-bold max-xt:text-15-bold">
              로그인 없이 자유롭게 만들어요.
            </p>
          </div>

          <div className="w-[720px] overflow-hidden whitespace-nowrap max-xt:w-full">
            <div className="inline-flex translate-x-0 max-xt:animate-scrollX">
              <img src={introImg01} alt="" className="w-full" />
              <img src={introImg01} alt="" className="w-full" />
            </div>
          </div>
        </div>

        <div className="flex flex-row-reverse items-center justify-between mt-[30px] p-[0] rounded-[16px] bg-surface flex-shrink-0 overflow-hidden h-[324px] max-xt:flex-col max-xt:h-auto max-xt:p-[24px]">
          <div className="flex flex-col w-auto pr-[10%] max-xt:pr-[0] max-xt:w-full max-xt:mb-[24px]">
            <span className="bg-purple-600 text-white text-16-bold h-[32px] px-[14px] rounded-[32px] self-start inline-flex items-center max-xt:text-14-bold max-xt:h-[28px]">
              Point. 02
            </span>
            <p className="inline-flex self-start text-24-bold text-gray-900 mt-[16px] mb-[8px] max-xt:text-18-bold flex-shrink-0">
              서로에게 이모지로 감정을
              <br className="max-xt:hidden" />
              표현해보세요.
            </p>
            <p className="text-gray-500 text-18-bold max-xt:text-15-bold">
              롤링 페이퍼에 이모지를 추가할 수 있어요.
            </p>
          </div>

          <div className="pl-[10%] w-auto max-xt:pl-[0] max-xt:w-[420px">
            <img src={introImg02} alt="" className="w-full" />
          </div>
        </div>
      </div>

      <div className="m-[72px_0_24px_0] flex justify-center max-ta:m-[53px_0_174px_0]">
        <PrimaryMain text="구경해보기" to="/list" />
      </div>
    </>
  );
}

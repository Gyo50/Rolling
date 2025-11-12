import HeaderNobutton from "../Component/Header/HeaderNobutton";
import React from "react";
import Input from "../Component/Text_Field/Input.jsx";
import ToggleButton from "../Component/Button/Toggle-button.jsx";
import Option from "../Component/Option/Option.jsx";
import PrimaryMain from "../Component/Button/Primary-main.jsx";

function CreatePostPage() {
  return (
    <>
      <HeaderNobutton />
      <div
        className="
          w-full max-w-[768px]
          mx-auto max-ta:mt-[57px] max-xt:mt-[49px] max-xs:mt-[50px]
          px-[24px] text-left
          flex flex-col items-center
        "
      >
        <div className="w-full max-w-[720px]">

          <div className="w-full max-[360px]:w-[320px]">
            <div className="mb-[12px] text-gray-900 text-24-bold">To.</div>
            <Input />
          </div>

          <div className="w-full max-[360px]:w-[320px] max-ta:mt-[50px] max-xt:mt-[52px] max-xs:mt-[48px] mb-[24px] flex flex-col items-start">
            <div className="text-gray-900 text-24-bold">
              배경화면을 선택해 주세요.
            </div>
            <div className="text-gray-500 text-16-regular max-xs:mb-0">
              컬러를 선택하거나, 이미지를 선택할 수 있습니다.
            </div>
          </div>


          <div className="w-[168px] max-[360px]:w-[320px] max-ta:mb-[45px] max-xt:mb-[40px] max-xs:mb-[28px] flex flex-col items-start">
            <ToggleButton />
          </div>

          <div className="w-full mb-[48px] flex flex-col items-center">
            <Option />
          </div>
        </div>

  
        <div className="max-ta:mt-[45px] max-xt:mt-[316px] max-xs:mt-[58px] w-full h-full py-[24px] flex justify-center items-center md:pb-6">
          <PrimaryMain />
        </div>
      </div>
    </>
  );
}

export default CreatePostPage;

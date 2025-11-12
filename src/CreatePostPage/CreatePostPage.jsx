import HeaderNobutton from "../Component/Header/HeaderNobutton";
import React, { useState } from "react";
import Input from "../Component/Text_Field/Input.jsx";
import ToggleButton from "../Component/Button/Toggle-button.jsx";
import Option from "../Component/Option/Option.jsx";
import PrimaryMain from "../Component/Button/Primary-main.jsx";

function CreatePostPage() {

  const [name, setName] = useState("");

  const handleNameChange = (value) => {
    setName(value);
  };


  return (
    <>
      <HeaderNobutton />
      <div
        className="
          w-full max-w-[768px] mt-[57px]
          mx-auto px-[24px] text-left
          flex flex-col items-start
          max-ta:mt-[57px] max-xt:mt-[49px] max-xs:mt-[50px]
        "
      >
          <div className="w-full max-w-[768px]">
            <div className="mb-[12px] text-gray-900 text-24-bold flex flex-col items-start">To.</div>
            <Input onChangeValue={handleNameChange}/>
          </div>

          <div className="mb-[24px] mt-[50px] max-ta:mt-[50px] max-xt:mt-[52px] max-xs:mt-[48px]">
            <div className="text-gray-900 text-24-bold">
              배경화면을 선택해 주세요.
            </div>
            <div className="text-gray-500 text-16-regular">
              컬러를 선택하거나, 이미지를 선택할 수 있습니다.
            </div>
          </div>


          <div className="w-[244px] mb-[45px] max-ta:mb-[45px] max-xt:mb-[40px] max-xs:mb-[28px]">
            <ToggleButton />
          </div>

          <div className="w-full mb-[48px]">
            <Option />
          </div>
        
        <div className={`w-full h-full py-[24px] mt-[316px] flex justify-center items-center max-ta:mt-[45px] max-xt:mt-[316px] max-xs:mt-[58px] `}>
          <PrimaryMain disabled={!name}/>
        </div>
      </div>
    </>
  );
}

export default CreatePostPage;

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
        <div className="
            w-full max-w-[768px] h-[646px] mx-auto mt-[57px]
            p-[45px 24px] mb-[312px] text-left
            flex flex-col items-center
           "
        >
         <div className="w-[320px] md:w-[720px] flex flex-col items-start">
            <div className="w-[320px] md:w-[720px]">    
                <div className="mb-[12px] text-gray-900 text-24-bold">To.</div>
                <Input />
            </div>

            <div className="w-[320px] md:w-[720px] mt-[50px] mb-[24px] flex flex-col items-start">
                <div className="text-gray-900 text-24-bold">배경화면을 선택해 주세요.</div>
                <div className="mb-[24px] text-gray-500 text-16-regular">컬러를 선택하거나, 이미지를 선택할 수 있습니다.</div>
            </div>
            
            <div className="w-[320px] md:w-[720px] mb-[45px] flex flex-col items-start">
                <ToggleButton />
            </div>

            <div className="w-[320px] md:w-[720px] mb-[45px] flex flex-col items-start">
                <Option />
            </div>
         </div>
            <div className="py-[24px] px-[20px] md:p-[24px] flex justify-center items-center">
                <PrimaryMain />
            </div>
        </div>
      </>
    );
}

export default CreatePostPage;

// 만들면서 느낀 개선점: 헤더 부분 반응형으로 만들어야할 듯?
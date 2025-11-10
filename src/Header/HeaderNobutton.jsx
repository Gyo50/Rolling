import React from "react";
import RollingIcon from "../img/logo.svg";
// import Deletebutton from "../Button/Delete-button"

function HeaderNobutton() {
  return (
    <>
      <div className="border-b border-gray-200">
        <header className="bg-white sticky top-0 z-50 max-w-[1119px] h-[64px] mx-auto">
          <div className="w-full h-full flex items-center justify-between">
            {/* Rolling 로고 영역 */}
            <div className="flex items-center justify-center justify-items-center z-60 h-[30px]">
              {/* 로고 아이콘 */}
              <a href="/">
                <img src={RollingIcon} alt="Rolling 로고" />
              </a>
            </div>
            {/* <Deletebutton text="삭제하기"/> */}
          </div>
        </header>
      </div>
    </>
  );
}

export default HeaderNobutton;

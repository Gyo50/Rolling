import React from "react"
import { Link } from "react-router-dom"
import RollingIcon from "../../img/logo.svg"

function Header(hideCreateButton = false) {
  return (
    <>
      <div className="border-b border-gray-200">
        <header className="bg-white sticky top-0 z-50 max-w-[1200px] h-[64px] mx-auto">
          {/* 
            기본: 좌우 여백 없음
            태블릿(md) 이상: 좌우 여백 px-[24px] 적용 
          */}
          <div className="w-full h-full flex items-center justify-between px-[24px]">
            {/* Rolling 로고 영역 */}
            <div className="flex items-center justify-center justify-items-center z-60 h-[30px]">
              {/* 로고 아이콘 */}
              <Link to="/">
                <img src={RollingIcon} alt="Rolling 로고" />
              </Link>
            </div>

            {/* "롤링 페이퍼 만들기" 버튼 */}
            <div>
              <Link
                to="/post"
                className="border border-grayscale-300 bg-white rounded-lg text-16-bold h-[42px] w-[149px] hover:bg-gray-100 flex items-center justify-center"
              >
                롤링 페이퍼 만들기
              </Link>
            </div>
          </div>
        </header>
      </div>
    </>
  )
}

export default Header
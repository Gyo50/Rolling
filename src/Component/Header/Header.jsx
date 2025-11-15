import React from "react"
import { Link } from "react-router-dom"
import RollingIcon from "../../img/logo.svg"

function Header({ hideCreateButton = false }) {
  return (
    <>
      <div className="w-full border-b border-gray-200">
        <header className="bg-white sticky top-0 z-50 max-w-[1200px] h-[64px] mx-auto max-xt:max-w-[720px]">
          <div className="w-full h-full px-[24px] flex items-center justify-between">
            
            {/* Rolling 로고 영역 */}
            <div className="flex items-center justify-center justify-items-center z-60 h-[30px]">
              <Link to="/">
                <img src={RollingIcon} alt="Rolling 로고" />
              </Link>
            </div>

            {/* "롤링 페이퍼 만들기" 버튼 */}
            {!hideCreateButton && ( // hideCreateButton prop 사용
              <div>
                <Link
                  to="/post"
                  className="border border-grayscale-300 bg-white rounded-lg text-16-bold h-[42px] w-[149px] hover:bg-gray-100 flex items-center justify-center"
                >
                  롤링 페이퍼 만들기
                </Link>
              </div>
            )}
          </div>
        </header>
      </div>
    </>
  )
}

export default Header
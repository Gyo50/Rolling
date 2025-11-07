import React from 'react';
import { ReactComponent as RollingIcon } from './img/logo.svg';

function Header() {
  return (
    <>
      <header className='bg-white sticky top-0 z-50'>
        <div className="flex items-center justify-between px-6">
          {/* Rolling 로고 영역 */}
          <div className='flex items-center space-x-2'>
            {/* 로고 아이콘 */}
            <RollingIcon className="w-6 h-6" />
            {/* 로고 텍스트 */}
            <span className="text-xl font-bold text-gray-900">Rolling</span>
          </div>

          {/* "롤링 페이퍼 만들기" 버튼 영역 */}
          <button
            className="px-4 py-2 bg-white rounded-lg">
            롤링 페이퍼 만들기
          </button>
        </div>
      </header>
    </>
  );
}

export default Header;
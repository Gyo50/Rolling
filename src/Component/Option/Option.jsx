import React from 'react';
import Check from '../../img/Check.svg'; 

const COLOR_ITEMS = [
  { id: 0, value: 'beige', className: 'bg-yellow-200' },
  { id: 1, value: 'purple', className: 'bg-purple-200' },
  { id: 2, value: 'blue', className: 'bg-blue-200' },
  { id: 3, value: 'green', className: 'bg-green-200' }
]

const CheckIcon = () => (
  // 체크 표시
  <div className="w-[44px] h-[44px] rounded-full bg-gray-500 flex items-center justify-center">
    <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center">
      <img src={Check} alt="체크 표시" />
    </div>
  </div>
);

function Option({ activeColor = 'beige', onChange }) {
  const handleBoxClick = (colorValue) => {
    if (typeof onChange === 'function') {
      onChange(colorValue) // 부모가 선택한 색상 값을 제어할 수 있도록 전달
    }
  };

  return (
    // 전체 컨테이너
    <div className="grid grid-cols-2 gap-[4%] md:grid-cols-4 md:gap-4 w-full justify-center items-center">
      {COLOR_ITEMS.map((item) => (
        <div 
          key={item.id}
          className={`shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] aspect-square w-full md:h-[168px] ${item.className} rounded-xl cursor-pointer flex items-center justify-center transition-all duration-200`}
          onClick={() => handleBoxClick(item.value)}
        >
          {/* 박스 클릭 시 체크 아이콘이 뜨도록 */}
          {activeColor === item.value && <CheckIcon />} 
        </div>
      ))}
    </div>
  );
}

export default Option;

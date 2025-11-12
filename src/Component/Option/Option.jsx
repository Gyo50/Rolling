<<<<<<< HEAD
import React from 'react';
import Check from '../../img/Check.svg'; 

const COLOR_ITEMS = [
  { id: 0, value: 'beige', className: 'bg-yellow-200' },
  { id: 1, value: 'purple', className: 'bg-purple-200' },
  { id: 2, value: 'blue', className: 'bg-blue-200' },
  { id: 3, value: 'green', className: 'bg-green-200' }
]
=======
import React, { useState } from "react";
import Check from "../../img/Check.svg";
>>>>>>> RecipientPage

const CheckIcon = () => (
  // 체크 표시
  <div className="w-[44px] h-[44px] rounded-full bg-gray-500 flex items-center justify-center">
    <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center">
      <img src={Check} alt="체크 표시" />
    </div>
  </div>
);

<<<<<<< HEAD
function Option({ activeColor = 'beige', onChange }) {
  const handleBoxClick = (colorValue) => {
    if (typeof onChange === 'function') {
      onChange(colorValue) // 부모가 선택한 색상 값을 제어할 수 있도록 전달
=======
function Option({ onChangeValue }) {
  const [selectedBox, setSelectedBox] = useState(0);

  const boxData = [
    { id: 0, color: "yellow" },
    { id: 1, color: "purple" },
    { id: 2, color: "blue" },
    { id: 3, color: "green" },
  ];

  const handleBoxClick = (boxId, color) => {
    const newSelection = selectedBox === boxId ? null : boxId;
    setSelectedBox(newSelection);

    // ✅ 부모로 color 값만 전달
    if (onChangeValue) {
      onChangeValue(newSelection !== null ? color : null);
>>>>>>> RecipientPage
    }
  };

  return (
    // 전체 컨테이너
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full justify-center items-center">
<<<<<<< HEAD
      {COLOR_ITEMS.map((item) => (
        <div 
          key={item.id}
          className={`w-[154px] md:w-[168px] h-[154px] md:h-[168px] ${item.className} rounded-xl cursor-pointer flex items-center justify-center transition-all duration-200`}
          onClick={() => handleBoxClick(item.value)}
        >
          {/* 박스 클릭 시 체크 아이콘이 뜨도록 */}
          {activeColor === item.value && <CheckIcon />} 
=======
      {boxData.map((box) => (
        <div
          key={box.id}
          // 클래스 이름을 동적으로 변경하기 위해 백틱으로 감싸는 템플릿 리터럴 문법
          className={`w-[154px] md:w-[168px] h-[154px] md:h-[168px] ${box.color} rounded-xl cursor-pointer flex items-center justify-center transition-all duration-200`}
          onClick={() => handleBoxClick(box.id, box.color)}
        >
          {/* 박스 클릭 시 체크 아이콘이 뜨도록 */}
          {selectedBox === box.id && <CheckIcon />}
>>>>>>> RecipientPage
        </div>
      ))}
    </div>
  );
}

export default Option;

import React, { useState } from 'react';
import Check from '../../img/Check.svg'; 

const CheckIcon = () => (
  // 체크 표시
  <div className="w-[44px] h-[44px] rounded-full bg-gray-500 flex items-center justify-center">
    <div className='w-[24px] h-[24px] rounded-full flex items-center justify-center'>
      <img src={Check} alt="체크 표시" />

    </div>
  </div>
);

function Option() {
  const [selectedBox, setSelectedBox] = useState(0);

  const boxData = [
    { id: 0, color: 'bg-yellow-200' },
    { id: 1, color: 'bg-purple-200' },
    { id: 2, color: 'bg-blue-200' },
    { id: 3, color: 'bg-green-200' },
  ];

  const handleBoxClick = (boxId) => {
    // 선택 상태 토글
    setSelectedBox(selectedBox === boxId ? null : boxId);
  };

  return (
    // 전체 컨테이너
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full flex justify-center items-center">
      
      {boxData.map((box) => (
        <div 
          key={box.id}
          // 클래스 이름을 동적으로 변경하기 위해 백틱으로 감싸는 템플릿 리터럴 문법
          className={`w-[154px] md:w-[168px] h-[154px] md:h-[168px] ${box.color} rounded-xl cursor-pointer flex items-center justify-center transition-all duration-200`}
          onClick={() => handleBoxClick(box.id)}
        >
          {/* 박스 클릭 시 체크 아이콘이 뜨도록 */}
          {selectedBox === box.id && <CheckIcon />} 
        </div>
      ))}
    </div>
  );
}

export default Option;
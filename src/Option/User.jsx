import React from 'react';
import UserAvatar from './img/User.svg';

function User() {
  return (
    <div className="w-[80px] h-[80px] rounded-full bg-gray-300 flex items-center justify-center p-[24px]">
      <img 
        src={UserAvatar} 
        alt="사용자 아바타" 
        className="w-[30.16px] h-[32px]"
      />
    </div>
  );
}

export default User;
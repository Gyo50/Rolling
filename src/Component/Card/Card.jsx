import React from "react";
<<<<<<< HEAD
import Trashbutton from "../../Component/Button/Trash-button";
=======
import DeleteButton from "../Button/Delete-button";
>>>>>>> RecipientPage

function Card({
  senderName,
  profileImageURL,
  relationship,
  content,
  date,
  onClick,
  onDeleteClick,
}) {
  return (
    <div
      onClick={onClick}
      className="
        w-full
        h-[230px] sm:h-[280px]
        rounded-[16px]
        p-[20px_18px_18px_18px] sm:p-[28px_24px_24px_24px]
        shadow-[0_2px_13px_rgba(0,0,0,0.08)]
        bg-white
        flex flex-col
        relative
        cursor-pointer
        hover:shadow-lg transition
      "
    >
      <div
        className="
          flex justify-between
          pb-3 sm:pb-4
          border-b border-[rgba(238,238,238,1)]
        "
      >
        <div className="flex flex-wrap">
          <img
            className="
              w-10 h-10 sm:w-14 sm:h-14
              rounded-full
            "
            src={profileImageURL}
            alt={`${senderName} 프로필`}
          />

          <div className="flex flex-col gap-[3px] sm:gap-[5px] pl-[8px] sm:pl-[10px]">
            <div className="text-18-regular sm:text-20-regular text-black">
              From.&nbsp;
              <span className="text-16-bold sm:text-20-bold">{senderName}</span>
            </div>

            <div
              className="
                w-[41px] h-[20px]
                px-[4px]
                text-[12px] sm:text-[14px]
                text-purple-600
                rounded-[4px] sm:rounded-[5px]
                bg-purple-100
                flex items-center justify-center
              "
            >
              {relationship}
            </div>
          </div>
        </div>

        {/* 휴지통 버튼 클릭 시 삭제 모달 */}
        <div onClick={onDeleteClick}>
          <Trashbutton />
        </div>
      </div>

      <div
        className="
          text-15-regular sm:text-18-regular
          leading-[1.4] sm:leading-[1.5]
          mt-3 sm:mt-4
          text-grayscale-600
          flex-1
          overflow-hidden
          line-clamp-3 sm:line-clamp-4
        "
      >
        {content}
      </div>

      <div
        className="
          text-[11px] sm:text-[12px]
          text-grayscale-400
          absolute bottom-4 sm:bottom-6 left-4 sm:left-6
        "
      >
        {date}
      </div>
    </div>
  );
}

export default Card;

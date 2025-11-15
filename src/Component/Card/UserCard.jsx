import React from "react";

// 더미 데이터를 별도 관리 파일로 뺄지 여부 고민!!!!
export const defaultMessage = {
  sender: "이름",
  relationship: "관계",
  content: "메시지 내용",
  profileImageURL:
    "https://fastly.picsum.photos/id/311/200/200.jpg?hmac=CHiYGYQ3Xpesshw5eYWH7U0Kyl9zMTZLQuRDU4OtyH8",
  createdAt: "2025-11-11",
};

const RELATIONSHIP_COLORS = {
  친구: {
    bgColor: "bg-blue-100",
    textColor: "text-blue-500",
  },
  지인: {
    bgColor: "bg-beige-100",
    textColor: "text-beige-500",
  },
  동료: {
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
  },
  가족: {
    bgColor: "bg-green-100",
    textColor: "text-green-500",
  },
  default: {
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
  }
};


// 카드 컴포넌트
function UserCard({ message, onClick }) {
  const data = message || defaultMessage;
  const relationshipStyle = RELATIONSHIP_COLORS[data.relationship] || RELATIONSHIP_COLORS.default;

  return (
    <>
      <div
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
        onClick={onClick}
      >
        <div
          className="
            flex justify-between
            pb-4
            border-b border-[rgba(238,238,238,1)]
          "
        >
          <div className="flex flex-wrap">
            <img
              className="w-14 h-14 rounded-full"
              src={data.profileImageURL}
              alt="프로필 이미지"
            />

            <div className="flex flex-col gap-[5px] pl-[10px]">
              <div className="text-20-regular text-black">
                From.&nbsp;<span className="text-20-bold text-black">{data.sender}</span>
              </div>

              <div
                className={`
                  w-[41px] h-5
                  text-[14px]
                  rounded-[5px] 
                  px-[5px]
                  flex items-center justify-center
                  /* ⭐️ 동적 스타일 적용 */
                  ${relationshipStyle.textColor}
                  ${relationshipStyle.bgColor}
                `}
              >
                {data.relationship}
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            w-[336px] h-[106px]
            text-[18px] leading-[1.5]
            mt-4
            text-grayscale-600
          "
        >
          {data.content}
        </div>

        <div
          className="
            text-[12px] text-grayscale-400
            absolute bottom-6 left-6
          "
        >
          {data.createdAt}
        </div>
      </div>
    </>
  );
}

export default UserCard;
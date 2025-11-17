import React, { useMemo } from "react";

// 더미 데이터를 별도 관리 파일로 뺄지 여부 고민!!!!

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
  },
};

// 카드 컴포넌트
function UserCard({ message, onClick }) {
  const data = message;
  const relationshipStyle = RELATIONSHIP_COLORS[data.relationship] || RELATIONSHIP_COLORS.default;

  const decodedHtml = useMemo(() => {
    const raw = data.content || "";
    // 엔티티가 없다면 그대로 반환
    if (!/[&][lg]t;|&amp;|&#/.test(raw)) return raw;
    const doc = new DOMParser().parseFromString(raw, "text/html");
    return doc.documentElement.textContent || raw;
  }, [data.content]);

  // 2) 허용 태그만 남기고 나머지 태그 제거(스크립트/스타일 차단)
  const contentHtml = useMemo(() => {
    return decodedHtml.replace(/<(?!\/?(b|strong|i|em|u|p|br|span)\b)[^>]*>/gi, "");
  }, [decodedHtml]);

  return (
    <>
      <div
        className="
        w-full
        h-[280px]
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
          <div className="flex flex-wrap w-full">
            <img
              className="w-14 h-14 rounded-full"
              src={data.profileImageURL}
              alt="프로필 이미지"
            />

            <div className="flex flex-1 flex-col gap-[5px] pl-[10px] overflow-hidden">
              <div className="text-20-regular text-black truncate">
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
          className="h-[106px] break-all overflow-hidden text-ellipsis line-clamp-4
            text-[18px] leading-[1.5]
            mt-4
            text-grayscale-600
          "
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        >
        </div>

        <div
          className="
            text-[12px] text-grayscale-400
            bottom-6 left-6 mt-[15px]
            "
        >
          {data.createdAt}
        </div>
      </div>
    </>
  );
}

export default UserCard;

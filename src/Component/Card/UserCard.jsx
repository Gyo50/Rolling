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
        min-h-[280px]
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
            pb-3 sm:pb-4
            border-b border-[rgba(238,238,238,1)]
          "
        >
          <div className="flex flex-wrap w-full">
            <img
              className="w-10 h-10 sm:w-14 sm:h-14
              rounded-full"
              src={data.profileImageURL}
              alt="프로필 이미지"
            />

            <div className="flex flex-col gap-[3px] sm:gap-[5px] pl-[8px] sm:pl-[10px]">
              <div className="text-18-regular sm:text-20-regular text-black">
                From.&nbsp;<span className="text-16-bold sm:text-20-bold text-black">{data.sender}</span>
              </div>

              <div
                className={`
                  w-[41px] h-[20px]
                  px-[4px]
                  text-[12px] sm:text-[14px]
                  rounded-[4px] sm:rounded-[5px]
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
            text-15-regular sm:text-18-regular
            leading-[1.4] sm:leading-[1.5]
            mt-3 sm:mt-4
            text-gray-600
            overflow-hidden
            break-words
            line-clamp-6 sm:line-clamp-4
            flex-none
          "
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        >
        </div>

        <div
          className="
            text-[11px] sm:text-[12px]
            text-gray-400
            absolute bottom-4 sm:bottom-6 left-4 sm:left-6
            "
        >
          {data.createdAt}
        </div>
      </div>
    </>
  );
}

export default UserCard;

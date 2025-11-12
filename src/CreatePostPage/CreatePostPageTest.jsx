import HeaderNobutton from "../Component/Header/HeaderNobutton";
import React, { useState } from "react";
import Input from "../Component/Text_Field/Input.jsx";
import ToggleButton from "../Component/Button/Toggle-button.jsx";
import Option from "../Component/Option/Option.jsx";
import PrimaryMain from "../Component/Button/Primary-main.jsx";
import axios from "axios";

function CreatePostPage() {
  // ✅ 상태값 (필요한 데이터 관리)
  const [recipientId, setRecipientId] = useState(2); // 실제 id로 교체
  const [name, setname] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("green");
  const [loading, setLoading] = useState(false);

  // 아이디가 생성이 되면, 해당 생성된 롤링 페이지에서는 해당 id값을 url 파람값으로 넣어줘야 함.
  // 그리고 해당 롤링페이퍼 페이지를 공유하기 할 때, url값을 읽어서 주어야 함.
  const handlePost = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`https://rolling-api.vercel.app/20-4/recipients/`, {
        name,
        backgroundColor,
      });
      console.log("✅ 전송 성공:", res.data);
      alert("메시지 전송 성공!");
    } catch (err) {
      console.error("❌ 전송 실패:", err);
      alert("메시지 전송 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderNobutton />
      <div
        className="
            w-full max-w-[768px] h-[646px] mx-auto mt-[57px]
            p-[45px 24px] mb-[312px] text-left
            flex flex-col items-center
           "
      >
        <div className="w-[320px] md:w-[720px] flex flex-col items-start">
          <div className="w-[320px] md:w-[720px]">
            <div className="mb-[12px] text-gray-900 text-24-bold">테스트페이지 입니다.</div>
            <Input onChangeValue={setname} />
            {console.log(name)}
          </div>

          <div className="w-[320px] md:w-[720px] mt-[50px] mb-[24px] flex flex-col items-start">
            <div className="text-gray-900 text-24-bold">배경화면을 선택해 주세요.</div>
            <div className="mb-[24px] text-gray-500 text-16-regular">
              컬러를 선택하거나, 이미지를 선택할 수 있습니다.
            </div>
          </div>

          <div className="w-[320px] md:w-[720px] mb-[45px] flex flex-col items-start">
            <ToggleButton />
          </div>

          <div className="w-[320px] md:w-[720px] mb-[45px] flex flex-col items-start">
            <Option onChangeValue={setBackgroundColor} />
            {console.log(backgroundColor)}
          </div>
        </div>
        <div className="py-[24px] px-[20px] md:p-[24px] flex justify-center items-center">
          <PrimaryMain onClick={handlePost} />
        </div>
      </div>
    </>
  );
}

export default CreatePostPage;

// 만들면서 느낀 개선점: 헤더 부분 반응형으로 만들어야할 듯?

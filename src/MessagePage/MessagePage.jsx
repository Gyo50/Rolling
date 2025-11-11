// src/pages/Send.jsx
import React, { useState } from "react";
import Header from "../Component/Header/HeaderNobutton";
import Input from "../Component/Text_Field/Input";
import User from "../Component/Option/User";
import Select from "../Component/Text_Field/SelectBox";
import Froala from "../Component/Text_Field/Froala";
import PrimaryPc from "../Component/Button/Primary-pc";

function Send() {
  // 관계 선택 상태
  const [selectedRelation, setSelectedRelation] = useState(null);
  // 폰트 선택 상태
  const [selectedFont, setSelectedFont] = useState(null);

  // 예시 옵션들 (파일로 분리해서 import 해도 됨)
  const relationOptions = [
    { label: "친구", value: "friend" },
    { label: "연인", value: "partner" },
    { label: "가족", value: "family" },
    { label: "직장동료", value: "colleague" },
  ];

  const fontOptions = [
    { label: "나눔스퀘어", value: "nanum_square" },
    { label: "맑은고딕", value: "malgun_gothic" },
    { label: "Roboto", value: "roboto" },
  ];

  // 생성(전송) 핸들러 — 실제 API 전송 로직 넣기
  const handleCreate = async () => {
    if (!selectedRelation || !selectedFont) {
      alert("관계와 폰트를 모두 선택해주세요.");
      return;
    }

    const payload = {
      relation: selectedRelation.value,
      font: selectedFont.value,
      // 추가적으로 Input, Froala 등에서 값을 모아 함께 보냄
    };

    console.log("보낼 payload:", payload);

    try {
      const res = await fetch("/api/create-resource", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("서버 에러");
      const data = await res.json();
      console.log("서버 응답:", data);
      alert("생성 완료!");
    } catch (err) {
      console.error(err);
      alert("생성 실패: " + err.message);
    }
  };

  return (
    <>
      <Header />
      <div className="w-[768px] mx-auto mt-[47px]">
        <div className="w-[720px] mx-auto">
          <div>
            <p className="text-24-bold mb-3">From.</p>
            <Input />
          </div>

          <div className="mt-[50px]">
            <p className="text-24-bold mb-3">프로필 이미지</p>
            <div className="flex gap-8 h-[94px]">
              <User />
              <div>
                <p className="text-16-regular text-gray-500">프로필 이미지를 선택해주세요!</p>
                {/* api */}
              </div>
            </div>
          </div>

          <div className="mt-[50px]">
            <p className="text-24-bold">상대와의 관계</p>
            <Select
              options={relationOptions}
              selected={selectedRelation}
              setSelected={setSelectedRelation}
              placeholder="옵션을 선택하세요"
            />
          </div>

          <div className="mt-[50px]">
            <p className="text-24-bold">내용을 입력해주세요.</p>
            <Froala />
          </div>

          <div className="mt-[50px] mb-[62px]">
            <p className="text-24-bold">폰트 선택</p>
            <Select
              options={fontOptions}
              selected={selectedFont}
              setSelected={setSelectedFont}
              placeholder="폰트를 선택하세요"
            />
          </div>
        <div>
          <div onClick={handleCreate} style={{ display: "inline-block", cursor: "pointer" }}>
            <PrimaryPc text="생성하기" />
          </div>
        </div>
        </div>

      </div>
    </>
  );
}

export default Send;

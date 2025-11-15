// src/pages/Send.jsx
import React, { useState, useEffect } from "react";
import Header from "../Component/Header/HeaderNobutton";
// import Input from "../Component/Text_Field/Input"; // 기존 Input 대신 간단한 controlled input 사용
import User from "../Component/Option/User";
import Select from "../Component/Text_Field/SelectBox";
import Froala from "../Component/Text_Field/Froala";
import PrimaryMain from "../Component/Button/Primary-main";
import apiClient from "../api/client";
import { useNavigate, useParams } from "react-router-dom";

function Send() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 관계 선택 상태
  const [selectedRelation, setSelectedRelation] = useState(null);
  // 폰트 선택 상태
  const [selectedFont, setSelectedFont] = useState(null);

  // 프로필 이미지 상태
  const [profileImages, setProfileImages] = useState([]);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);

  // sender (From) 관리
  const [sender, setSender] = useState("");

  // Froala 내용
  const [messageContent, setMessageContent] = useState("");

  const relationOptions = [
    { label: "친구", value: "친구" },
    { label: "지인", value: "지인" },
    { label: "동료", value: "동료" },
    { label: "가족", value: "가족" },
  ];

  const fontOptions = [
    { label: "Noto Sans", value: "Noto Sans" },
    { label: "Pretendard", value: "Pretendard" },
    { label: "나눔명조", value: "나눔명조" },
    { label: "나눔손글씨 손편지체", value: "나눔손글씨 손편지체" },
  ];
  const ROOT_API_URL = "https://rolling-api.vercel.app";
  
  const fetchProfileImages = async () => {
    try {
      const response = await apiClient.get(`${ROOT_API_URL}/profile-images/`);
      const data = response.data;
      let images = [];

      if (Array.isArray(data)) {
        images = data;
      } else if (data && Array.isArray(data.imageUrls)) {
        images = data.imageUrls;
      } else {
        console.error("API 응답이 올바른 이미지 배열 형태가 아닙니다:", data);
      }
      
      setProfileImages(images);
      
      // ⭐️ 2. 첫 번째 이미지 자동 선택 로직
      if (images.length > 0) {
        setSelectedProfileImage(images[0]);
      }

    } catch (error) {
      console.error("프로필 이미지 로딩 실패:", error);
      setProfileImages([]);
    }
  };

  useEffect(() => {
    fetchProfileImages();
  }, []);

  const handleCreate = async () => {
    if (!selectedRelation || !selectedFont) {
      alert("관계와 폰트를 모두 선택해주세요.");
      return;
    }

    let finalContent = messageContent.trim();
   
    const pTagRegex = /^<p[^>]*>(.*?)<\/p>$/si;
    const match = finalContent.match(pTagRegex);

    if (match && match[1] !== undefined) {
      // 캡처 그룹 1 (태그 안의 실제 내용)을 사용
      finalContent = match[1].trim(); 
    }
    
    const contentToSend = finalContent.trim() || "내용 없음";
    
    const payload = {
      team: "20-4",
      sender: sender.trim(),
      content: contentToSend, 
      profileImageURL: selectedProfileImage,
      relationship: selectedRelation?.value,
      font: selectedFont?.value,
    };

    console.log("보낼 payload:", payload);

    try {
      const res = await apiClient.post(`/recipients/${id}/messages/`, payload);

      console.log("서버 응답:", res.data);
      alert("생성 완료!");
      navigate(`/post/${id}`);
    } catch (err) {
      console.error("생성 실패:", err.response ? err.response.data : err.message);
      alert("생성 실패: " + (err.response ? err.response.data.message : err.message));
    }
  };

  console.log(navigate);
  return (
    <>
      <Header />
      <div className="max-w-[768px] mx-auto mt-[47px] px-6 ">
        <div className="w-full">
          <div>
            <p className="text-24-bold mb-3">From.</p>
            {/* 기존 Input 컴포넌트 대신 간단한 controlled input으로 교체(필요 시 원래 컴포넌트와 연동) */}
            <input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="보내는 사람 이름"
              className="w-full border rounded p-2"
            />
          </div>

          <div className="mt-[50px] w-full">
            <p className="text-24-bold mb-3">프로필 이미지</p>
            <div className="w-[80px] h-[80px] flex items-center gap-8">
              <User selectedImageUrl={selectedProfileImage} />
              <div>
                <p className="text-16-regular text-gray-500 inline-block w-[200px]">
                  프로필 이미지를 선택해주세요!
                </p>

                <div className="flex gap-1 mt-2 max-w-[500px]"> 
                  {profileImages.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`프로필 이미지 ${index + 1}`}
                      className={`w-[56px] h-[56px] rounded-full object-cover cursor-pointer transition-all ${
                        selectedProfileImage === imageUrl
                          ? "border-[3px] border-purple-600 p-1"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => setSelectedProfileImage(imageUrl)}
                    />
                  ))}

                  {profileImages.length === 0 && (
                    <p className="text-gray-400">이미지를 불러오는 중입니다...</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[50px] w-full">
            <p className="text-24-bold mb-3">상대와의 관계</p>
            <Select
              options={relationOptions}
              selected={selectedRelation}
              setSelected={setSelectedRelation}
              placeholder="지인"
              errorText="관계를 선택하세요"
            />
          </div>

          <div className="mt-[50px] w-full">
            <p className="text-24-bold mb-3">내용을 입력해주세요.</p>
            {/* selectedFont?.value 를 전달. Froala는 model/onModelChange로 내용 제어 */}
            <Froala
              font={selectedFont ? selectedFont.value : "Noto Sans"}
              model={messageContent}
              onModelChange={(newModel) => setMessageContent(newModel)}
            />
          </div>

          <div className="mt-[50px] mb-[62px] w-full">
            <p className="text-24-bold mb-3">폰트 선택</p>
            <Select
              options={fontOptions}
              selected={selectedFont}
              setSelected={setSelectedFont}
              placeholder="Noto Sans"
              errorText="폰트를 선택하세요 "
            />
          </div>

          
            <div
              className="mb-[60px] inline-block mx-auto max-xt:max-w-[320px] text-center"
              onClick={handleCreate}
              style={{ cursor: "pointer" }}
            >
              {/* PrimaryPc는 w-full이므로 부모 div의 max-w-md 크기로 맞춰집니다. */}
              <PrimaryMain text="생성하기" to="" />
            </div>
          
        </div>
      </div>
    </>
  );
}

export default Send;
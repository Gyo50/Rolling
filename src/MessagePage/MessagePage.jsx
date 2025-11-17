// src/pages/Send.jsx
import React, { useState, useEffect, useMemo } from "react";
import Header from "../Component/Header/HeaderNobutton";
import Input from "../Component/Text_Field/Input";
import User from "../Component/Option/User";
import Select from "../Component/Text_Field/SelectBox";
import Froala from "../Component/Text_Field/Froala";
import Primarypc from "../Component/Button/Primary-pc";
import apiClient from "../api/client";
import { useNavigate, useParams } from "react-router-dom";

function Send() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [profileImages, setProfileImages] = useState([]);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);

  const [sender, setSender] = useState(""); // 이름
  const [messageContent, setMessageContent] = useState(""); // 내용(HTML)
  const relationOptions = [
    { label: "친구", value: "친구" },
    { label: "지인", value: "지인" },
    { label: "동료", value: "동료" },
    { label: "가족", value: "가족" },
  ];
  const [selectedRelation, setSelectedRelation] = useState(relationOptions[1]);

  const fontOptions = [
    { label: "Noto Sans", value: "Noto Sans" },
    { label: "Pretendard", value: "Pretendard" },
    { label: "나눔명조", value: "나눔명조" },
    { label: "나눔손글씨 손편지체", value: "나눔손글씨 손편지체" },
  ];
  const [selectedFont, setSelectedFont] = useState(fontOptions[0]); // 폰트

  const ROOT_API_URL = "https://rolling-api.vercel.app";

  // HTML → 순수 텍스트 추출(공백/nbsp 제거)
  const contentText = useMemo(() => {
    const withoutTags = messageContent
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/?p[^>]*>/gi, "\n")
      .replace(/<\/?[^>]+>/g, ""); // 모든 태그 제거
    return withoutTags.replace(/&nbsp;|\s|\u00A0/g, "").trim();
  }, [messageContent]);

  // 세 가지 모두 채워져야 활성화
  const canSubmit = useMemo(() => {
    const hasName = sender.trim().length > 0;
    const hasFont = !!selectedFont?.value?.trim();
    const hasContent = contentText.length > 0; // 실제 텍스트가 있나
    return hasName && hasFont && hasContent;
  }, [sender, selectedFont, contentText]);

  const fetchProfileImages = async () => {
    try {
      const response = await apiClient.get(`${ROOT_API_URL}/profile-images/`);
      const data = response.data;
      let images = [];

      if (Array.isArray(data)) images = data;
      else if (data && Array.isArray(data.imageUrls)) images = data.imageUrls;

      setProfileImages(images);
      if (images.length > 0) setSelectedProfileImage(images[0]);
    } catch (error) {
      console.error("프로필 이미지 로딩 실패:", error);
      setProfileImages([]);
    }
  };

  useEffect(() => {
    fetchProfileImages();
  }, []);

  const handleCreate = async () => {
    // 가드: 혹시나 disabled 무시하고 들어오는 경우 대비
    if (!canSubmit || submitting) return;

    // 내용 정리 (비어있을 때 '내용 없음' 처리는 그대로)
    let finalContent = messageContent.trim();
    const pTagRegex = /^<p[^>]*>(.*?)<\/p>$/is;
    const match = finalContent.match(pTagRegex);
    if (match && match[1] !== undefined) finalContent = match[1].trim();

    const contentToSend = contentText.length > 0 ? finalContent : "내용 없음";

    const payload = {
      team: "20-4",
      sender: sender.trim(),
      content: contentToSend,
      profileImageURL: selectedProfileImage,
      relationship: selectedRelation?.value, // 관계는 기존대로 유지
      font: selectedFont?.value,
    };

    try {
      setSubmitting(true);
      await apiClient.post(`/recipients/${id}/messages/`, payload);
      alert("생성 완료!");
      navigate(`/post/${id}`);
    } catch (err) {
      console.error("생성 실패:", err.response ? err.response.data : err.message);
      alert("생성 실패: " + (err.response ? err.response.data.message : err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const imagesToDisplay = profileImages.slice(0, 10);

  // 폴로라 라이센스 삭제 함수
useEffect(() => {
    // 500밀리초(0.5초) 간격으로 반복 실행
    const intervalId = setInterval(() => {
      const link = document.querySelector('a[href*="froala.com/wysiwyg_editor-download/"]');

      if (link) { 
        // 💡 link가 존재하면 (null이 아니면)
        link.parentNode?.remove(); // 옵셔널 체이닝으로 안전하게 제거 
      }
    }, 100); // 간격 설정 (예: 500ms)

    // 🧹 컴포넌트가 언마운트될 때 (사라질 때) 인터벌도 정리
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-[768px] mx-auto mt-[47px] px-6 max-xs:px-5">
        <div className="w-full">
          <div>
            <p className="text-24-bold mb-3">From.</p>
            <Input
              value={sender}
              onChange={(value) => setSender(value)}
              placeholder="보내는 사람 이름을 입력하세요"
            />
          </div>

          <div className="mt-[50px] w-full">
            <p className="text-24-bold mb-3">프로필 이미지</p>

            <div className="flex justify-start items-center gap-8">
              <User className="w-[80px] h-[80px]" selectedImageUrl={selectedProfileImage} />

              <div>
                <p className="text-16-regular text-gray-500 mb-4">프로필 이미지를 선택해주세요!</p>

                <div className="flex flex-wrap gap-1 max-xs:gap-0.5">
                  {imagesToDisplay.map((imageUrl, index) => (
                    <img
                      alt={`프로필 이미지 ${index + 1}`}
                      key={index}
                      src={imageUrl}
                      className={`w-[56px] h-[56px] rounded-full object-cover cursor-pointer max-xs:w-[40px] max-xs:h-[40px] ${
                        selectedProfileImage === imageUrl
                          ? "border-[3px] border-purple-600 p-1"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => setSelectedProfileImage(imageUrl)}
                    />
                  ))}
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

          {/* 버튼: disabled를 Primarypc에 직접 전달 (포인터 제거/회색 처리 컴포넌트에서 수행) */}
          <div className="w-full mb-[60px] inline-block mx-auto text-center">
            <Primarypc
              text={submitting ? "생성 중..." : "생성하기"}
              to=""
              onClick={handleCreate}
              disabled={!canSubmit || submitting}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Send;

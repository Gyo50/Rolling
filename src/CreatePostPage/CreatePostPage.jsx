import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderNobutton from "../Component/Header/HeaderNobutton";
import Input from "../Component/Text_Field/Input";
import ToggleButton from "../Component/Button/Toggle-button";
import Option from "../Component/Option/Option";
import Primarypc from "../Component/Button/Primary-pc";
import apiClient from "../api/client";
import { createRecipient } from "../api/recipients"; // 수신인 생성 API 함수 사용

const COLOR_OPTIONS = ["beige", "purple", "blue", "green"];
const FALLBACK_PRESETS = [
  "https://i.ibb.co/wZQjvc86/Kakao-Talk-20251111-022932220.jpg",
  "https://i.ibb.co/R43DLhsH/Kakao-Talk-20251111-022938248.jpg",
  "https://i.ibb.co/F4m2R8Nn/clover.png",
  "https://i.ibb.co/vxRmv64t/Snow.jpg",
];

function ImageSelectGrid({ presets, selectedIndex, onSelect }) {
  // 컴포넌트 내용은 동일
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {presets.map((url, index) => (
        <button
          key={`${url}-${index}`}
          type="button"
          onClick={() => onSelect(index)}
          className={`relative w-[154px] md:w-[168px] h-[154px] md:h-[168px] rounded-xl overflow-hidden border transition-all duration-200 flex items-center justify-center ${
            selectedIndex === index ? "border-purple-500 shadow-lg" : "border-gray-200"
          }`}
          style={{
            backgroundImage: `url(${url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {selectedIndex === index && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-[44px] h-[44px] rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white text-18-bold">✓</span>
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

function CreatePostPage() {
  const navigate = useNavigate();
  const [recipientName, setRecipientName] = useState("");
  const [mode, setMode] = useState("color");
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const isValid = useMemo(() => recipientName.trim().length > 0, [recipientName]);
  const [imagePresets, setImagePresets] = useState(FALLBACK_PRESETS);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageError, setImageError] = useState(null);
  const ROOT_API_URL = "https://rolling-api.vercel.app";

  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 360) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
    };

    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 이미지 프리셋 로딩 (기존 로직 유지)
  useEffect(() => {
    const fetchImages = async () => {
      setLoadingImages(true);
      setImageError(null);
      try {
        // ⭐ 수정된 부분: apiClient 대신 axios를 사용하고 절대 경로를 지정 ⭐
        // apiClient를 임포트할 때 axios가 이미 들어있으므로, apiClient.get 대신 axios.get을 사용하거나,
        // apiClient.get의 첫 인자에 절대 경로를 넣어 baseURL을 오버라이드합니다.

        const res = await apiClient.get(`${ROOT_API_URL}/background-images/`);
        // 또는 axios를 별도로 임포트하여 사용: const res = await axios.get(`${ROOT_API_URL}/background-images/`)

        // ... (기존 응답 처리 로직 유지)
        // 서버가 { imageUrls: [...] } 형태로 반환함을 확인하셨으므로 우선 처리
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.imageUrls)
          ? res.data.imageUrls
          : Array.isArray(res.data?.images)
          ? res.data.images
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        console.log("parsed image list:", data);
        if (data.length > 0) {
          setImagePresets(data);
          if (selectedIndex >= data.length) setSelectedIndex(0);
        } else {
          console.warn("background-images API returned empty list, using fallback presets");
        }
      } catch (err) {
        console.error("이미지 프리셋 불러오기 실패:", err);
        // 에러 객체 자체를 문자열로 변환하여 표시
        setImageError(new Error(err.message || String(err)));
      } finally {
        setLoadingImages(false);
      }
    };

    fetchImages();
  }, [selectedIndex]);

  const handleNameChange = (value) => {
    setRecipientName(value);
  };

  const handleToggleChange = (value) => {
    setMode(value);
  };

  const handleColorChange = (colorValue) => {
    setSelectedColor(colorValue);
  };

  const handleSelectImage = (index) => {
    setSelectedIndex(index);
  };

  // ⭐ API 호출 로직 (페이로드 개선) ⭐
  const handleSubmit = async () => {
    if (!isValid || submitting) return;

    try {
      setSubmitting(true);

      // 1. 기본 페이로드
      const payload = {
        name: recipientName.trim(),
        backgroundColor: selectedColor, // 필수 필드
      };

      // 2. 이미지 모드일 때만 backgroundImageURL 추가 (null이나 undefined 값은 제외)
      if (mode === "image") {
        const imageUrlForRequest = imagePresets[selectedIndex];
        if (imageUrlForRequest) {
          payload.backgroundImageURL = imageUrlForRequest;
        }
      }

      // API 호출
      const response = await createRecipient(payload);
      const newId = response?.id;

      if (newId) {
        // navigate(`/post/${newId}`, { replace: true });
        navigate(`/post/${newId}/owner`, { replace: true });
      } else {
        alert("ID를 확인할 수 없어 리스트로 이동합니다.");
        navigate("/list", { replace: true });
      }
    } catch (error) {
      console.error("롤링 페이퍼 생성 실패:", error?.response?.data || error);

      let errorMessage = "알 수 없는 오류";

      if (error?.response?.data) {
        // 서버 응답 데이터가 객체(JSON)인지 확인합니다.
        if (typeof error.response.data === "object" && error.response.data !== null) {
          // 객체일 경우, 기존처럼 필드별 에러 메시지를 파싱합니다.
          errorMessage = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join("\n");
        } else {
          // 객체가 아닌 단순 문자열(HTML, 일반 텍스트 등)일 경우, 그대로 표시합니다.
          errorMessage =
            String(error.response.data).substring(0, 100) +
            "... (응답 데이터가 JSON 형식이 아닙니다.)";
        }
      } else {
        errorMessage = error?.message || "네트워크 연결 실패 또는 요청 시간 초과";
      }

      alert(
        `롤링 페이퍼 생성에 실패했습니다.\n\n[Status: ${
          error.response?.status || "N/A"
        }]\n\n${errorMessage}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  

  return (
    <>
      {/* 헤더: 360px 이하에서 숨김 (유지) */}
      {showHeader && <HeaderNobutton />}

      {/* ✅ 컨테이너: 예전 클래스 구조로 복원 */}
      <div
        className="
          w-full max-w-[768px] mt-[57px]
          mx-auto px-[24px] text-left
          flex flex-col items-start
          max-ta:mt-[49px] max-xt:mt-[49px] max-xs:mt-[50px]
        "
      >
        {/* ✅ 상단 입력 영역: 예전 구조 */}
        <div className="w-full max-w-[768px]">
          <div className="mb-[12px] text-gray-900 text-24-bold flex flex-col items-start">To.</div>
          {/* 예전엔 onChangeValue였지만, 현재 컴포넌트 시그니처 유지 */}
          <Input value={recipientName} onChange={handleNameChange} placeholder="받는 사람 이름을 입력하세요" />
        </div>

        {/* ✅ 설명 타이틀 영역 */}
        <div className="mb-[24px] mt-[50px] max-ta:mt-[54px] max-xt:mt-[52px] max-xs:mt-[48px]">
          <div className="text-gray-900 text-24-bold mb-1">
            배경화면을 선택해 주세요.
          </div>
          <div className="text-gray-500 text-16-regular">
            컬러를 선택하거나, 이미지를 선택할 수 있습니다.
          </div>
        </div>

        {/* ✅ 토글 버튼 영역 */}
        <div className="w-[244px] mb-[45px] max-ta:mb-[40px] max-xt:mb-[40px] max-xs:mb-[28px]">
          <ToggleButton active={mode} onChange={handleToggleChange} />
        </div>

        {/* ✅ 옵션/이미지 선택 영역 */}
        <div className="w-full">
          {mode === 'color' ? (
            <Option activeColor={selectedColor} onChange={handleColorChange} />
          ) : (
            <div className="w-full flex flex-col gap-4">
              {loadingImages ? (
                <div>이미지 로딩중...</div>
              ) : imageError ? (
                <div className="text-red-500 text-14-regular">
                  이미지 불러오기 실패: {String(imageError.message || '네트워크 오류')}
                </div>
              ) : (
                <ImageSelectGrid
                  presets={imagePresets}
                  selectedIndex={selectedIndex}
                  onSelect={handleSelectImage}
                />
              )}
            </div>
          )}
        </div>

        {/* ✅ 생성 버튼 영역: 예전 마진 로직 복원 */}
        <div className={`w-full h-full max-xt:w-full py-[24px] mt-[69px] flex justify-center items-center max-ta:mt-[340px] max-xt:mt-[316px] max-xs:mt-[83px]`}>
          <Primarypc
            text={submitting ? "생성 중..." : "생성하기"}
            to={null}
            disabled={!isValid || submitting}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}

export default CreatePostPage

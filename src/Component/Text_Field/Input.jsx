import React, { useState } from "react";
export default function Input({ text = "이름을 입력해주세요.", onChangeValue }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const handleBlurValidation = (e) => {
    if (!e.target.value) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    // ✅ 부모(CreatePostPage, MessagePage.jsx)로 값 전달
    if (onChangeValue) {
      onChangeValue(newValue);
    }
  };

  return (
    <>
      <div>
        <input
          value={value}
          onChange={handleChange}
          onBlur={handleBlurValidation}
          type="text"
          placeholder={text}
          className={`max-[360px]:w-[320px] w-[720px] max-w-full px-[16px] h-[50px] border  text-grayscale-900 rounded-[8px] ${
            error ? "border-error" : "border-grayscale-300"
          }`}
        />
        {error && <p className="mt-[4px] text-12-regular text-error">필수 입력 항목입니다.</p>}
      </div>
    </>
  );
}

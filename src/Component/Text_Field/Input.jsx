import React, { useState } from "react";
export default function Input({ text="이름을 입력해주세요.", value: controlledValue, onChange }) {
  const [internalValue, setInternalValue] = useState("")
  const [error, setError] = useState(false);
  const isControlled = controlledValue !== undefined // 외부에서 value를 주면 제어 컴포넌트로 동작
  const value = isControlled ? controlledValue : internalValue

  const handleBlurValidation = (e) => {
    if (!e.target.value) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleChange = (e) => {
    if (!isControlled) {
      setInternalValue(e.target.value) // 비제어 모드일 때 내부 상태 업데이트
    }
    onChange?.(e.target.value) // 부모에게 변경 값 전달
  }

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

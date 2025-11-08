import React, { useState } from "react";
export default function Input() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const handleBlurValidation = (e) => {
    if (!e.target.value) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleChange = (e) => setValue(e.target.value);

  return (
    <>
      <input
        value={value}
        onChange={handleChange}
        onBlur={handleBlurValidation}
        type="text"
        placeholder="placeholder"
        className={`w-[320px] max-w-full px-[16px] h-[50px] border  text-grayscale-900 rounded-[8px] ${
          error ? "border-error" : "border-grayscale-300"
        }`}
      />
      {error && <p className="mt-[4px] text-12-regular text-error">Error Massage</p>}
    </>
  );
}

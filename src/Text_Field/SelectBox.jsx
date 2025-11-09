import React, { useEffect, useRef, useState } from "react";
import dropDownIcon from "../img/arrow_down.svg";
import dropDownOpenIcon from "../img/arrow_top.svg";

export default function SelectBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [error, setError] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const selectBoxRef = useRef(null);

  const handleToggle = () => {
    setIsTouched(true);
    setError(false);
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (e) => {
    const text = e.target.textContent.trim();
    setSelectedValue(text);
    setIsOpen(false);
    setError(false);
  };

  // 셀렉트박스 밖 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!selectBoxRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.addEventListener("click", handleClickOutside);
    };
  }, [selectedValue]);

  // 클릭 여부 판단 후 Error처리
  useEffect(() => {
    if (!isOpen && isTouched && !selectedValue) {
      setError(true);
    }
  }, [isOpen, isTouched, selectedValue]);

  return (
    <>
      <div className="relative z-30" ref={selectBoxRef}>
        <button
          onClick={handleToggle}
          style={{ backgroundImage: isOpen ? `url(${dropDownOpenIcon})` : `url(${dropDownIcon})` }}
          type="button"
          className={`block w-[320px] max-w-full px-[16px] h-[50px] border  text-grayscale-500 rounded-[8px] bg-no-repeat bg-[position:right_16px_center] text-left ${
            error ? "border-error" : "border-grayscale-500"
          }`}
        >
          {selectedValue || "Placeholder"}
        </button>
        {isOpen && (
          <ul className="bg-white absolute top-[calc(100%+8px)] border border-grayscale-300 rounded-[8px] py-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
            {["text1", "text2", "text3"].map((text) => (
              <li
                key={text}
                onClick={handleSelect}
                className="flex w-[318px] px-[18px] h-[50px] items-center text-grayscale-900 cursor-pointer hover:bg-grayscale-100"
              >
                {text}
              </li>
            ))}
          </ul>
        )}
        {error && <p className="mt-[4px] text-12-regular text-error">Error Massage</p>}
      </div>
    </>
  );
}

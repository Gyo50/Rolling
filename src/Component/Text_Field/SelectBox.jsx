// src/components/Text_Field/SelectBox.jsx
import React, { useEffect, useRef, useState } from "react";
import dropDownIcon from "../../img/arrow_down.svg";
import dropDownOpenIcon from "../../img/arrow_top.svg";

/**
 * options: array of {label, value} OR array of strings
 * selected, setSelected: optional (if 전달하면 controlled 모드)
 * placeholder: string
 */
export default function SelectBox({ options = [], selected, setSelected, placeholder = "선택하세요" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState(null); // uncontrolled fallback
  const [error, setError] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const selectBoxRef = useRef(null);

  // normalize options -> [{label, value}, ...]
  const normalizedOptions = (options || []).map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const isControlled = selected !== undefined && typeof setSelected === "function";
  const currentSelected = isControlled ? selected : internalSelected;

  const handleToggle = () => {
    setIsTouched(true);
    setError(false);
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (opt) => {
    if (isControlled) {
      setSelected(opt);
    } else {
      setInternalSelected(opt);
    }
    setIsOpen(false);
    setError(false);
  };

  // 밖 클릭 시 닫기 (cleanup fix)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectBoxRef.current && !selectBoxRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 유효성 검사 (선택 안 했을 때 에러)
  useEffect(() => {
    if (!isOpen && isTouched && !currentSelected) {
      setError(true);
    } else {
      setError(false);
    }
  }, [isOpen, isTouched, currentSelected]);

  return (
    <div className="relative z-30" ref={selectBoxRef}>
      <button
        onClick={handleToggle}
        style={{ backgroundImage: isOpen ? `url(${dropDownOpenIcon})` : `url(${dropDownIcon})` }}
        type="button"
        className={`block w-[320px] max-w-full px-[16px] h-[50px] border text-gray-500 rounded-[8px] bg-no-repeat bg-[position:right_16px_center] text-left ${
          error ? "border-error" : "border-gray-500"
        }`}
        aria-expanded={isOpen}
      >
        {currentSelected ? currentSelected.label : placeholder}
      </button>

      {isOpen && (
        <ul className="bg-white absolute top-[calc(100%+8px)] border border-gray-300 rounded-[8px] py-[10px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
          {normalizedOptions.map((opt) => (
            <li
              key={opt.value}
              onClick={() => handleSelect(opt)}
              className="flex w-[318px] px-[18px] h-[50px] items-center text-gray-900 cursor-pointer hover:bg-gray-100"
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-[4px] text-12-regular text-error">옵션을 선택해주세요</p>}
    </div>
  );
}

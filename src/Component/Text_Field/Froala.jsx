// src/Component/Text_Field/Froala.jsx
import React from "react";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/froala_editor.pkgd.min.js";

import "froala-editor/css/plugins/colors.min.css";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/table.min.js";
import "froala-editor/js/plugins/font_family.min.js"; // 폰트 패밀리 플러그인

import FroalaEditorComponent from "react-froala-wysiwyg";

/*
  props:
    - font (string) : ex) "Noto Sans" or "Pretendard" (selectedFont?.value)
    - model (string) : 에디터 내용 (html)
    - onModelChange (fn) : 에디터 내용 변경 콜백
*/
export default function Froala({ font = "Noto Sans", model, onModelChange, width="720px" }) {
  // Froala 설정
  const config = {
    width: width,
    height: 200,
    placeholderText: "내용을 입력하세요...",
    quickInsertTags: [],
    charCounterCount: false,
    attribution: false,
    pluginsEnabled: ["align", "lists", "fontSize", "colors", "table", "fontFamily"],
    toolbarButtons: {
      moreText: {
        buttons: [
          "bold",
          "italic",
          "underline",
        ],
        buttonsVisible: 3,
      },
      moreParagraph: {
        buttons: [
          "alignCenter",
          "alignRight",
          "alignJustify",
        ],
        buttonsVisible: 3,
      },
        moreCustom:{
          buttons:[
          "formatOL",
          "formatUL",
          "backgroundColor"
          ]
        }
    },
  };

  // 만약 전달된 font가 config.fontFamily에 없다면, 동적으로 추가
  if (font) {
    config.fontFamily = {
      [font]: `${font}, sans-serif`,
      ...config.fontFamily,
    };
  }

  // key를 font로 주면 font가 바뀔 때 에디터가 리마운트되어 새 config가 적용됩니다.
  const key = `froala-${font || "default"}`;

  return (
    <FroalaEditorComponent
      key={key}
      tag="textarea"
      config={config}
      model={model}
      onModelChange={onModelChange}
    />
  );
}

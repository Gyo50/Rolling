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
import "froala-editor/js/plugins/font_family.min.js";

import FroalaEditorComponent from "react-froala-wysiwyg";

/*
  props:
    - font (string) : ex) "Noto Sans" or "Pretendard" (selectedFont?.value)
    - model (string) : 에디터 내용 (html)
    - onModelChange (fn) : 에디터 내용 변경 콜백
*/
export default function Froala({ font = "Noto Sans", model, onModelChange, width = "720px" }) {
  // Froala 설정
  const config = {
    width: width,
    height: 200,
    placeholderText: "내용을 입력하세요...",
    quickInsertTags: [],
    charCounterCount: false,
    attribution: false,
    pluginsEnabled: ["align", "lists", "fontSize", "colors", "table", "fontFamily"],

    fontFamily: {
      "Noto Sans": "Noto Sans, sans-serif",
      "Pretendard": "Pretendard, sans-serif",
      "나눔명조": "Nanum Myeongjo, serif",
      "나눔손글씨 손편지체": "Nanum Pen Script, cursive",
    },

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
      moreCustom: {
        buttons: [
          "formatOL",
          "formatUL",
          "backgroundColor"
        ]
      }
    },
  };

  const key = `froala-${font || "default"}`;

  const editorStyle = {
    fontFamily: `'${font}', sans-serif`, // 따옴표로 감싸서 공백 포함 폰트 이름도 처리
  };


  return (
    <FroalaEditorComponent
      key={key}
      tag="textarea"
      config={config}
      model={model}
      onModelChange={onModelChange}
      style={editorStyle}
    />
  );
}
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

import FroalaEditorComponent from "react-froala-wysiwyg";

export default function Froala() {
  const config = {
    width: 720,
    height: 200,
    placeholderText: "내용을 입력하세요...",
    quickInsertTags: [],
    charCounterCount: false,
    attribution: false,
    pluginsEnabled: ["align", "lists", "fontSize", "colors", "table"],
    toolbarButtons: {
      moreText: {
        buttons: ["bold", "italic", "underline", "fontSize", "textColor", "backgroundColor"],
        buttonsVisible: 6,
      },
      moreParagraph: {
        buttons: ["alignLeft", "alignCenter", "alignRight", "alignJustify", "formatOL", "formatUL"],
        buttonsVisible: 6,
      },
    },
  };

  return <FroalaEditorComponent tag="textarea" config={config} />;
}

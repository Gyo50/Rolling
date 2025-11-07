import React, { useState } from 'react';

// Froala editor CSS
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';

// Froala editor JS bundle (필요한 경우)
import 'froala-editor/js/froala_editor.pkgd.min.js';

// React wrapper
import FroalaEditor from 'react-froala-wysiwyg';

// (선택) Froala의 View 컴포넌트가 필요하면 아래처럼 import 할 수 있음.
// import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

export default function App() {
  const [model, setModel] = useState('<p>초기 내용</p>');

  function handleModelChange(newModel) {
    setModel(newModel);
  }

  const config = {
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false,
    // other Froala options...
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2>Froala Editor 테스트</h2>

      <FroalaEditor
        tag="textarea"
        model={model}
        onModelChange={handleModelChange}
        config={config}
      />

      <h3>현재 모델 (미리보기)</h3>
      <div style={{ border: '1px solid #ddd', padding: 12 }}>
        {/* 간단한 미리보기 — innerHTML 주의: 신뢰된 내용에서만 사용하세요 */}
        <div dangerouslySetInnerHTML={{ __html: model }} />
      </div>
    </div>
  );
}

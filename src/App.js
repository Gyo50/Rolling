import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Toast from './Toast/Toast';

function App() {
  const [isToastOpen, setIsToastOpen] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="text-blue-500">
          4팀 화이팅!!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React or TailwindCSS
        </a>
        
        {/* Toast 컴포넌트 테스트 */}
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <h2 style={{ color: '#000', marginBottom: '20px' }}>Toast 컴포넌트</h2>
          <button
            onClick={() => setIsToastOpen(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#9935FF',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            토스트 표시
          </button>
          <Toast
            isOpen={isToastOpen}
            onClose={() => setIsToastOpen(false)}
            message="URL이 복사 되었습니다."
            type="success"
            duration={5000}
          />
        </div>
      </header>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import './App.css';
import Badge from './Badge/Badge';

function App() {
  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-28 font-bold text-black mb-8">Badge 컴포넌트 테스트</h1>

        {/* Badge 컴포넌트 테스트 */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-24-bold mb-4">Badge 컴포넌트</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Badge type="coworker" text="동료" />
            <Badge type="other" text="지인" />
            <Badge type="family" text="가족" />
            <Badge type="friend" text="친구" />
            <Badge type="emoji" emoji="😍" count={24} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;

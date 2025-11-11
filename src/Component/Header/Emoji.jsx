import React from 'react'
import EmojiPicker from 'emoji-picker-react'

function Emoji() {
  return (
    <>
        <EmojiPicker/>
    </>
  )
}

/* 
import { useState } from "react";

function App() {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setOpen(!open)}>
        {open ? "이모지 닫기" : "이모지 열기"}
      </button>

      {open && <Emoji />}
    </>
  );
}
*/

export default Emoji
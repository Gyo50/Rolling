import React, { useEffect, useState } from "react";
import axios from "axios";

function MessageList({ team, recipientId }) {
  const [messages, setMessages] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await axios(team, recipientId, 20, 0);
        setMessages(data.results);
        setCount(data.count);
      } catch (error) {
        console.error("메시지 가져오기 실패:", error);
      }
    };
    fetchMessages();
  }, [team, recipientId]);

  return (
    <div>
      <h2>메시지 목록 ({count})</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <strong>{msg.sender}</strong>: {msg.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageList;

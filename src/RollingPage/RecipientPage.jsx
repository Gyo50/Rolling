import React, { useEffect, useState } from "react";
import Header from "../Component/Header/Header";
import MessageHeader from "../Component/Header/MessageHeader";
import Modal from "../Component/Modal/Modal";
import UserCard, { defaultMessage } from "../Component/Card/UserCard";
import axios from "axios";
import { useParams } from "react-router-dom";

function RecipientPage() {
  const { id } = useParams(); // URL에 있는 id 값 가져오기
  const [messages, setMessages] = useState([]); // 카드 데이터 상태값 관리
  const [reactions, setReactions] = useState([]); // 리엑션 데이터 상태값 관리: header컴포넌트에서 해당 페이지로 이동
  const defaultMessages = Array(6).fill(defaultMessage);

  // 카드데이터 뿌리기: UserCard.jsx: 추후 확인 필요(현재 defaultMessages)
  // useEffect(() => {
  //   const dataMessages = async () => {
  //     try {
  //       const res = await axios.get(
  //         `https://rolling-api.vercel.app/20-4/recipients/${id}/messages`
  //       );
  //       setMessages(res.data.results || []);
  //     } catch (error) {
  //       alert(`실패입니다. 에러코드: ${error}`);
  //     }
  //   };

  //   dataMessages();
  // }, []);

  // 랜더링 데이터 선택: 없으면 defaultMessages데이터 표시
  const messegesToRender = messages && messages.length > 0 ? messages : defaultMessages;

  // 모달에 데이터 가져오기: Modal.jsx
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // 카드 클릭 시 모달 열기 핸들러
  const handleCardClick = (id) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  // 메시지 상세 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  // selectedMessage: 아이디 값이 같을 경우 그 메세지 객체를 반환받음
  const selectedMessage = messegesToRender.find((msg, index) => {
    const messageId = msg.id ?? index;
    return messageId === selectedId;
  });

  // 리엑션 조회
  useEffect(() => {
    const getReactions = async () => {
      try {
        // id: 14995 --> 추후 변경: ${id}
        const res = await axios.get(
          `https://rolling-api.vercel.app/20-4/recipients/14995/reactions/`
        );
        setReactions(res.data.results);
        console.log(reactions);
      } catch (error) {
        alert(`실패입니다. 에러코드: ${error}`);
      }
    };
    getReactions();
  }, []);

  // 리엑션 서버에 추가
  // MessageHeader로 전달할 함수,
  // 클릭한 이모지 객체를 가져옴.
  // 해당 객체를 api규약에 맞춰 서버로 넘기기: MessageHeader.jsx
  const handleEmojiUpdate = async (selectEmojiObj) => {
    if (!selectEmojiObj) return;

    try {
      // id: 14995 --> 추후 변경: ${id}
      const res = await axios.post(
        `https://rolling-api.vercel.app/20-4/recipients/14995/reactions/`,
        {
          emoji: selectEmojiObj.emoji,
          type: selectEmojiObj.type,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      alert(`실패: ${error}`);
    }
  };

  return (
    <>
      <div className="overflow-y-scroll owner-page-scrollbar-hide">
        <div className="flex flex-col min-h-screen bg-beige-200">
          {/* 상단 헤더 영역 (고정) */}
          <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-30">
            <div className="mx-auto">
              <Header />
              <div className="flex justify-between items-center px-6">
                <MessageHeader
                  propEmojiSelect={handleEmojiUpdate}
                  reactions={reactions}
                  setReactions={setReactions}
                />
              </div>
            </div>
          </div>

          {/* 메시지 카드 영역 */}
          <div className="flex-1 w-full pt-[180px] pb-10 relative">
            <div className="mx-auto px-6 relative max-w-7xl">
              {/* 카드 목록 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] mt-[28px] relative z-10">
                {messegesToRender.map((message, idx) => (
                  <UserCard
                    key={message.id ?? idx}
                    message={message}
                    onClick={() => handleCardClick(message.id ?? idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center"
          onClick={handleCloseModal}
        >
          <Modal
            onClick={(e) => e.stopPropagation()}
            isOpen={isOpen}
            onClose={handleCloseModal}
            message={selectedMessage}
          />
        </div>
      )}
    </>
  );
}

export default RecipientPage;

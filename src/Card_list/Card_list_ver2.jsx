import React from 'react';
import './Card_list_ver2.css';
import profile01 from './assets/profile01.svg';
import profile02 from './assets/profile02.svg';
import profile03 from './assets/profile03.svg';
import bgImage from './assets/bgImg.avif';


function CardList2() {
    return ( <>
      <div
      className="card"
      style={{
        backgroundImage: `url(${bgImage})`, // 👈 배경 이미지 삽입
      }}
      >
        <div className='cardHeader'>
          <div className='toName'>To.Sowon</div>
          <div className='cardProfile'>
            <img src={profile01} alt='profile01'/>
            <img src={profile02} alt='profile02'/>
            <img src={profile03} alt='profile03'/> 
            <span className='moreProfiles'>+27</span>
          </div>
          <div className='writtenRecord'>
            <span>30명</span>이 작성했어요!
          </div>
        </div>
        <div className='imojiWrapper'>
          <div className='imoji'>👍 20</div>
          <div className='imoji'>😍 12</div>
          <div className='imoji'>😢 7</div>
        </div>
      </div>
    </>
    );
}

export default CardList2
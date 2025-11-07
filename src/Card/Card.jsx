import React from 'react'
import styles from './Card.module.css';

/* 카드 컴포넌트 */
function Card() {
    return ( <>
      <div className={styles.card}>
        <div className={styles.cardContent}>
          <img className={styles.profileImg} src='https://entertainimg.kbsmedia.co.kr/cms/uploads/PERSON_20220112081105_4217f0cc8e5e82a908647d8e1de448a5.jpg'alt='프로필 이미지'/>
          <div className={styles.userInfo}>
            <div className={styles.fromName}>From.<span>남주혁</span></div>
            <div className={styles.relationTag}>동료</div>
          </div>
        </div>
        <div className={styles.cardDesc}>
          <div className={styles.messageContent}>소원아 생일 축하해!</div>
          <div className={styles.writtenDate}>2023.01.29</div>
        </div>
      </div>
    </>
    );
}

export default Card

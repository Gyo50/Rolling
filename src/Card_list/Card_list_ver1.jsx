import React from 'react';
import styles from './Card_list.module.css';
import '../index.css';
import profile01 from './assets/profile01.svg';
import profile02 from './assets/profile02.svg';
import profile03 from './assets/profile03.svg';
import pattern01 from './assets/pattern01.svg';
/*import pattern02 from './assets/pattern02.svg';
import pattern03 from './assets/pattern03.svg';
import pattern04 from './assets/pattern04.svg';*/

/* 색깔 배경 */
function CardList() {
  return (
    <>
      <div className={styles.card}>
        <img className={styles.cardDeco} src={pattern01} alt='pattern01' />
        <div className={styles.cardHeader}>
          <div className={styles.toName}>To.Sowon</div>
          <div className={styles.cardProfile}>
            <img src={profile01} alt='profile01' />
            <img src={profile02} alt='profile02' />
            <img src={profile03} alt='profile03' />
            <span className={styles.moreProfiles}>+27</span>
          </div>
          <div className={styles.writtenRecord}>
            <span>30명</span>이 작성했어요!
          </div>
        </div>
        <div className={styles.imojiWrapper}>
          <div className={styles.imoji}>👍 20</div>
          <div className={styles.imoji}>😍 12</div>
          <div className={styles.imoji}>😢 7</div>
        </div>
      </div>
    </>
  );
}

export default CardList
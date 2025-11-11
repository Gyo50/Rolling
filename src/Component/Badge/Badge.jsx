import React from 'react'
import BadgeCoworker from './BadgeCoworker'
import BadgeOther from './BadgeOther'
import BadgeFamily from './BadgeFamily'
import BadgeFriend from './BadgeFriend'
import BadgeEmoji from './BadgeEmoji'

/**
 * Badge 컴포넌트
 * @param {string} type - 'coworker'(동료), 'other'(지인), 'family'(가족), 'friend'(친구), 'emoji'(이모지)
 * @param {string} text - 배지에 표시할 텍스트 (관계 타입일 때만)
 * @param {string} emoji - 이모지 배지일 때 표시할 이모지
 * @param {number} count - 이모지 배지일 때 표시할 숫자
 */
function Badge({ type = 'coworker', text, emoji, count }) {
  if (type === 'emoji') {
    return <BadgeEmoji emoji={emoji} count={count} />
  }

  const relationshipComponents = {
    coworker: BadgeCoworker,
    other: BadgeOther,
    family: BadgeFamily,
    friend: BadgeFriend,
  }

  const Component = relationshipComponents[type] || BadgeCoworker

  return <Component text={text} />
}

export {
  BadgeCoworker,
  BadgeOther,
  BadgeFamily,
  BadgeFriend,
  BadgeEmoji,
}

/* 사용법
      <div className="p-5 flex gap-4 items-center">
        <Badge type="emoji" emoji="🔥" count={5} />
        <Badge type="coworker" text="동료" />
        <Badge type="friend" text="친구" />
        <Badge type="family" text="가족" />
        <Badge type="other" text="지인" />
      </div>
*/
export default Badge

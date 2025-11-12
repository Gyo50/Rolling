import apiClient from './client'

const TEAM = process.env.REACT_APP_ROLLING_TEAM

// Rolling API에서 허용하는 반응 별칭과 실제 이모지 매핑
export const REACTION_ALIAS_TO_EMOJI = {
  celebrate: '🎉',
  smile: '😊',
  heart: '❤️',
  laugh: '😂',
  clap: '👏',
  fire: '🔥',
  thumbsup: '👍',
  thumbsdown: '👎',
  wow: '😮',
  cry: '😢',
  angry: '😡',
  love: '😍',
  wink: '😉',
  cool: '😎',
  star: '⭐',
  pray: '🙏',
  flex: '💪',
  sparkle: '✨',
  party: '🥳',
  hug: '🤗'
}
//넣을 수 있는 이모지 다 넣어놓긴헀어요 
// 프런트에서 선택한 이모지를 API가 이해하는 별칭으로 역변환하기 위한 맵
export const EMOJI_TO_ALIAS = Object.fromEntries(
  Object.entries(REACTION_ALIAS_TO_EMOJI).map(([alias, emoji]) => [emoji, alias])
)

const buildTeamPath = (...segments) => {
  const team = TEAM
  if (!team) {
    throw new Error('REACT_APP_ROLLING_TEAM 환경 변수가 설정되어 있지 않습니다.')
  }
  const path = ['/', team, ...segments]
    .join('/')
    .replace(/\/{2,}/g, '/')
  return path.endsWith('/') ? path : `${path}/`
}

// API 응답으로부터 반응 목록을 정리하여 카드/헤더에서 바로 사용할 수 있게 변환
export const normalizeReactionsResponse = (data) => {
  const list = Array.isArray(data?.results)
    ? data.results
    : Array.isArray(data)
      ? data
      : []

  return list
    .map((item, index) => {
      const emojiSource = item.emoji || item.reaction || item.type || item.name
      const emoji = REACTION_ALIAS_TO_EMOJI[emojiSource] || emojiSource
      const rawCount = item.count ?? item.value ?? item.amount ?? 0
      const count = typeof rawCount === 'number' ? rawCount : Number(rawCount) || 0

      if (!emoji) return null

      return {
        id: item.id ?? `${emoji}-${index}`,
        emoji,
        count
      }
    })
    .filter(Boolean)
}

// 수신인 목록(리스트 페이지/메인 카드)에 필요한 데이터를 불러오기
export const fetchRecipients = (params = {}) =>
  apiClient.get(buildTeamPath('recipients'), { params }).then((res) => res.data)

// 특정 수신인 상세(오너 페이지 헤더 정보) 불러오기
export const fetchRecipient = (recipientId) =>
  apiClient.get(buildTeamPath('recipients', recipientId)).then((res) => res.data)

// 특정 수신인 메시지 목록(오너 페이지 카드 영역) 불러오기
export const fetchRecipientMessages = (recipientId, params = {}) =>
  apiClient
    .get(buildTeamPath('recipients', recipientId, 'messages'), { params })
    .then((res) => res.data)

// 특정 수신인 반응 목록(카드/헤더에서 이모지 카운트 표시) 불러오기
export const fetchRecipientReactions = (recipientId, params = {}) =>
  apiClient
    .get(buildTeamPath('recipients', recipientId, 'reactions'), { params })
    .then((res) => res.data)

// 특정 수신인에 새로운 반응을 추가 (increase/decrease 모두 대응)
export const reactToRecipient = (recipientId, payload) =>
  apiClient.post(buildTeamPath('recipients', recipientId, 'reactions'), payload).then((res) => res.data)

export const createRecipient = (payload) =>
  apiClient.post(buildTeamPath('recipients'), payload).then((res) => res.data)

export const deleteRecipient = (recipientId) =>
  apiClient.delete(buildTeamPath('recipients', recipientId)).then((res) => res.data)

import axios from 'axios'

const TEAM = '20-4'
const BASE_URL = 'https://rolling-api.vercel.app'

export async function fetchRecipientMessages(recipientId, { limit = 3, offset = 0 } = {}) {
  const url = `${BASE_URL}/${TEAM}/recipients/${recipientId}/messages/` 
  const response = await axios.get(url, {
    params: { limit, offset },
  })

  return response.data
}

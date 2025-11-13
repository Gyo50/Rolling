import axios from 'axios'

const api = axios.create({
  baseURL: 'https://rolling-api.vercel.app/profile-images/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
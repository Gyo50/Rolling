import axios from 'axios'

// 환경 변수에서 API 기본 URL 가져오기
// 끝 슬래시는 제거하되, 내부 경로는 유지
const getBaseURL = () => {
  const envURL = process.env.REACT_APP_ROLLING_API_BASE_URL
  if (envURL) {
    // 환경 변수가 있으면 끝 슬래시만 제거
    return envURL.replace(/\/+$/, '')
  }
  // 기본값: 팀 경로를 포함한 URL (하지만 환경 변수 설정을 권장)
  return 'https://rolling-api.vercel.app/20-4'.replace(/\/+$/, '')
}

const BASE_URL = getBaseURL()

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// API 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// API 응답 인터셉터: 공통 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default apiClient

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

// 디버깅 모드 활성화 여부 (환경 변수로 제어)
const DEBUG_MODE = process.env.REACT_APP_DEBUG === 'true' || process.env.NODE_ENV === 'development'

// 환경 변수 체크 및 경고 출력
if (process.env.NODE_ENV === 'development') {
  // 팀 경로 패턴 확인 (숫자-숫자 형식)
  const teamPathPattern = /\/\d+-\d+/
  const hasTeamPath = teamPathPattern.test(BASE_URL)
  
  if (!process.env.REACT_APP_ROLLING_API_BASE_URL) {
    console.error('❌ REACT_APP_ROLLING_API_BASE_URL 환경 변수가 설정되지 않았습니다!')
    console.error('📝 .env.local 파일에 다음을 추가하세요:')
    console.error('   REACT_APP_ROLLING_API_BASE_URL=https://rolling-api.vercel.app/20-4/')
    console.error('⚠️  기본값을 사용합니다:', BASE_URL)
  } else if (!hasTeamPath) {
    // 환경 변수가 설정되어 있지만 팀 경로가 없는 경우
    console.error('❌ API Base URL에 팀 경로가 포함되어 있지 않습니다!')
    console.error('📝 .env.local 파일을 확인하고 다음 형식으로 수정하세요:')
    console.error('   REACT_APP_ROLLING_API_BASE_URL=https://rolling-api.vercel.app/20-4/')
    console.error('   현재 값:', BASE_URL)
    console.error('   올바른 형식: https://rolling-api.vercel.app/20-4/')
  }
  
  // 최종 URL 확인 메시지
  if (!hasTeamPath) {
    console.error('')
    console.error('🚨 경고: API 요청이 실패할 수 있습니다!')
    console.error('   예상되는 올바른 URL: https://rolling-api.vercel.app/20-4/recipients/')
    console.error('   현재 사용될 URL: ' + BASE_URL + '/recipients/')
    console.error('')
  }
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// API 요청 인터셉터: 디버깅 모드에서 요청 정보 로깅
apiClient.interceptors.request.use(
  (config) => {
    if (DEBUG_MODE) {
      console.group('📤 API 요청')
      console.log('Method:', config.method?.toUpperCase())
      console.log('URL:', config.url)
      console.log('Full URL:', `${config.baseURL}${config.url}`)
      if (config.params) {
        console.log('Query Params:', config.params)
      }
      if (config.data) {
        console.log('Request Data:', config.data)
      }
      if (config.headers) {
        console.log('Headers:', config.headers)
      }
      console.groupEnd()
    }
    return config
  },
  (error) => {
    if (DEBUG_MODE) {
      console.error('❌ 요청 설정 에러:', error)
    }
    return Promise.reject(error)
  }
)

// API 응답 인터셉터: 디버깅 모드에서 응답 정보 로깅 및 공통 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    // 정상 응답 로깅 (디버깅 모드)
    if (DEBUG_MODE) {
      console.group('📥 API 응답 (성공)')
      console.log('Status:', response.status)
      console.log('URL:', response.config.url)
      console.log('Response Data:', response.data)
      console.groupEnd()
    }
    return response
  },
  (error) => {
    // 네트워크 에러 또는 서버 에러 처리
    if (DEBUG_MODE) {
      console.group('📥 API 응답 (에러)')
      if (error.response) {
        // 서버가 응답했지만 에러 상태 코드
        console.error('Status:', error.response.status)
        console.error('URL:', error.config?.url)
        console.error('Response Data:', error.response.data)
        console.error('Response Headers:', error.response.headers)
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못함
        console.error('네트워크 에러: 서버에 연결할 수 없습니다.')
        console.error('Request:', error.request)
      } else {
        // 요청 설정 중 에러 발생
        console.error('요청 설정 에러:', error.message)
      }
      console.error('Full Error:', error)
      console.groupEnd()
    } else {
      // 디버깅 모드가 아닐 때는 간단한 에러만 출력
      if (error.response) {
        console.error('API 에러:', error.response.status, error.response.data)
      } else if (error.request) {
        console.error('네트워크 에러: 서버에 연결할 수 없습니다.')
      } else {
        console.error('요청 설정 에러:', error.message)
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient

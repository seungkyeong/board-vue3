import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('jwtToken') || '', // 로컬 스토리지에서 JWT 토큰 읽기
    user: null, // 사용자 정보
  }),

  actions: {
    // 로그인 처리
    login(token) {
      this.token = token // 토큰을 상태에 저장
      localStorage.setItem('jwtToken', token) // 로컬 스토리지에 토큰 저장
      this.decodeToken(token) // 토큰 디코딩하여 사용자 정보 저장
    },

    // 로그아웃 처리
    logout() {
      this.token = '' // 토큰 초기화
      this.user = null // 사용자 정보 초기화
      localStorage.removeItem('jwtToken') // 로컬 스토리지에서 토큰 삭제
    },

    // JWT 토큰 디코딩하여 사용자 정보 추출
    decodeToken(token) {
      if (token) {
        try {
          console.log('token', token)
          const decoded = jwtDecode(token)

          const subject = decoded.sub // 'sub'는 JWT에서 subject를 나타냄
          const [userId, sysNo] = subject.split(':')

          console.log('decoded.sub', decoded.sub)
          this.user = {
            userId: userId, // 사용자 ID (JWT 토큰의 sub 필드)
            sysNo: sysNo,
          }
          console.log(this.user.userId)
          console.log(this.user.sysNo)
        } catch (error) {
          console.error('Invalid token:', error)
        }
      }
    },

    // 초기화 함수
    initialize() {
      if (this.token) {
        this.decodeToken(this.token) // 토큰을 디코딩하여 상태 복구
      }
    },
  },

  getters: {
    // 저장된 토큰 가져오기
    getToken(state) {
      return state.token
    },

    // 사용자 ID 가져오기
    getUserId(state) {
      return state.user?.userId
    },

    // 사용자 sysNo 가져오기
    getSysNo(state) {
      return state.user?.sysNo
    },
  },
})

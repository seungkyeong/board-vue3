import { defineStore } from 'pinia'

export const useTempUserStore = defineStore('tempUser', {
  state: () => ({
    userSysNo: '', // 비밀번호 재설정용 userSysNo
  }),
  actions: {
    setUserSysNo(userSysNo) {
      this.userSysNo = userSysNo
    },
    clearUserSysNo() {
      this.userSysNo = ''
    },
  },
  getters: {
    getUserSysNo: (state) => state.userSysNo,
  },
})

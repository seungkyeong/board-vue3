import { defineStore } from 'pinia'

export const usePagingStore = defineStore('paging', {
  state: () => ({
    pageIndex: 1,
    pageSize: 10,
    searchFilters: {}, //검색 조건
  }),
  persist: true,
  actions: {
    /* 검색 조건, pageIndex 초기화 */
    reset() {
      this.pageIndex = 1
      this.searchFilters = {}
    },
  },
})

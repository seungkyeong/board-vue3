import router from '@/router'

/* 페이지 이동 */
export async function goToPage(path, query = {}) {
  return await router.push({ path, query })
}

/* 이전 페이지 이동 */
export async function goBack() {
  return await router.go(-1)
}

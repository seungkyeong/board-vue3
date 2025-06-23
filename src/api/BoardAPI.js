const BASE_URL = 'http://43.200.8.42:8080/api/board/' //api/board/

export default {
  /* 모든 게시물 조회 */
  getBoardList: (data) => commonFetch('list', data),

  /* 게시물 생성 */
  createBoard: (data) => commonFetch('post', data),

  /* Presigned URL 발급 */
  getPresignedURL: (data) =>
    commonFetch('post/fileUpload', data, { raw: true }),

  /* S3 파일업로드 */
  uploadFile: async function (presignedUrl, file) {
    try {
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file, // 업로드할 파일
        headers: {
          'Content-Type': file.type,
        },
        mode: 'cors',
      })
      console.log(response)
      if (response.ok) {
        return response.url // S3에서 반환된 URL
      } else {
        throw new Error('File Upload Fail.')
      }
    } catch (error) {
      console.error('File Upload Fail: ', error)
    }
  },

  /* 게시물 상세 조회 */
  getBoardDetail: (data) => commonFetch('detail', data),

  /* 회원가입 */
  createUser: (data) => commonFetch('signUp', data, { noAuth: true }),

  /* 로그인 */
  login: (data) => commonFetch('login', data, { noAuth: true }),

  /* 아이디&비밀번호 찾기 */
  findIdPw: (requestData) =>
    commonFetch('findIdPw', requestData, { noAuth: true }),

  /* 사용자 상세 보기 */
  userDetail: (requestData) => commonFetch('userDetail', requestData),

  /* 사용자 상세 수정 */
  updateUserDetail: (requestData) =>
    commonFetch('updateUserDetail', requestData),

  /* 사용자 비밀번호 수정 */
  updateUserPw: (requestData) => commonFetch('updateUserPw', requestData),

  /* View Count Redis에 적용 */
  updateCount: (requestData) => commonFetch('updateCount', requestData),

  /* 댓글 생성 */
  createComment: (requestData) => commonFetch('comment', requestData),

  /* S3 파일 삭제 */
  deleteFiles: (requestData) => commonFetch('post/fileDelete', requestData),

  /* 게시물 리스트 삭제 */
  deleteBoardList: (requestData) => commonFetch('boardDelete', requestData),

  /* 좋아요 리스트 삭제(좋아요 취소) */
  deleteLikeList: (requestData) => commonFetch('likeDelete', requestData),

  /* 알림 조회 */
  getNotiList: (requestData) => commonFetch('notiList', requestData),

  /* 알림 조회 */
  updateNotiReadFlag: (requestData) =>
    commonFetch('update/notiList', requestData),

  /* 좋아요 로그 넣기 */
  updateLike: (requestData) => commonFetch('updateLike', requestData),

  /* 사용자 비밀번호 재설정 */
  resetUserPw: (requestData) =>
    commonFetch('resetUserPw', requestData, { noAuth: true }),

  /* 댓글 삭제 */
  deleteComment: (requestData) => commonFetch('commentDelete', requestData),
}

/* 공통 fetch */
async function commonFetch(endpoint, data, options = {}) {
  const token = localStorage.getItem('jwtToken')
  const headers = {
    ...(options.raw ? {} : { 'Content-Type': 'application/json' }),
    ...(options.noAuth ? {} : { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  }

  try {
    const response = await fetch(BASE_URL + endpoint, {
      method: options.method || 'POST',
      headers,
      body: options.raw ? data : JSON.stringify(data),
    })
    return await response.json()
  } catch (error) {
    console.error(`Fetch error at ${endpoint}:`, error)
    throw error
  }
}

import axios from 'axios'
// import { ElMessageBox } from 'element-plus'

const BASE_URL = 'http://3.38.151.156:8080/api/board/'
// const token = localStorage.getItem('jwtToken') // 저장된 JWT 토큰 가져오기

export default {
  /* 모든 게시물 조회 */
  getBoardList: async function (requestData) {
    try {
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(BASE_URL + 'list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })
      return await response.json()
    } catch (error) {
      console.error('Fetch error:', error)
    }
  },

  /* 게시물 생성 */
  createBoard: async function (requestData) {
    const token = localStorage.getItem('jwtToken')
    try {
      const response = await fetch(BASE_URL + 'post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })
      return await response.json()
    } catch (error) {
      console.error('Fetch error:', error)
    }
  },

  /* Presigned URL 발급 */
  getPresignedURL: async function (requestData) {
    try {
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(BASE_URL + 'post/fileUpload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: requestData, // Presigned URL 요청에 필요한 데이터
      })
      if (response.ok) {
        const presignedUrls = await response.json()
        return presignedUrls // 서버에서 받은 Presigned URL 반환
      } else {
        throw new Error('Get PresignedURL Fail.')
      }
    } catch (error) {
      console.error('Get PresignedURL: ', error)
    }
  },

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
  getBoardDetail: async function (requestData) {
    try {
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(BASE_URL + 'detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })
      return await response.json()
    } catch (error) {
      console.error('Fetch error:', error)
    }
  },

  /* 회원가입 */
  createUser: async function (requestData) {
    try {
      const response = await fetch(BASE_URL + 'signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
      return await response.json()
    } catch (error) {
      console.error('Fetch error:', error)
    }
  },

  /* 로그인 */
  login: async function (requestData) {
    try {
      const response = await fetch(BASE_URL + 'login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
      return await response.json()
    } catch (error) {
      console.error('Fetch error:', error)
    }
  },

  /* 아이디&비밀번호 찾기 */
  findIdPw: async function (requestData) {
    try {
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(BASE_URL + 'findIdPw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })
      return await response.json()
    } catch (error) {
      console.error('Fetch error:', error)
    }
  },

  /* 사용자 상세 보기 */
  userDetail: async function (requestData) {
    try {
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(BASE_URL + 'userDetail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })
      return await response.json()
    } catch (error) {
      console.error('Fetch error:', error)
    }
  },

  /* 사용자 상세 수정 */
  updateUserDetail: async function (requestData) {
    try {
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(BASE_URL + 'updateUserDetail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })
      return await response.json()
    } catch (error) {
      console.error('Fetch error:', error)
    }
  },

  /* 사용자 비밀번호 수정 */
  updateUserPw: async function (requestData) {
    try {
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(BASE_URL + 'updateUserPw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })
      return await response.json()
    } catch (error) {
      console.error('Fetch error:', error)
    }
  },

  /* View Count Redis에 적용 */
  updateCount: async function (requestData) {
    try {
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(BASE_URL + 'updateCount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })
      return await response.json()
    } catch (error) {
      console.error('Fetch error:', error)
    }
  },

  /* 댓글 생성 */
  createComment: async function (requestData) {
    try {
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(BASE_URL + 'post/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })
      return await response.json()
    } catch (error) {
      console.error('Fetch error:', error)
    }
  },

  /* S3 파일 삭제 */
  deleteFiles: async function (requestData) {
    try {
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(BASE_URL + 'post/fileDelete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })
      return await response.json()
    } catch (error) {
      console.error('Fetch error: ', error)
    }
  },

  /* 게시물 리스트 삭제 */
  deleteBoardList: async function (requestData) {
    try {
      const token = localStorage.getItem('jwtToken')
      const response = await fetch(BASE_URL + 'post/boardDelete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })
      return await response.json()
    } catch (error) {
      console.error('Fetch error: ', error)
    }
  },
}

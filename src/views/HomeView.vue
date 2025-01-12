<template>
  <div class="container">
    <el-text class="login-text">로그인</el-text>
    <div class="form-container">
      <el-form :model="form" label-width="auto" style="width: 100%">
        <el-form-item>
          <el-input v-model="form.id" placeholder="아이디" clearable autofocus>
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="비밀번호"
            show-password
            clearable
            autofocus
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" style="width: 100%"
            >로그인</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="button-container">
      <el-button type="text" @click="findPassword">비밀번호 찾기</el-button>
      <span class="separator"> | </span>
      <el-button type="text" @click="findId">아이디 찾기</el-button>
      <span class="separator"> | </span>
      <el-button type="text" @click="SignUp">회원가입</el-button>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import boardAPI from '../api/BoardAPI'
import { ElMessageBox } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '../store/auth'
export default {
  components: {
    User,
    Lock,
  },
  setup() {
    const router = useRouter()

    const form = reactive({
      id: '',
      password: '',
    })

    //로그인 버튼 클릭시 저장
    const login = async () => {
      //제목, 내용 입력했는지 확인
      if (!form.id || !form.password) {
        ElMessageBox.alert('아이디와 비밀번호를 입력해주세요!', '', {
          confirmButtonText: '확인',
          type: 'warning',
        }).catch(() => {})
      } else {
        //로그인 수행 API 호출
        const response = await boardAPI.login(form) // await 사용
        if (response?.success) {
          // 토큰 저장
          console.log('response.data, login ' + response.data)
          const token = response.data

          const authStore = useAuthStore()
          authStore.login(token)
          localStorage.setItem('jwtToken', token)
          console.log(
            'Token 저장 후 localStorage: ',
            localStorage.getItem('jwtToken')
          )

          // 리스트 페이지로 이동
          router.push({ path: '/board/list' })
        } else {
          ElMessageBox.alert('로그인에 실패하였습니다.', '', {
            confirmButtonText: '확인',
            type: 'error',
          }).catch(() => {})
        }
      }
    }

    //비밀번호 찾기 버튼 클릭시 저장
    const findPassword = async () => {
      router.push({ path: '/board/findpassword' })
    }

    //아이디 찾기 버튼 클릭시 저장
    const findId = async () => {
      router.push({ path: '/board/findid' })
    }

    //회원가입 버튼 클릭시 저장
    const SignUp = async () => {
      router.push({ path: '/board/signup' })
    }

    return {
      form,
      login,
      findPassword,
      findId,
      SignUp,
    }
  },
}
</script>

<style scoped>
.container {
  padding: 100px 500px 100px 500px;
  display: flex; /* 플렉스박스 사용 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  align-items: center; /* 수평 중앙 정렬 */
}
.login-text{
  font-size: 23px; /* 텍스트 크기 증가 */
  font-weight: bold; /* 텍스트 굵게 */
  text-align: center; /* 텍스트 중앙 정렬 */
  width: 100%; /* 중앙 정렬을 위해 width를 100%로 설정 */
  padding: 0 0 10px 0;
}
.form-container{
  border: 2px solid #c8c8c8; /* 테두리 추가 */
  border-radius: 10px; /* 모서리 둥글게 */
  padding: 20px 20px 8px 20px; /* 내부 여백 */
  margin: 20px; /* 외부 여백 추가 */
  width: 300px;
}
</style>

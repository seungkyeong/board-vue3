<template>
  <div class="container">
    <img
      :src="require('@/assets/logo.png')"
      alt="logo Image"
      class="logo-image"
      @click="toLogin"
    />
    <el-text class="find-text"
      >비밀번호를 찾고자하는 아이디와 이메일을 입력해주세요.</el-text
    >
    <div class="form-section">
      <div class="form-container">
        <el-form :model="form" label-width="auto" style="width: 100%">
          <el-form-item>
            <el-input
              v-model="form.id"
              placeholder="아이디"
              clearable
              autofocus
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            prop="email"
            :rules="[{ validator: validateEmail, trigger: 'blur' }]"
          >
            <el-input
              v-model="form.email"
              placeholder="이메일"
              clearable
              autofocus
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="signUp" style="width: 100%"
              >비밀번호 찾기</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-text class="id-text">아이디가 기억나지 않는다면? </el-text>
      <el-button type="text" class="text" @click="findId"
        >아이디 찾기</el-button
      >
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import boardAPI from '../api/BoardAPI'
import { ElMessageBox } from 'element-plus'
import { User, Message } from '@element-plus/icons-vue'
import { useTempUserStore } from '../store/tempUser'

export default {
  components: {
    User,
    Message,
  },
  setup() {
    const tempUserStore = useTempUserStore()
    const router = useRouter()

    const form = reactive({
      type: 'findPw',
      id: '',
      email: '',
    })

    //로그인 버튼 클릭시 저장
    const signUp = async () => {
      //모든 필드를 입력했는지 확인
      if (!form.id || !form.email) {
        ElMessageBox.alert('모든 필드를 입력해주세요!', '', {
          confirmButtonText: '확인',
          type: 'warning',
        }).catch(() => {})
      } else {
        //비밀번호 찾기 수행 API 호출
        const response = await boardAPI.findIdPw(form)
        if (response?.success) {
          tempUserStore.setUserSysNo(response.data)

          router.push({
            path: '/board/resetPassword',
          })
        } else {
          ElMessageBox.alert(response.message, '', {
            confirmButtonText: '확인',
            type: 'error',
          }).catch(() => {})
        }
      }
    }

    //아이디 찾기 번호 클릭시
    const findId = async () => {
      router.push({ path: '/board/findid' })
    }

    //로고 클릭시
    const toLogin = async () => {
      router.push({ path: '/' })
    }

    // 이메일 유효성 검사 함수
    const validateEmail = (rule, value, callback) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!value) {
        callback(new Error('이메일을 입력해주세요'))
      } else if (!emailPattern.test(value)) {
        callback(new Error('유효한 이메일 주소를 입력해주세요'))
      } else {
        callback()
      }
    }

    return {
      form,
      signUp,
      findId,
      toLogin,
      validateEmail,
    }
  },
}
</script>

<style scoped>
.container {
  padding: 20px 500px 100px 500px;
  display: flex; /* 플렉스박스 사용 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  align-items: center; /* 수평 중앙 정렬 */
}
.logo-image{
  height: 180px;
}
.find-text{
  font-size: 18px; /* 텍스트 크기 증가 */
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

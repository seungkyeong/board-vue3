<template>
  <div class="container">
    <img
      :src="require('@/assets/logo.png')"
      alt="logo Image"
      class="logo-image"
      @click="toLogin"
    />
    <div class="form-section">
      <el-text class="signUp-text">회원가입</el-text>
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
        </el-form>
      </div>
      <div class="form-container">
        <el-form :model="form" label-width="auto" style="width: 100%">
          <el-form-item>
            <el-input
              v-model="form.name"
              placeholder="이름"
              clearable
              autofocus
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="form.phone"
              placeholder="전화번호"
              clearable
              autofocus
            >
              <template #prefix>
                <el-icon><Iphone /></el-icon>
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
              >회원가입</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import boardAPI from '../api/BoardAPI'
import { ElMessageBox } from 'element-plus'
import { User, Lock, Iphone, Message } from '@element-plus/icons-vue'

export default {
  components: {
    User,
    Lock,
    Iphone,
    Message,
  },
  setup() {
    const router = useRouter()

    const form = reactive({
      id: '',
      password: '',
      name: '',
      phone: '',
      email: '',
    })

    //로그인 버튼 클릭시 저장
    const signUp = async () => {
      //모든 필드를 입력했는지 확인
      if (
        !form.id ||
        !form.password ||
        !form.name ||
        !form.phone ||
        !form.email
      ) {
        ElMessageBox.alert('모든 필드를 입력해주세요!', '', {
          confirmButtonText: '확인',
          type: 'warning',
        }).catch(() => {})
      } else {
        //회원가입 수행 API 호출
        const response = await boardAPI.createUser(form)
        if (response.success) {
          ElMessageBox.alert('저장되었습니다.', '', {
            confirmButtonText: '확인',
            type: 'success',
          }).catch(() => {})
          router.push({ path: '/board/' })
        } else {
          console.log('response.body', response.body)
          ElMessageBox.alert(response.message, '', {
            confirmButtonText: '확인',
            type: 'warning',
          }).catch(() => {})
          router.push({ path: '/board/' })
        }
      }
    }

    //로고 클릭시
    const toLogin = async () => {
      router.push({ path: '/board/' })
    }

    // 이메일 유효성 검사 함수
    const validateEmail = (rule, value, callback) => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      console.log('value', value)
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
      toLogin,
      validateEmail,
    }
  },
}
</script>

<style scoped>
.container {
  display: flex; /* 플렉스박스 사용 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  align-items: center; /* 수평 중앙 정렬 */
  height: 1500px;
}
.signUp-text{
  font-size: 23px; /* 텍스트 크기 증가 */
  font-weight: bold; /* 텍스트 굵게 */
  text-align: center; /* 텍스트 중앙 정렬 */
  width: 100%; /* 중앙 정렬을 위해 width를 100%로 설정 */
  padding: 0 0 10px 0;
  margin: 0 auto;
}
.img-text{
  font-size: 18px; /* 텍스트 크기 증가 */
  font-weight: bold; /* 텍스트 굵게 */
  text-align: center; /* 텍스트 중앙 정렬 */
  width: 100%; /* 중앙 정렬을 위해 width를 100%로 설정 */
  padding: 0 0 10px 0;
  white-space: normal; /* 텍스트 줄바꿈을 허용 */
  max-width: 280px; /* 최대 너비 설정 */
}
.form-container{
  border: 2px solid #c8c8c8; /* 테두리 추가 */
  border-radius: 10px; /* 모서리 둥글게 */
  padding: 20px 20px 8px 20px; /* 내부 여백 */
  margin: 20px; 
  width: 300px; 
}
.logo-image{
  height: 180px;
}
</style>

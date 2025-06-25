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
      <el-button type="text" @click="goToPage(ROUTES.FIND_PASSWORD)"
        >비밀번호 찾기</el-button
      >
      <span class="separator"> | </span>
      <el-button type="text" @click="goToPage(ROUTES.FIND_ID)"
        >아이디 찾기</el-button
      >
      <span class="separator"> | </span>
      <el-button type="text" @click="goToPage(ROUTES.SIGNUP)"
        >회원가입</el-button
      >
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import boardAPI from '../api/BoardAPI'
import { User, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '../store/auth'
import { ROUTES } from '../constant/routes'
import { MESSAGES } from '../constant/messages'
import { showAlertBox } from '../utils/elementUtils'
import { goToPage } from '../utils/routerUtils'

export default {
  components: {
    User,
    Lock,
  },
  setup() {
    const form = reactive({
      id: '',
      password: '',
    })

    /* 로그인 */
    const login = async () => {
      if (!form.id || !form.password) {
        //모든 필드 입력 확인
        await showAlertBox(MESSAGES.REQUIRE_ALL_FIELDS, MESSAGES.WARNING).catch(
          () => {}
        )
      } else {
        //로그인 수행 API 호출
        const response = await boardAPI.login(form)
        if (response?.success) {
          //토큰 저장
          const token = response.data.accessToken
          const authStore = useAuthStore()
          authStore.login(token)
          localStorage.setItem('jwtToken', token)

          // 리스트 페이지로 이동
          goToPage(ROUTES.BOARD_LIST)
        } else {
          await showAlertBox(MESSAGES.FAILED_LOGIN, MESSAGES.ERROR).catch(
            () => {}
          )
        }
      }
    }

    return {
      form,
      login,
      ROUTES,
      goToPage,
    }
  },
}
</script>

<style scoped>
.container {
  padding: 100px 500px 100px 500px;
  display: flex;                
  flex-direction: column;       /* 세로 방향으로 정렬 */
  align-items: center;          /* 수평 중앙 정렬 */
}
.login-text{
  font-size: 23px;              /* 텍스트 크기 증가 */
  font-weight: bold;            /* 텍스트 굵게 */
  text-align: center;           /* 텍스트 중앙 정렬 */
  width: 100%;                  /* 중앙 정렬, width를 100%로 설정 */
  padding: 0 0 10px 0;
}
.form-container{
  border: 2px solid #c8c8c8;  /* 테두리 추가 */
  border-radius: 10px;          /* 모서리 둥글게 */
  padding: 20px 20px 8px 20px;  /* 내부 여백 */
  margin: 20px;                 /* 외부 여백 추가 */
  width: 300px;
}
</style>

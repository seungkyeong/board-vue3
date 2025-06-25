<template>
  <div class="container">
    <img
      :src="require('@/assets/logo.png')"
      alt="logo Image"
      class="logo-image"
      @click="goToPage(ROUTES.HOME)"
    />
    <el-text class="find-text"
      >아이디를 찾고자하는 이메일을 입력해주세요.</el-text
    >
    <div class="form-container">
      <el-form
        :model="form"
        :rules="formRules"
        label-width="auto"
        style="width: 100%"
      >
        <el-form-item prop="email">
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
          <el-button type="primary" @click="findId" style="width: 100%"
            >아이디 찾기</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import boardAPI from '../api/BoardAPI'
import { Message } from '@element-plus/icons-vue'
import { goToPage } from '../utils/routerUtils'
import { ROUTES } from '../constant/routes'
import { MESSAGES } from '../constant/messages'
import { showAlertBox } from '../utils/elementUtils'
import { validateEmail } from '../utils/commonUtils'

export default {
  components: {
    Message,
  },
  setup() {
    const form = reactive({
      type: 'findId',
      email: '',
    })

    /* 아이디 찾기 */
    const findId = async () => {
      if (!form.email) {
        //모든 필드 입력 확인
        await showAlertBox(
          MESSAGES.REQUIRE_EMAIL_FIELDS,
          MESSAGES.WARNING
        ).catch(() => {})
      } else {
        //아이디 찾기 API 호출
        const response = await boardAPI.findIdPw(form)
        if (response.success) {
          goToPage(ROUTES.RESULT_ID, { result: response.data })
        } else {
          await showAlertBox(response.message, MESSAGES.ERROR).catch(() => {})
        }
      }
    }

    /* 이메일 유효성 */
    const formRules = { email: [{ validator: validateEmail, trigger: 'blur' }] }

    return {
      form,
      findId,
      goToPage,
      validateEmail,
      ROUTES,
      formRules,
    }
  },
}
</script>

<style scoped>
.container {
  padding: 20px 500px 100px 500px;
  display: flex; 
  flex-direction: column; 
  align-items: center; 
}
.logo-image{
  height: 180px;
}
.find-text{
  font-size: 20px; 
  font-weight: bold; 
  text-align: center; 
  width: 100%;
  padding: 0 0 10px 0;
}
.form-container{
  border: 2px solid #c8c8c8; 
  border-radius: 10px; 
  padding: 20px 20px 8px 20px; 
  margin: 20px;
  width: 300px;
}
</style>

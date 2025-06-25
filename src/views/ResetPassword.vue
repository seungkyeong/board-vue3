<template>
  <div class="container">
    <el-text class="reset-text">비밀번호 재설정하기</el-text>

    <div class="form-container">
      <el-form :model="form" label-width="auto" style="width: 100%">
        <el-form-item>
          <el-input
            v-model="form.newPassword"
            placeholder="비밀번호"
            clearable
            autofocus
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="비밀번호 재확인"
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
          <el-button type="primary" @click="resetPassword" style="width: 100%"
            >재설정하기</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import boardAPI from '../api/BoardAPI'
import { Lock } from '@element-plus/icons-vue'
import { useTempUserStore } from '../store/tempUser'
import { showAlertBox } from '../utils/elementUtils'
import { goToPage } from '../utils/routerUtils'
import { ROUTES } from '../constant/routes'
import { MESSAGES } from '../constant/messages'

export default {
  components: {
    Lock,
  },
  setup() {
    const tempUserStore = useTempUserStore()

    const userSysNo = tempUserStore.getUserSysNo

    const form = reactive({
      sysNo: userSysNo,
      newPassword: '',
      confirmPassword: '',
    })

    /* 비밀번호 재설정 */
    const resetPassword = async () => {
      if (!form.newPassword || !form.confirmPassword) {
        //모든 필드 입력 확인
        await showAlertBox(MESSAGES.REQUIRE_ALL_FIELDS, MESSAGES.WARNING).catch(
          () => {}
        )
      } else {
        //비밀번호 재설정 API 호출
        const response = await boardAPI.resetUserPw(form)
        if (response?.success) {
          await showAlertBox(
            MESSAGES.SUCCESS_CHANGE_PW,
            MESSAGES.SUCCESS
          ).catch(() => {})

          // 로그인 페이지로 이동
          goToPage(ROUTES.HOME)
        } else {
          await showAlertBox(MESSAGES.FAILED_CHANGE_PW, MESSAGES.ERROR).catch(
            () => {}
          )
        }
      }
    }

    return {
      form,
      resetPassword,
      goToPage,
      ROUTES,
    }
  },
}
</script>

<style scoped>
.container {
  padding: 100px 500px 100px 500px;
  display: flex; 
  flex-direction: column; 
  align-items: center;
}
.reset-text{
  font-size: 23px; 
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

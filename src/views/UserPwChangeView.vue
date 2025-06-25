<template>
  <div class="container">
    <el-dialog
      v-model="userPwChangeDialogVisible"
      @close="closeDialog"
      width="30%"
      center
    >
      <div class="modal-content">
        <el-text class="modify_text">비밀번호 변경</el-text>
        <div class="form-container">
          <el-form :model="form" label-width="auto" style="width: 100%">
            <el-form-item>
              <el-input
                v-model="form.currentPassword"
                type="password"
                placeholder="현재 비밀번호"
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
              <el-input
                v-model="form.newPassword"
                type="password"
                placeholder="새로운 비밀번호"
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
              <div class="button-container">
                <el-button
                  type="primary"
                  @click="closeDialog"
                  style="width: 100%"
                  >취소</el-button
                >
                <el-button type="primary" @click="modify" style="width: 100%"
                  >수정</el-button
                >
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, watch, toRefs } from 'vue'
import { useAuthStore } from '../store/auth'
import boardAPI from '../api/BoardAPI'
import { Lock } from '@element-plus/icons-vue'
import { MESSAGES } from '../constant/messages'
import { showAlertBox } from '../utils/elementUtils'

export default {
  components: {
    Lock,
  },
  props: {
    userPwChangeVisible: {
      type: Boolean,
      required: true,
    },
    sysNo: {
      type: String,
      required: true,
    },
  },
  emits: ['update:userPwChangeVisible'],
  setup(props, { emit }) {
    const authStore = useAuthStore()

    const userPwChangeDialogVisible = ref(props.userPwChangeVisible) //사용자 비밀번호 변경 창 표시 여부
    const userId = authStore.getUserId

    const form = reactive({
      currentPassword: '',
      newPassword: '',
      sysNo: toRefs(props).sysNo,
    })

    /* 비밀번호 변경 창 표시 여부(userPwChangeDialogVisible) 변경 시 반영 */
    watch(
      () => props.userPwChangeVisible,
      (newVal) => {
        userPwChangeDialogVisible.value = newVal
      }
    )

    /* 비밀번호 변경 Dialog 닫기 */
    const closeDialog = () => {
      emit('update:userPwChangeVisible', false)
    }

    /* 비밀번호 수정 */
    const modify = async () => {
      if (!form.currentPassword || !form.newPassword) {
        //모든 필드 입력 확인
        await showAlertBox(MESSAGES.REQUIRE_ALL_FIELDS, MESSAGES.WARNING).catch(
          () => {}
        )
      } else {
        //사용자 비밀번호 수정 API 호출
        const response = await boardAPI.updateUserPw(form)
        if (response.success) {
          form.currentPassword = ''
          form.newPassword = ''

          await showAlertBox(MESSAGES.SUCCESS_SAVE, MESSAGES.SUCCESS).finally(
            () => {
              closeDialog()
            }
          )
        } else {
          await showAlertBox(response.message, MESSAGES.WARNING).catch(() => {})
        }
      }
    }

    return {
      form,
      modify,
      userPwChangeDialogVisible,
      closeDialog,
      userId,
    }
  },
}
</script>

<style scoped>
.container {
    padding: 100px 600px 100px 600px;
}
.form-container{
  border: 2px solid #c8c8c8; 
  border-radius: 10px; 
  padding: 20px 20px 8px 20px; 
  margin: 20px; 
}
.modify_text{
 font-size: 18px; 
 font-weight: bold;
}
.button-container{
  display: flex;
  justify-content: space-between;
  width: 100%; 
}
</style>

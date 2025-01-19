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
import { ElMessageBox } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'

export default {
  components: {
    Lock,
  },
  props: {
    userPwChangeVisible: {
      type: Boolean,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    sysNo: {
      type: String,
      required: true,
    },
  },
  emits: ['update:userPwChangeVisible', 'update:password'], // 명시적으로 정의
  setup(props, { emit }) {
    const authStore = useAuthStore()

    const userPwChangeDialogVisible = ref(props.userPwChangeVisible)
    const userId = authStore.getUserId

    const form = reactive({
      currentPassword: '',
      newPassword: '',
      sysNo: toRefs(props).sysNo,
    })

    // props.visible 변경 시 반영
    watch(
      () => props.userPwChangeVisible,
      (newVal) => {
        userPwChangeDialogVisible.value = newVal
      }
    )

    const closeDialog = () => {
      emit('update:userPwChangeVisible', false) // 부모에게 visible=false를 전달
    }

    //수정 버튼 클릭시 저장
    const modify = async () => {
      console.log('form.currentPassword ' + form.currentPassword)
      console.log('password.value ' + JSON.stringify(toRefs(props).password))
      console.log(
        'toRefs(props).password.value ' + toRefs(props).password.value
      )

      //모든 필드를 입력했는지 확인
      if (!form.currentPassword || !form.newPassword) {
        ElMessageBox.alert('모든 필드를 입력해주세요!', '', {
          confirmButtonText: '확인',
          type: 'warning',
        }).catch(() => {})
      } else {
        if (form.currentPassword.trim() != toRefs(props).password.value) {
          ElMessageBox.alert('현재 비밀번호를 제대로 입력해주세요!', '', {
            confirmButtonText: '확인',
            type: 'warning',
          }).catch(() => {})
        } else {
          //사용자 상세 수정 수행 API 호출
          const response = await boardAPI.updateUserPw(form)
          if (response.success) {
            emit('update:password', form.newPassword)
            form.newPassword = ''
            form.currentPassword = ''

            ElMessageBox.alert('저장되었습니다.', '', {
              confirmButtonText: '확인',
              type: 'success',
            })
              .then(() => {
                closeDialog()
              })
              .catch(() => {
                closeDialog()
              })
          } else {
            ElMessageBox.alert(response.message, '', {
              confirmButtonText: '확인',
              type: 'warning',
            }).catch(() => {})
          }
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
  border: 2px solid #c8c8c8; /* 테두리 추가 */
  border-radius: 10px; /* 모서리 둥글게 */
  padding: 20px 20px 8px 20px; /* 내부 여백 */
  margin: 20px; /* 외부 여백 추가 */
}
.modify_text{
 font-size: 18px; 
 font-weight: bold;
}
.button-container{
  display: flex;
  justify-content: space-between; /* 버튼을 양쪽으로 나눔 */
  width: 100%; /* 부모의 너비를 100%로 설정 */
}
</style>

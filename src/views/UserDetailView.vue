<template>
  <div class="container">
    <el-dialog
      v-model="userDetailDialogVisible"
      @close="closeDialog"
      width="30%"
    >
      <div class="modal-content">
        <el-text class="modify_text">{{ userId }} 수정</el-text>
        <div class="form-container">
          <el-form :model="form" label-width="auto" style="width: 100%">
            <el-form-item>
              <el-input
                v-model="form.id"
                placeholder="아이디"
                disabled
                clearable
                autofocus
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
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
            <el-form-item>
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
              <el-button type="primary" @click="pwChange" style="width: 100%"
                >비밀번호 변경</el-button
              >
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

  <!-- 비밀번호 변경 팝업 연결-->
  <UserPwChangeView
    v-model:userPwChangeVisible="isUserPwChangeVisible"
    :sysNo="form.sysNo"
    :password="password"
  />
</template>

<script>
import { reactive, ref, watch, computed } from 'vue'
import { useAuthStore } from '../store/auth'
import boardAPI from '../api/BoardAPI'
import { User, Iphone, Message } from '@element-plus/icons-vue'
import UserPwChangeView from '../views/UserPwChangeView.vue'
import { MESSAGES } from '../constant/messages'
import { showAlertBox } from '../utils/elementUtils'

export default {
  components: {
    User,
    Iphone,
    Message,
    UserPwChangeView,
  },
  props: {
    userDetailVisible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:userDetailVisible'],
  setup(props, { emit }) {
    const authStore = useAuthStore()

    const isUserPwChangeVisible = ref(false) //사용자 비밀번호 변경 창 표시 여부
    const userDetailDialogVisible = ref(props.userDetailVisible) //사용자 상세 정보 창 표시 여부
    const userId = computed(() => authStore.getUserId)
    const userSysNo = computed(() => authStore.getSysNo)
    let password = ref('')

    const form = reactive({
      id: '',
      name: '',
      phone: '',
      email: '',
      sysNo: '',
    })

    /* 사용자 상세 정보 창 표시 여부(userDetailVisible) 변경 시 반영 */
    watch(
      () => props.userDetailVisible,
      (newVal) => {
        userDetailDialogVisible.value = newVal
        if (newVal) {
          // 다이얼로그가 열릴 때만 사용자 상세 정보 조회 API 호출
          getUserDetail()
        }
      }
    )

    /* 사용자 정보 상세 Dialog 닫기 */
    const closeDialog = () => {
      //Profile(부모)에 사용자 정보 상세 보기 false로 전달
      emit('update:userDetailVisible', false)
    }

    /* 사용자 비밀번호 변경 화면 이동 */
    const pwChange = () => {
      isUserPwChangeVisible.value = true
    }

    /* 사용자 정보 상세 조회 */
    const getUserDetail = async () => {
      console.log('userSysNo: ' + userSysNo.value)
      const response = await boardAPI.userDetail({
        id: userId.value,
        userSysNo: userSysNo.value,
      })
      if (response.success) {
        form.id = response.data.id
        form.name = response.data.name
        form.phone = response.data.phone
        form.email = response.data.email
        form.sysNo = response.data.sysNo
        password.value = response.data.password
      }
    }

    /* 사용자 상세 정보 수정 */
    const modify = async () => {
      if (!form.id || !form.name || !form.phone || !form.email) {
        //모든 필드 입력 확인
        await showAlertBox(MESSAGES.REQUIRE_ALL_FIELDS, MESSAGES.WARNING).catch(
          () => {}
        )
      } else {
        //사용자 상세 수정 API 호출
        const response = await boardAPI.updateUserDetail(form)
        if (response.success) {
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
      userDetailDialogVisible,
      closeDialog,
      userId,
      pwChange,
      getUserDetail,
      isUserPwChangeVisible,
      password,
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

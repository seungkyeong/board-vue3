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
    @update:userPwChangeVisible="handleUserPwChangeClose"
    @update:password="updatePassword"
    :sysNo="form.sysNo"
    :password="password"
  />
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { useAuthStore } from '../store/auth'
import boardAPI from '../api/BoardAPI'
import { ElMessageBox } from 'element-plus'
import { User, Iphone, Message } from '@element-plus/icons-vue'
import UserPwChangeView from '../views/UserPwChangeView.vue' // DetailView 컴포넌트 임포트

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
  emits: ['update:userDetailVisible'], // 명시적으로 정의
  setup(props, { emit }) {
    const authStore = useAuthStore()
    const isUserPwChangeVisible = ref(false)

    let password = ref('')

    const form = reactive({
      id: '',
      name: '',
      phone: '',
      email: '',
      sysNo: '',
    })

    const userDetailDialogVisible = ref(props.userDetailVisible)
    const userId = authStore.getUserId
    const userSysNo = authStore.getUserSysNo

    // props.visible 변경 시 반영
    watch(
      () => props.userDetailVisible,
      (newVal) => {
        userDetailDialogVisible.value = newVal
        if (newVal) {
          // 다이얼로그가 열릴 때만 API 호출
          getUserDetail()
        }
      }
    )

    const closeDialog = () => {
      emit('update:userDetailVisible', false) // 부모에게 visible=false를 전달
    }

    // 프로필 상세 페이지로 이동
    const pwChange = () => {
      isUserPwChangeVisible.value = true
    }

    const handleUserPwChangeClose = (value) => {
      isUserPwChangeVisible.value = value
    }

    const updatePassword = (value) => {
      password.value = value
    }

    //로드시 사용자 상세 조회
    const getUserDetail = async () => {
      const response = await boardAPI.userDetail({
        id: userId,
        sysNo: userSysNo,
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

    //수정 버튼 클릭시 저장
    const modify = async () => {
      //모든 필드를 입력했는지 확인
      if (!form.id || !form.name || !form.phone || !form.email) {
        ElMessageBox.alert('모든 필드를 입력해주세요!', '', {
          confirmButtonText: '확인',
          type: 'warning',
        }).catch(() => {})
      } else {
        //사용자 상세 수정 수행 API 호출
        const response = await boardAPI.updateUserDetail(form)
        if (response.success) {
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

    return {
      form,
      modify,
      userDetailDialogVisible,
      closeDialog,
      userId,
      handleUserPwChangeClose,
      pwChange,
      getUserDetail,
      isUserPwChangeVisible,
      updatePassword,
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

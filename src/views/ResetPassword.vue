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
import { useRouter } from 'vue-router'
import boardAPI from '../api/BoardAPI'
import { ElMessageBox } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'
import { useTempUserStore } from '../store/tempUser'

export default {
  components: {
    Lock,
  },
  setup() {
    const tempUserStore = useTempUserStore()
    const router = useRouter()

    const userSysNo = tempUserStore.getUserSysNo

    const form = reactive({
      sysNo: userSysNo,
      newPassword: '',
      confirmPassword: '',
    })

    //비밀번호 재설정 버튼 클릭시 저장
    const resetPassword = async () => {
      //제목, 내용 입력했는지 확인
      if (!form.newPassword || !form.confirmPassword) {
        ElMessageBox.alert('모든 필드를 입력해주세요!', '', {
          confirmButtonText: '확인',
          type: 'warning',
        }).catch(() => {})
      } else {
        //비밀번호 재설정 수행 API 호출
        const response = await boardAPI.resetUserPw(form)
        if (response?.success) {
          ElMessageBox.alert('비밀번호 변경이 완료되었습니다.', '', {
            confirmButtonText: '확인',
            type: 'success',
          }).catch(() => {})

          // 로그인 페이지로 이동
          router.push({ path: '/' })
        } else {
          ElMessageBox.alert('비밀번호 재설정에 실패하였습니다.', '', {
            confirmButtonText: '확인',
            type: 'error',
          }).catch(() => {})
        }
      }
    }

    return {
      form,
      resetPassword,
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
.reset-text{
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

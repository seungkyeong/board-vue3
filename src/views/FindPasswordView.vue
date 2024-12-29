<template>
  <div class="container">
    <el-text class="find-text"
      >비밀번호를 찾고자하는 아이디를 입력해주세요.</el-text
    >
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
          <el-button type="primary" @click="signUp" style="width: 100%"
            >비밀번호 찾기</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-text class="id-text">아이디가 기억나지 않는다면? </el-text>
    <el-button type="text" class="text" @click="findId">아이디 찾기</el-button>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import boardAPI from '../api/BoardAPI'
import { ElMessageBox } from 'element-plus'
import { User } from '@element-plus/icons-vue'

export default {
  components: {
    User,
  },
  setup() {
    const router = useRouter()

    const form = reactive({
      id: '',
    })

    //로그인 버튼 클릭시 저장
    const signUp = async () => {
      //모든 필드를 입력했는지 확인
      if (!form.id) {
        ElMessageBox.alert('아이디를 입력해주세요!', '', {
          confirmButtonText: '확인',
          type: 'warning',
        })
      } else {
        //비밀번호 찾기 수행 API 호출
        boardAPI
          .findIdPw(form)
          .then((response) => {
            console.log(response)
            if (response?.success) {
              // router.push({ path: '/board/list' })
              console.log(response.success)
            } else {
              ElMessageBox.alert(response.message, '', {
                confirmButtonText: '확인',
                type: 'error',
              })
            }
          })
          .catch((error) => console.error('Fail:', error))
      }
    }

    //아이디 찾기 번호 클릭시
    const findId = async () => {
      router.push({ path: '/board/findid' })
    }

    return {
      form,
      signUp,
      findId,
    }
  },
}
</script>

<style scoped>
.container {
    padding: 100px 600px 100px 600px;
}
.find-text{
  font-size: 20px; /* 텍스트 크기 증가 */
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
}
</style>

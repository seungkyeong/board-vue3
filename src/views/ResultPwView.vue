<template>
  <div class="container">
    <div class="logo-container">
      <img
        :src="require('@/assets/logo.png')"
        alt="logo Image"
        class="logo-image"
        @click="toLogin"
      />
    </div>
    <hr style="margin-bottom: 30px" />
    <el-text class="find-text"
      >고객님의 정보와 일치하는 비밀번호 입니다.</el-text
    >
    <div class="formAndBut-container">
      <div class="form-container">
        <el-form :model="form" label-width="auto" style="width: 100%">
          <el-form-item>
            <el-text v-model="form.result" class="result-text">{{
              result
            }}</el-text>
          </el-form-item>
        </el-form>
      </div>
      <div class="button-container">
        <el-button type="primary" @click="toLogin" style="width: 100%"
          >로그인하기</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  components: {},
  setup() {
    const router = useRouter()
    const route = useRoute()

    const form = reactive({
      result: '',
    })

    const result = route.query.result

    //로그인하기 버튼 클릭시 저장
    const toLogin = async () => {
      router.push({ path: '/' })
    }

    //비밀번호 찾기 버튼 클릭시 저장
    const toFindPw = async () => {
      router.push({ path: '/board/findpassword' })
    }

    return {
      form,
      toLogin,
      toFindPw,
      result,
    }
  },
}
</script>

<style scoped>
.container {
    padding: 0px 300px 100px 300px;
}
.find-text{
  font-size: 20px; /* 텍스트 크기 증가 */
  font-weight: bold; /* 텍스트 굵게 */
  text-align: center; /* 텍스트 중앙 정렬 */
  width: 100%; /* 중앙 정렬을 위해 width를 100%로 설정 */
  padding: 0 0 10px 0;
}
.result-text{
  font-size: 17px; /* 텍스트 크기 증가 */
  text-align: center; /* 텍스트 중앙 정렬 */
  width: 100%; /* 중앙 정렬을 위해 width를 100%로 설정 */
}
.form-container{
  border: 2px solid #c8c8c8; /* 테두리 추가 */
  border-radius: 10px; /* 모서리 둥글게 */
  padding: 20px 20px 8px 20px; /* 내부 여백 */
  margin: 40px 20px 20px 20px; /* 외부 여백 추가 */
  width: 80%;
}
.logo-container {
  width: 100%;
  display: flex;
  justify-content: flex-start; /* 왼쪽 정렬 */
}
.logo-image{
  height: 180px;
}
.button-container {
    display: flex; 
    justify-content: center; 
    width: 250px;
    margin: 20px;
}
.formAndBut-container{
  display: flex; /* 플렉스박스 사용 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  align-items: center; /* 수평 중앙 정렬 */
}
</style>

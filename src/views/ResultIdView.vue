<template>
  <div class="container">
    <div class="logo-container">
      <img
        :src="require('@/assets/logo.png')"
        alt="logo Image"
        class="logo-image"
        @click="goToPage(ROUTES.HOME)"
      />
    </div>
    <hr style="margin-bottom: 30px" />
    <el-text class="find-text">고객님의 정보와 일치하는 아이디 입니다.</el-text>
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
        <el-button
          type="primary"
          @click="goToPage(ROUTES.HOME)"
          style="width: 100%"
          >로그인하기</el-button
        >
        <el-button
          type="primary"
          @click="goToPage(ROUTES.FIND_PASSWORD)"
          style="width: 100%"
          >비밀번호 찾기</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { ROUTES } from '../constant/routes'
import { goToPage } from '../utils/routerUtils'

export default {
  components: {},
  setup() {
    const route = useRoute()

    const form = reactive({
      result: '',
    })

    const result = route.query.result

    return {
      form,
      goToPage,
      result,
      ROUTES,
    }
  },
}
</script>

<style scoped>
.container {
    padding: 0px 300px 100px 300px;
}
.find-text{
  font-size: 20px; 
  font-weight: bold; 
  text-align: center;
  width: 100%;
  padding: 0 0 10px 0;
}
.result-text{
  font-size: 17px; 
  text-align: center; 
  width: 100%; 
}
.form-container{
  border: 2px solid #c8c8c8; 
  border-radius: 10px; 
  padding: 20px 20px 8px 20px;
  margin: 40px 20px 20px 20px; 
  width: 80%;
}
.logo-container {
  width: 100%;
  display: flex;
  justify-content: flex-start; 
}
.logo-image{
  height: 180px;
}
.button-container {
    display: flex; 
    justify-content: center; 
    width: 500px;
    margin: 20px;
}
.formAndBut-container{
  display: flex; 
  flex-direction: column; 
  align-items: center; 
}
</style>

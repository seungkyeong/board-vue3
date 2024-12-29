<template>
  <div class="user-profile">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#fff"
    >
      <el-menu-item index="1" @click="goToBoardList">Home</el-menu-item>
      <el-sub-menu index="2">
        <template #title>
          <el-avatar
            class="avatar"
            :size="50"
            :src="require('@/assets/profile.png')"
          />
          {{ userId }}
        </template>
        <el-menu-item index="2-2" @click="userDetail">{{
          userId
        }}</el-menu-item>
        <el-menu-item index="2-1" @click="logout">로그아웃</el-menu-item>
      </el-sub-menu>
    </el-menu>

    <!-- 사용자 상세 수정 팝업 연결 -->
    <UserDetailView
      v-model:userDetailVisible="isUserDetailVisible"
      @update:userDetailVisible="handleUserDetailClose"
    />
  </div>
</template>

<script>
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import UserDetailView from '../views/UserDetailView.vue' // DetailView 컴포넌트 임포트

export default {
  name: 'UserProfile',
  components: {
    UserDetailView,
  },
  setup() {
    const authStore = useAuthStore() // Pinia store 가져오기
    const router = useRouter()

    const userId = authStore.getUserId
    const isUserDetailVisible = ref(false)

    // 프로필 상세 페이지로 이동
    const userDetail = () => {
      isUserDetailVisible.value = true
    }

    // 로그아웃 처리
    const logout = () => {
      authStore.logout()
      router.push({ path: '/board/' })
    }

    const goToBoardList = () => {
      router.push({ path: '/board/list' })
    }

    const handleUserDetailClose = (value) => {
      isUserDetailVisible.value = value
    }

    return {
      handleUserDetailClose,
      userDetail,
      logout,
      goToBoardList,
      authStore,
      userId,
      isUserDetailVisible,
    }
  },
}
</script>

<style scoped>
.avatar {
  width: 30px; /* 사진 크기 */
  height: 30px;
  margin-right: 8px; /* 텍스트와의 간격 */
  border-radius: 50%; /* 동그랗게 유지 */

  }
.el-menu-demo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10; /* 메뉴가 다른 요소 위에 오도록 설정 */
}
.el-menu-demo .el-menu-item.is-active,
.el-menu-demo .el-sub-menu .el-menu-item.is-active {
  border-bottom: none !important; /* 활성화된 메뉴 아이템의 밑줄 제거 */
  color: #fff !important; /* 활성화된 텍스트 색상 설정 */
  background-color: transparent !important; /* 배경색 제거 */
}
.el-dialog {
  z-index: 2000; /* 모달 창이 다른 요소들 위에 오도록 설정 */
}
.user-profile {
  max-height: 100px; /* Profile의 높이를 제한 */
  overflow: hidden; /* 넘치는 내용은 잘라냄 */
  margin-bottom: 10px; /* 프로필과 리스트 사이에 간격을 두어 레이아웃을 정리 */
}
</style>

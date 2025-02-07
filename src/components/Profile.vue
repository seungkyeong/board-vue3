<template>
  <div class="user-profile">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      background-color="grey"
      text-color="white"
      active-text-color="white"
    >
      <div class="menu-left">
        <el-menu-item index="1" @click="goToBoardList">Home</el-menu-item>
        <el-menu-item index="2" @click="goToViewTopList"
          >조회수 TOP</el-menu-item
        >
        <el-menu-item index="3" @click="goToLikeTopList"
          >좋아요 TOP</el-menu-item
        >
        <el-menu-item index="4" @click="goToBoardList">공지사항</el-menu-item>
      </div>
      <div class="menu-right">
        <el-sub-menu index="5" class="user-menu">
          <template #title>
            <el-avatar
              class="avatar"
              :size="50"
              :src="require('@/assets/profile.png')"
            />
            {{ userId }}
          </template>
          <el-menu-item index="5-4" @click="userDetail" class="user-menu">{{
            userId
          }}</el-menu-item>
          <el-menu-item index="5-3" @click="goToMyBoardList" class="user-menu"
            >내 게시글 관리</el-menu-item
          >
          <el-menu-item index="5-2" @click="goToMyLikeList" class="user-menu"
            >👍 좋아요 목록</el-menu-item
          >
          <el-menu-item index="5-1" @click="logout" class="user-menu"
            >로그아웃</el-menu-item
          >
        </el-sub-menu>
      </div>
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
import { ref, computed } from 'vue'
import UserDetailView from '../views/UserDetailView.vue'

export default {
  name: 'UserProfile',
  components: {
    UserDetailView,
  },
  setup() {
    const authStore = useAuthStore() // Pinia store 가져오기
    const router = useRouter()

    const userId = computed(() => authStore.getUserId)

    const isUserDetailVisible = ref(false)

    // 프로필 상세 화면 이동
    const userDetail = () => {
      isUserDetailVisible.value = true
    }

    // 로그아웃 처리
    const logout = () => {
      authStore.logout()
      router.push({ path: '/' })
    }

    //게시판 목록 화면 이동
    const goToBoardList = () => {
      router.push({ path: '/board/list' })
    }

    //사용자 상세 팝업 Flag
    const handleUserDetailClose = (value) => {
      isUserDetailVisible.value = value
    }

    //좋아요 TOP 목록 화면 이동
    const goToLikeTopList = () => {
      router.push({ path: '/board/likeTopList' })
    }

    //조회수 TOP 목록 화면 이동
    const goToViewTopList = () => {
      router.push({ path: '/board/viewTopList' })
    }

    //내 게시글 관리 화면 이동
    const goToMyBoardList = () => {
      router.push({ path: '/board/myBoardList' })
    }

    //내 좋아요 목록 화면 이동
    const goToMyLikeList = () => {
      router.push({ path: '/board/myLikeList' })
    }

    return {
      handleUserDetailClose,
      userDetail,
      logout,
      goToBoardList,
      authStore,
      userId,
      isUserDetailVisible,
      goToLikeTopList,
      goToViewTopList,
      goToMyBoardList,
      goToMyLikeList,
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
  color: white !important; /* 활성화된 텍스트 색상 설정 */
  background-color: transparent !important; /* 배경색 제거 */
}
.menu-left{
  display:flex;
}
.menu-right{
  display:flex;
  align-items:center;
}
.el-dialog {
  z-index: 2000; /* 모달 창이 다른 요소들 위에 오도록 설정 */
}
.user-profile {
  max-height: 100px; /* Profile의 높이를 제한 */
  overflow: hidden; /* 넘치는 내용은 잘라냄 */
  margin-bottom: 10px; /* 프로필과 리스트 사이에 간격을 두어 레이아웃을 정리 */
}
.user-menu{
  width: 200px;
  /* font-weight: bold; */
}
/* .el-menu-demo .el-menu-item,
.el-menu-demo .el-sub-menu .el-menu-item {
  font-weight: bold; 
} */
</style>

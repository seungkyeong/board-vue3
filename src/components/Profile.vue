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
        <el-menu-item index="1" @click="goToPage(ROUTES.BOARD_LIST)"
          >Home</el-menu-item
        >
        <el-menu-item index="2" @click="goToPage(ROUTES.VIEW_TOP_BOARD_LIST)"
          >조회수 TOP</el-menu-item
        >
        <el-menu-item index="3" @click="goToPage(ROUTES.LIKE_TOP_BOARD_LIST)"
          >좋아요 TOP</el-menu-item
        >
        <el-menu-item index="4" @click="goToPage('/board/testList')"
          >공지사항</el-menu-item
        >
      </div>
      <div class="menu-right">
        <div class="session-timer" v-if="true">
          <el-button
            v-if="remainingTime <= 60"
            type="warning"
            size="small"
            @click="extendSession"
          >
            로그인 연장
          </el-button>
        </div>

        <el-dropdown trigger="click">
          <el-icon
            v-if="!notiFlag"
            class="no-noti-bell"
            @click="openNoti"
            style="color: #c8c8c8"
            ><Bell
          /></el-icon>
          <el-icon
            v-if="notiFlag"
            class="yes-noti-bell"
            @click="openNoti"
            style="color: #c8c8c8"
            ><BellFilled
          /></el-icon>
          <template v-slot:dropdown>
            <div class="dropdown-scroll-container">
              <el-dropdown-item
                v-for="(notification, index) in notifications"
                :key="index"
                @click="goToBoardDetail(notification)"
                :class="{
                  'read-noti': notification.readFlag,
                  'unread-noti': !notification.readFlag,
                }"
              >
                <a
                  :href="`/board/detail/${notification.boardSysNo}`"
                  class="notification-link"
                >
                  [<span class="title">{{ notification.title }} </span>] 에
                  댓글이 달렸습니다.
                </a>
              </el-dropdown-item>
              <el-dropdown-item v-if="notifications.length === 0" disabled
                >새 알림 없음</el-dropdown-item
              >
            </div>
          </template>
        </el-dropdown>

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
          <el-menu-item
            index="5-3"
            @click="goToPage(ROUTES.MY_BOARD_LIST)"
            class="user-menu"
            >내 게시글 관리</el-menu-item
          >
          <el-menu-item
            index="5-2"
            @click="goToPage(ROUTES.MY_LIKE_BOARD_LIST)"
            class="user-menu"
            >내 좋아요 관리</el-menu-item
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
import { ref, onMounted, onUnmounted } from 'vue'
import UserDetailView from '../views/UserDetailView.vue'
import { Bell, BellFilled } from '@element-plus/icons-vue'
import boardAPI from '../api/BoardAPI'
import { goToPage } from '../utils/routerUtils'
import { ROUTES } from '../constant/routes'

export default {
  name: 'UserProfile',
  components: {
    UserDetailView,
    Bell,
    BellFilled,
  },
  setup() {
    const authStore = useAuthStore()
    const userId = authStore.getUserId
    const userSysNo = authStore.getSysNo

    const isUserDetailVisible = ref(false) //사용자 정보 상세 창 표시 여부
    const notifications = ref([]) //현재 표시 중인 알림 목록
    const notiLength = ref(0) //알림 개수
    const notiFlag = ref(false) //알림 유무 플래그
    let socket

    /* 사용자 정보 상세 화면 이동 */
    const userDetail = () => {
      isUserDetailVisible.value = true
    }

    /* 로그아웃 */
    const logout = () => {
      authStore.logout()
      goToPage(ROUTES.HOME)
    }

    /* 사용자 정보 상세 창 표시 상태 업데이트 */
    const handleUserDetailClose = (value) => {
      isUserDetailVisible.value = value
    }

    /* 알림 Row 클릭시, 해당 게시물 상세 화면 이동 */
    const goToBoardDetail = async (notification) => {
      //알림 플래그 업데이트
      if (notification.readFlag == false) {
        notification.readFlag = true
        await boardAPI.updateNotiReadFlag(notification)
      }
      //조회수 업데이트
      await boardAPI.updateCount({
        type: 'view',
        action: 'Increase',
        sysNo: notification.boardSysNo,
        userId: userId,
        userSysNo: userSysNo,
      })
      //게시글 상세 화면 이동
      goToPage(`${ROUTES.BOARD_DETAIL}/${notification.boardSysNo}`)
    }

    /* Bell 색상 변경 */
    const updateBellColor = () => {
      // 읽지 않은 알림이 있는지 확인
      const hasUnreadNotification = notifications.value.some(
        (notification) => !notification.readFlag
      )

      // 읽지 않은 알림이 있는 경우, Bell 색상 채우기
      notiFlag.value = hasUnreadNotification
    }

    /* 컴포넌트 mount시, WebSocket 연결 및 알림 받기 */
    onMounted(async () => {
      //WebSocket 연결
      socket = new WebSocket(
        `ws://43.200.8.42:8080/ws/notifications?userSysNo=${userSysNo}`
      )

      //알림 수신시 처리(개수 증가, Bell Color 업데이트)
      socket.onmessage = () => {
        notiLength.value += 1
        updateBellColor()
      }

      //연결 중 오류 발생 시 로그 출력
      socket.onerror = (error) => {
        console.error('WebSocket Error: ', error)
      }

      //알림 조회
      const response = await boardAPI.getNotiList({
        userId: userId,
        userSysNo: userSysNo,
      })
      if (response.success) {
        notifications.value = response.data
        notiLength.value = response.data.length
        updateBellColor()
      }
    })

    /* 컴포넌트 unmount시, WebSocket 연결 종료 */
    onUnmounted(() => {
      if (socket) {
        socket.close()
      }
    })

    /* 알림 조회 */
    const openNoti = async () => {
      const response = await boardAPI.getNotiList({
        userId: userId,
        userSysNo: userSysNo,
      })
      if (response.success) {
        notifications.value = response.data
        notiLength.value = response.data.length
      }
      //Bell Color 읽음으로 표시
      updateBellColor()
    }

    return {
      handleUserDetailClose,
      userDetail,
      logout,
      authStore,
      userId,
      isUserDetailVisible,
      notifications,
      updateBellColor,
      userSysNo,
      notiFlag,
      openNoti,
      notiLength,
      goToBoardDetail,
      ROUTES,
      goToPage,
    }
  },
}
</script>

<style scoped>
.avatar {
  width: 30px;
  height: 30px;
  margin-right: 8px; 
  border-radius: 50%; 
  }
.el-menu-demo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
}
.el-menu-demo .el-menu-item.is-active,
.el-menu-demo .el-sub-menu .el-menu-item.is-active {
  border-bottom: none !important; 
  color: white !important; 
  background-color: transparent !important; 
}
.menu-left{
  display:flex;
}
.menu-right{
  display:flex;
  align-items:center;
}
.el-dialog {
  z-index: 2000; 
}
.user-profile {
  max-height: 100px;
  overflow: hidden; 
  margin-bottom: 10px; 
}
.user-menu{
  width: 200px; 
}
.no-noti-bell, .yes-noti-bell{
  font-size: 25px;
  padding: 8px; 
  transition: transform 0.3s, box-shadow 0.3s; 
}
.no-noti-bell:hover, .yes-noti-bell:hover{
  transform: translateY(-4px); 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
}
.dropdown-scroll-container {
  max-height: 300px; 
  overflow-y: auto;  
  overflow-x: hidden;
  width: 250px;      
}
::v-deep(.el-dropdown-menu__item.read-noti) {
  background-color: rgba(231, 231, 231, 0.7);
  color: black !important;
}
::v-deep(.el-dropdown-menu__item.unread-noti) {
  background-color: hsl(198, 65%, 88%, 0.5) !important;  
  color: black !important;
}
.title{
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 스크롤바 전체 스타일 */
.dropdown-scroll-container::-webkit-scrollbar {
  width: 4px;
  height: 4px; 
}
/* 스크롤바 트랙 (배경) */
.dropdown-scroll-container::-webkit-scrollbar-track {
  background: transparent; 
}
/* 스크롤바 핸들 (움직이는 부분) */
.dropdown-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2); 
  border-radius: 4px; 
}
/* 스크롤바 핸들 hover 효과 */
.dropdown-scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}
/* 기본 링크 색상: 검정색 */
.notification-link {
  color: black;
  text-decoration: none; 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 활성화된 링크 상태 */
.notification-link:active {
  color: #333; 
  text-decoration: none; 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.session-timer {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: bold;
}
</style>

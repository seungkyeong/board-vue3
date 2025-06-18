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
          <el-menu-item index="5-3" @click="goToMyBoardList" class="user-menu"
            >내 게시글 관리</el-menu-item
          >
          <el-menu-item index="5-2" @click="goToMyLikeList" class="user-menu"
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
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import UserDetailView from '../views/UserDetailView.vue'
import { Bell, BellFilled } from '@element-plus/icons-vue'
import boardAPI from '../api/BoardAPI'

export default {
  name: 'UserProfile',
  components: {
    UserDetailView,
    Bell,
    BellFilled,
  },
  setup() {
    const authStore = useAuthStore() // Pinia store 가져오기
    const router = useRouter()

    const userId = authStore.getUserId
    const userSysNo = authStore.getSysNo

    const isUserDetailVisible = ref(false)
    const notifications = ref([]) // 현재 표시 중인 알림 목록
    const notiLength = ref(0) // 알림 개수
    const notiFlag = ref(false) //알림 있는지/없는지 플래그

    let socket

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

    //특정 알림 Row 클릭시, 해당 게시물 상세 화면 이동
    const goToBoardDetail = async (notification) => {
      if (notification.readFlag == false) {
        notification.readFlag = true
        await boardAPI.updateNotiReadFlag(notification)
      }
      await boardAPI.updateCount({
        type: 'view',
        action: 'Increase',
        sysNo: notification.boardSysNo,
        userId: userId,
        userSysNo: userSysNo,
      })
      router.push({
        path: `/board/detail/${notification.boardSysNo}`,
        force: true,
      })
    }

    // 알림 Flag로 Bell Icon 변경
    const updateBellColor = () => {
      // 읽지 않은 알림이 하나라도 있는지 확인
      const hasUnreadNotification = notifications.value.some(
        (notification) => !notification.readFlag
      )

      // 읽지 않은 알림이 있으면 벨 색상 플래그를 true로 설정

      notiFlag.value = hasUnreadNotification
      // if (notifications.value.length > 0) {
      //   notiFlag.value = true
      // } else {
      //   notiFlag.value = false
      // }
    }

    // WebSocket 연결 및 알림 받기
    onMounted(async () => {
      //jwt로 보안 강화
      socket = new WebSocket(
        `ws://43.200.8.42:8080/ws/notifications?userSysNo=${userSysNo}`
      )

      socket.onmessage = (event) => {
        //event
        console.log(event.message)
        notiLength.value += 1
        updateBellColor()
      }

      socket.onerror = (error) => {
        console.error('WebSocket Error: ', error)
      }

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

    // 컴포넌트가 unmount 될 때 WebSocket 연결 종료
    onUnmounted(() => {
      if (socket) {
        socket.close()
      }
    })

    // 알림 조회
    const openNoti = async () => {
      const response = await boardAPI.getNotiList({
        userId: userId,
        userSysNo: userSysNo,
      })
      if (response.success) {
        notifications.value = response.data
        notiLength.value = response.data.length
      }
      updateBellColor()
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
      notifications,
      updateBellColor,
      userSysNo,
      notiFlag,
      openNoti,
      notiLength,
      goToBoardDetail,
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
}
.no-noti-bell, .yes-noti-bell{
  font-size: 25px;
  padding: 8px; /* 아이콘 주변에 여백 추가 */
  transition: transform 0.3s, box-shadow 0.3s; /* 부드러운 애니메이션 추가 */
}
.no-noti-bell:hover, .yes-noti-bell:hover{
  transform: translateY(-4px); /* hover 시 위로 올라가는 효과 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 그림자 효과 추가 */
}
.dropdown-scroll-container {
  max-height: 300px; /* 🔹 최대 높이 지정 (원하는 값으로 변경 가능) */
  overflow-y: auto;  /* 🔹 스크롤 자동 생성 */
  overflow-x: hidden;
  width: 250px;      /* 🔹 dropdown 크기 조절 */
}
::v-deep(.el-dropdown-menu__item.read-noti) {
  background-color: rgba(231, 231, 231, 0.7);
  color: black !important;
}
::v-deep(.el-dropdown-menu__item.unread-noti) {
  background-color: hsl(198, 65%, 88%, 0.5) !important;  /* 🔹 안 읽은 알림 (readFlag: false) */
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
  width: 4px; /* 세로 스크롤바 너비 */
  height: 4px; /* 가로 스크롤바 높이 (필요한 경우) */
}

/* 스크롤바 트랙 (배경) */
.dropdown-scroll-container::-webkit-scrollbar-track {
  background: transparent; /* 배경 투명하게 */
}

/* 스크롤바 핸들 (움직이는 부분) */
.dropdown-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2); /* 색상 및 투명도 조절 */
  border-radius: 4px; /* 둥근 모서리 */
}

/* 스크롤바 핸들 hover 효과 */
.dropdown-scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}

/* 기본 링크 색상: 검정색 */
.notification-link {
  color: black;
  text-decoration: none; /* 기본 상태에서는 밑줄 없음 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* 활성화된 링크 상태 */
.notification-link:active {
  color: #333; /* 활성화된 상태에서 색상 변경 (원하는 색상으로 변경 가능) */
  text-decoration: none; /* 활성화 상태에서는 밑줄 없앰 */
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

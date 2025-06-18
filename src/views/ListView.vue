<template>
  <!--Profile 컴포넌트-->
  <UserProfile />

  <!-- 전체 컴포넌트 Container-->
  <div class="container">
    <!-- 버튼 컴포넌트 Container-->
    <div class="button-container">
      <!-- 글쓰기 버튼-->
      <el-button type="primary" @click="goWritePage">글쓰기 </el-button>
    </div>
    <!-- 게시판 리스트 테이블-->
    <div class="table-container">
      <el-table
        :data="boardList"
        border
        style="width: 100%"
        @row-click="goToDetailPage"
      >
        <el-table-column
          label="sysNo"
          prop="sysNo"
          width="0"
          v-if="hiddenFlag"
        ></el-table-column>
        <el-table-column label="제목" show-overflow-tooltip>
          <template #header>
            <div class="header-container">
              제목
              <el-icon @click="toggleSearch('title')" class="search-icon">
                <Search />
              </el-icon>
            </div>
            <el-input
              v-if="visibleSearch.title"
              v-model="searchFilters.title"
              @keydown.enter="getSearchBoardList"
            />
          </template>
          <template #default="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="내용" show-overflow-tooltip>
          <template #header>
            <div class="header-container">
              내용
              <el-icon @click="toggleSearch('content')" class="search-icon">
                <Search />
              </el-icon>
            </div>
            <el-input
              v-if="visibleSearch.content"
              v-model="searchFilters.content"
              @keydown.enter="getSearchBoardList"
            />
          </template>
          <template #default="scope">
            {{ scope.row.content }}
          </template>
        </el-table-column>
        <el-table-column
          label="userSysNo"
          prop="userSysNo"
          width="0"
          v-if="hiddenFlag"
        ></el-table-column>
        <el-table-column label="작성자" show-overflow-tooltip>
          <template #header>
            <div class="header-container">
              작성자
              <el-icon @click="toggleSearch('userId')" class="search-icon">
                <Search />
              </el-icon>
            </div>
            <el-input
              v-if="visibleSearch.userId"
              v-model="searchFilters.userId"
              @keydown.enter="getSearchBoardList"
            />
          </template>
          <template #default="scope">
            {{ scope.row.userId }}
          </template>
        </el-table-column>
        <el-table-column
          label="imgPath"
          prop="imgPath"
          width="0"
          v-if="hiddenFlag"
        ></el-table-column>
        <el-table-column label="작성일" show-overflow-tooltip>
          <template #header>
            <div class="header-container">작성일</div>
          </template>
          <template #default="scope">
            {{ scope.row.createDate }}
          </template>
        </el-table-column>
        <el-table-column label="수정일" show-overflow-tooltip>
          <template #header>
            <div class="header-container">수정일</div>
          </template>
          <template #default="scope">
            {{ scope.row.modifyDate }}
          </template>
        </el-table-column>
        <el-table-column label="조회수" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.view }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 페이징 컴포넌트 -->
    <div class="paging-container">
      <el-pagination
        :total="allBoardListCount"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="chagePaging"
        layout="prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<script>
import UserProfile from '../components/Profile'
import { useRouter } from 'vue-router'
import { reactive, ref, onMounted } from 'vue' //ref:DOM 요소의 상태 변화를 감지할 수 있는 객체 //computed
import { Search } from '@element-plus/icons-vue'
import boardAPI from '../api/BoardAPI'
import { useAuthStore } from '../store/auth'
// import Cookies from 'js-cookie'

export default {
  components: {
    UserProfile,
    Search,
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const userId = authStore.getUserId
    const userSysNo = authStore.getSysNo

    const hiddenFlag = ref(false) //false로 설정
    const allBoardListCount = ref(1) //전체 게시판 목록 개수
    const boardList = ref([]) //현재 표시할 게시판 데이터
    const currentPage = ref(1)
    const pageSize = 10

    //input란 텍스트
    const searchFilters = reactive({
      title: '',
      content: '',
      userId: '',
    })

    //검색 아이콘 눌렀을 떄 조건부 렌더링 할 수 있도록 하는 데이터
    const visibleSearch = reactive({
      title: false,
      content: false,
      userId: false,
    })

    //로드시 게시판 목록 조회
    onMounted(() => {
      getBoardList({
        type: 'allList',
        searchList: Object.fromEntries(new Map()), //빈 맵
        pageSize: pageSize,
        pageIndex: currentPage.value - 1,
        userId: userId,
        userSysNo: userSysNo,
      })
    })

    //게시판 목록 로드
    const getBoardList = async (requestData) => {
      const response = await boardAPI.getBoardList(requestData)
      if (response.success) {
        allBoardListCount.value = response.data[0] //게시판 목록 전체 개수
        boardList.value = response.data[1] //게시판 목록 조회
      }
    }

    //검색란 Enter시에 조건으로 검색
    const getSearchBoardList = () => {
      const filter = Object.entries(searchFilters)
        .filter(([, value]) => value !== '') // 빈 문자열이 아닌 값만 남기기
        .reduce((acc, [key, value]) => {
          acc[key] = value // 다시 객체 형태로 변환
          return acc
        }, {})
      getBoardList({
        type: 'allList',
        searchList: filter,
        pageSize: pageSize,
        pageIndex: currentPage.value - 1,
        userId: userId,
        userSysNo: userSysNo,
      })

      //토글 false
      Object.keys(visibleSearch).forEach((key) => {
        visibleSearch[key] = false
      })
    }

    // 페이지 변경 시 currentPage 업데이트
    const chagePaging = (page) => {
      currentPage.value = page
      getSearchBoardList()
    }

    //검색 아이콘 눌렀을 때 inputbox 렌더링 하는 함수(true,false 토글)
    const toggleSearch = (field) => {
      visibleSearch[field] = !visibleSearch[field]
    }

    //글쓰기 버튼 클릭시 글쓰기 페이지로 이동
    const goWritePage = () => {
      router.push({ path: '/board/post' })
    }

    //행 클릭시 상세 페에지로 이동
    const goToDetailPage = async (row) => {
      await boardAPI.updateCount({
        type: 'view',
        action: 'Increase',
        sysNo: row.sysNo,
        userId: userId,
        userSysNo: userSysNo,
      })
      router.push({ path: `/board/detail/${row.sysNo}` })
    }

    return {
      boardList,
      searchFilters,
      visibleSearch,
      currentPage,
      hiddenFlag,
      pageSize,
      allBoardListCount,
      toggleSearch,
      goWritePage,
      goToDetailPage,
      getBoardList,
      getSearchBoardList,
      chagePaging,
    }
  },
}
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: flex-end; /* 버튼을 오른쪽으로 정렬 */
  margin: 10px 0; /* 필요에 따라 여백 추가 */
}
.container {
  padding: 0px 200px 30px 200px;
}
.header-container {
  display: flex;
  justify-content: space-between;
}
.table-container {
  height: 435px;
  border : 1px solid #f7f3f3;
}
.el-table__inner-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
}
.paging-container {
  display: flex;
  justify-content: center;
  padding: 30px;
}
.search-icon {
  cursor: pointer;
  margin-left: 8px;
  font-size: 16px;
  color: #409eff;
}
</style>

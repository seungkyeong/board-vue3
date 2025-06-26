<template>
  <!--Profile 컴포넌트-->
  <UserProfile />

  <!-- 전체 컴포넌트 Container-->
  <div class="container">
    <!-- 버튼 컴포넌트 Container-->
    <div class="button-container">
      <!-- 글쓰기 버튼-->
      <el-button type="primary" @click="goToPage(ROUTES.CREATE_BOARD)"
        >글쓰기
      </el-button>
    </div>
    <!-- 게시판 리스트 테이블-->
    <div class="table-container">
      <BoardList
        :data="boardList"
        :columns="tableColumns"
        :row-class-name="getRowClassName"
        @search="getSearchBoardList"
        @rowClick="goToDetailPage"
      />
    </div>

    <!-- 페이징 컴포넌트 -->
    <div class="paging-container">
      <!-- <el-pagination
        :total="allBoardListCount"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="chagePaging"
        layout="prev, pager, next, jumper"
      /> -->
      <PagingComponent
        :total="allBoardListCount"
        :current-page="currentPage"
        :page-size="pageSize"
        @update:currentPage="chagePaging"
      />
    </div>
  </div>
</template>

<script>
import UserProfile from '../components/Profile'
import { ref, onMounted } from 'vue'
import boardAPI from '../api/BoardAPI'
import { useAuthStore } from '../store/auth'
import { goToPage } from '../utils/routerUtils'
import { ROUTES } from '../constant/routes'
import PagingComponent from '../components/Paging.vue'
import BoardList from '../components/BoardList.vue'

export default {
  components: {
    UserProfile,
    PagingComponent,
    BoardList,
  },
  setup() {
    const authStore = useAuthStore()
    const userId = authStore.getUserId
    const userSysNo = authStore.getSysNo

    const allBoardListCount = ref(1) //전체 게시판 목록 개수
    const boardList = ref([]) //현재 표시할 게시판 데이터
    const currentPage = ref(1)
    const pageSize = 10

    /* 테이블 컬럼 정의 */
    const tableColumns = [
      { label: '제목', prop: 'title', searchable: true },
      { label: '내용', prop: 'content', searchable: true },
      { label: '작성자', prop: 'userId', searchable: true },
      { label: '작성일', prop: 'createDate' },
      { label: '수정일', prop: 'modifyDate' },
      { label: '조회수', prop: 'view' },
    ]

    /* 로드시 게시판 목록 조회 */
    onMounted(() => {
      getBoardList()
    })

    /* 게시글 목록 조회 */
    const getBoardList = async (searchList = {}) => {
      const response = await boardAPI.getBoardList(
        buildBoardListRequest(searchList)
      )
      if (response.success) {
        allBoardListCount.value = response.data[0] //게시판 목록 전체 개수
        boardList.value = response.data[1] //게시판 목록 조회
      }
    }

    /* 게시글 목록 조회 Request Data 만들기 */
    const buildBoardListRequest = (searchList = {}) => ({
      type: 'viewList',
      searchList,
      pageSize,
      pageIndex: getPageIndex(),
      userId,
      userSysNo,
    })

    /* 검색란 Enter시 게시글 조회(검색) */
    const getSearchBoardList = (filters) => {
      getBoardList(filters)
    }

    /* 페이지 변경시, currentPage 업데이트 -- Paging 객체로 옮기기 */
    const chagePaging = (page) => {
      currentPage.value = page
      getSearchBoardList()
    }

    /* 행 클릭시 게시글 상세 페이지 이동 */
    const goToDetailPage = async (row) => {
      await boardAPI.updateCount({
        type: 'view',
        action: 'Increase',
        sysNo: row.sysNo,
        userId: userId,
        userSysNo: userSysNo,
      })
      goToPage(`${ROUTES.DETAIL_BOARD}/${row.sysNo}`)
    }

    /* 상위 3개의 행에 클래스명 지정 - 색상 지정하기 위함 (보류) */
    const getRowClassName = ({ rowIndex }) => {
      if (rowIndex < 3) {
        return 'highlight-row'
      }
      return '' //나머지는 기본 스타일
    }

    /* PageIndex 계산 -- Paging 객체로 옮기기 */
    const getPageIndex = () => {
      return currentPage.value - 1
    }

    return {
      boardList,
      currentPage,
      pageSize,
      allBoardListCount,
      goToDetailPage,
      getBoardList,
      getSearchBoardList,
      chagePaging,
      getRowClassName,
      goToPage,
      ROUTES,
      getPageIndex,
      tableColumns,
    }
  },
}
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: flex-end; 
  margin: 10px 0; 
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
::v-deep .highlight-row {
  background-color: rgba(173, 216, 230, 0.2) !important; 
  font-weight: bold;
}
</style>

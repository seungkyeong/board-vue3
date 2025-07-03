<template>
  <!--Profile 컴포넌트-->
  <UserProfile />

  <!-- 전체 컴포넌트 Container-->
  <div class="container">
    <!-- 버튼 컴포넌트 Container-->
    <div class="button-container">
      <!-- 글쓰기 버튼-->
      <el-button @click="deleteSelected"> 삭제 </el-button>
      <el-button type="primary" @click="goToPage(ROUTES.CREATE_BOARD)"
        >글쓰기
      </el-button>
    </div>
    <!-- 게시판 리스트 테이블-->
    <div class="table-container">
      <BoardList
        :data="boardList"
        :columns="tableColumns"
        :useSelection="true"
        :useIndex="false"
        :row-class-name="getRowClassName"
        @search="getSearchBoardList"
        @rowClick="goToDetailPage"
        @select-sysnos="(val) => (selectedRows = val)"
      />
    </div>

    <!-- 페이징 컴포넌트 -->
    <div class="paging-container">
      <PagingComp
        :total="allBoardListCount"
        v-model:currentPage="pagingStore.pageIndex"
      />
    </div>
  </div>
</template>

<script>
import UserProfile from '../components/Profile'
import { ref, onMounted, watch } from 'vue'
import boardAPI from '../api/BoardAPI'
import { useAuthStore } from '../store/auth'
import { goToPage } from '../utils/routerUtils'
import { ROUTES } from '../constant/routes'
import BoardList from '../components/BoardList.vue'
import { MESSAGES } from '../constant/messages'
import { showAlertBox } from '../utils/elementUtils'
import PagingComp from '../components/PagingComp.vue'
import { usePagingStore } from '../store/page'

export default {
  components: {
    UserProfile,
    BoardList,
    PagingComp,
  },
  setup() {
    const pagingStore = usePagingStore()
    const authStore = useAuthStore()
    const userId = authStore.getUserId
    const userSysNo = authStore.getSysNo

    const selectedRows = ref([]) // 선택된 행의 sysNo

    const allBoardListCount = ref(1) //전체 게시판 목록 개수
    const boardList = ref([]) //현재 표시할 게시판 데이터
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
    const getBoardList = async () => {
      const response = await boardAPI.getBoardList(buildBoardListRequest())
      if (response.success) {
        allBoardListCount.value = response.data[0] //게시판 목록 전체 개수
        boardList.value = response.data[1] //게시판 목록 조회
      }
    }

    /* 게시글 목록 조회 Request Data 만들기 */
    const buildBoardListRequest = () => ({
      type: 'myBoardList',
      searchList: pagingStore.searchFilters,
      pageSize: pagingStore.pageSize,
      pageIndex: pagingStore.pageIndex - 1,
      userId,
      userSysNo,
    })

    /* 검색란 Enter시 게시글 조회(검색) */
    const getSearchBoardList = (filters) => {
      pagingStore.searchFilters = filters //검색 조건 저장
      pagingStore.pageIndex = 1 //1페이지로 초기화
      getBoardList(filters)
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

    /* 삭제 버튼 클릭시, 해당 게시물 삭제 */
    const deleteSelected = async () => {
      if (selectedRows.value.length > 0) {
        //게시물 삭제
        const response = await boardAPI.deleteBoardList({
          type: 'board',
          userId: userId,
          userSysNo: userSysNo,
          deleteList: selectedRows.value,
        })
        if (response.success) {
          await showAlertBox(MESSAGES.SUCCESS_DELETE, MESSAGES.SUCCESS)
            .then(() => {
              getBoardList()
            })
            .catch(() => {})
        } else {
          await showAlertBox(response.message, MESSAGES.ERROR).catch(() => {})
        }
      } else {
        await showAlertBox(MESSAGES.NO_SELECTED, MESSAGES.ERROR).catch(() => {})
      }
    }

    /* pageIndex 변경 감지하여 게시글 조회 */
    watch(
      () => pagingStore.pageIndex,
      () => {
        getBoardList()
      }
    )

    return {
      boardList,
      pageSize,
      allBoardListCount,
      goToDetailPage,
      getBoardList,
      getSearchBoardList,
      deleteSelected,
      selectedRows,
      goToPage,
      ROUTES,
      tableColumns,
      pagingStore,
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
</style>

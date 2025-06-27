<template>
  <el-table
    :data="props.data"
    border
    style="width: 100%"
    @row-click="onRowClick"
    @selection-change="onSelectionChange"
    :row-class-name="props.rowClassName || (() => '')"
  >
    <!-- 체크박스 -->
    <el-table-column
      v-if="props.useSelection"
      type="selection"
      width="40"
    ></el-table-column>

    <!-- 인덱스 박스 -->
    <el-table-column
      v-if="props.useIndex"
      type="index"
      label=""
      width="50"
      align="center"
    ></el-table-column>

    <!-- 컬럼 -->
    <template v-for="(col, idx) in props.columns" :key="idx">
      <el-table-column
        v-if="!col.hidden"
        :label="col.label"
        :prop="col.prop"
        :width="col.width"
        show-overflow-tooltip
      >
        <!-- 헤더 -->
        <template #header>
          <div class="header-container">
            {{ col.label }}
            <el-icon
              v-if="col.searchable"
              @click="toggleSearch(col.prop)"
              class="search-icon"
            >
              <Search />
            </el-icon>
          </div>
          <el-input
            v-if="visibleSearch[col.prop]"
            v-model="searchFilters[col.prop]"
            @keydown.enter="onSearchEnter"
            clearable
          />
        </template>

        <!-- 데이터 -->
        <template #default="scope">
          {{ scope.row[col.prop] }}
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script setup>
import { reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  data: Array,
  columns: Array,
  hiddenFlag: Boolean,
  rowClassName: Function,
  useSelection: Boolean,
  useIndex: Boolean,
})

const emit = defineEmits(['rowClick', 'search', 'select-sysnos'])
const visibleSearch = reactive({}) //검색 아이콘 토글 여부(표시 여부)
const searchFilters = reactive({}) //검색란 텍스트

/* Search 아이콘 눌렀을 때, 검색창 토글 */
function toggleSearch(prop) {
  visibleSearch[prop] = !visibleSearch[prop]
}

/* 검색란 Enter시 게시글 조회(검색) */
function onSearchEnter() {
  //검색란에서 빈문자열이 아닌 것만 추출
  const filters = Object.fromEntries(
    Object.entries(searchFilters).filter(([, v]) => v !== '')
  )

  //부모 전달
  emit('search', filters)

  //검색란 false로 토글
  Object.keys(visibleSearch).forEach((key) => (visibleSearch[key] = false))
}

/* 행 클릭시 부모 전달 */
async function onRowClick(row) {
  emit('rowClick', row)
}

/* 체크박스 선택 변경시 sysNo 추출하여 부모 전달 */
function onSelectionChange(selection) {
  const sysNos = selection.map((row) => row.sysNo)
  emit('select-sysnos', sysNos)
}
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-icon {
  cursor: pointer;
  margin-left: 8px;
  font-size: 16px;
  color: #409eff;
}
</style>

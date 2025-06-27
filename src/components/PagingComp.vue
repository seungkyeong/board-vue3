<template>
  <el-pagination
    :total="props.total"
    :current-page="props.currentPage"
    :page-size="props.pageSize"
    layout="prev, pager, next, jumper"
    @current-change="changePage"
  />
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
})

const emit = defineEmits(['update:currentPage'])

/* 페이지 변경시 부모 전달 */
const changePage = (page) => {
  emit('update:currentPage', page)
}
</script>

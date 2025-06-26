<template>
  <el-pagination
    :total="total"
    :current-page="currentPage"
    :page-size="pageSize"
    layout="prev, pager, next, jumper"
    @current-change="handleChange"
  />
</template>

<script>
export default {
  name: 'PagingComponent',
  props: {
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
  },
  emits: ['update:currentPage'],
  methods: {
    handleChange(page) {
      this.$emit('update:currentPage', page)
    },
  },
}
</script>

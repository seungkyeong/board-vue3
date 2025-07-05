<template>
  <div class="createComment-container">
    <el-input
      v-model="newComment"
      type="textarea"
      :rows="3"
      resize="none"
      placeholder="댓글을 입력해주세요."
    />
    <el-button type="primary" @click="createComment">등록 </el-button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String, //신규 댓글(newComment.comment)
  comment: Object,
})

const emit = defineEmits(['update:modelValue', 'comment-create'])

/* 신규 댓글 */
const newComment = ref(props.modelValue)

/* 부모의 newComment 변경시, 로컬 newComment에 저장 */
watch(
  () => props.modelValue,
  (val) => {
    newComment.value = val
  }
)

/* 로컬 newComment 변경시, 부모에 전달 */
watch(newComment, (val) => {
  emit('update:modelValue', val)
})

/* 댓글, 대댓글 신규 생성 */
const createComment = () => {
  emit('comment-create', props.comment || null)
}
</script>

<style scoped>
.createComment-container{
  border-top: 2px solid grey;
  padding-top: 20px;
  display: flex; 
  gap: 10px; 
}
</style>

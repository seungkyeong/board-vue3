<template>
  <div class="comment-container">
    <!-- 새로운 댓글 생성 컴포넌트 -->
    <div class="createComment-container">
      <el-input
        v-model="localComment"
        type="textarea"
        :rows="3"
        resize="none"
        placeholder="댓글을 입력해주세요."
      />
      <el-button type="primary" @click="submitComment">등록</el-button>
    </div>

    <!-- 댓글 리스트 컴포넌트 -->
    <div v-for="comment in commentList" :key="comment.sysNo">
      <CommentItem
        :comment="comment"
        :user-id="userId"
        :reply-inputs="replyInputs"
        @edit-comment="$emit('edit-comment', $event)"
        @delete-comment="$emit('delete-comment', $event)"
        @create-comment="$emit('create-comment', $event)"
        @cancel-edit="$emit('cancel-edit', $event)"
        @toggle-reply="$emit('toggle-reply', $event)"
        @update-reply-input="$emit('update-reply-input', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import CommentItem from './CommentItem.vue'

const props = defineProps({
  commentList: Array,
  newComment: Object,
  replyInputs: Object,
  userId: String,
})

const emit = defineEmits([
  'update-new-comment', // 새 댓글 값 변경용
  'create-comment',
  'edit-comment',
  'delete-comment',
  'cancel-edit',
  'toggle-reply',
  'update-reply-input',
])

// 로컬 바인딩용 댓글
const localComment = ref(props.newComment.comment)

watch(localComment, (val) => {
  emit('update-new-comment', val) // 상위로 변경 알림
})

const submitComment = () => {
  emit('create-comment', null)
}
</script>

<style scoped>
.comment-container{
  border-top: 2px solid grey;
  padding-top: 20px;
}
.createComment-container{
  display: flex; 
  gap: 10px; 
}
</style>

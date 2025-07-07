<template>
  <div>
    <!-- 본문 표시 -->
    <div v-if="!comment.editCommentToggle" class="comment-text">
      <p>
        <template v-if="comment.userSysNo == null">
          <el-icon style="margin-right: 10px"><WarningFilled /></el-icon>
        </template>
        {{ comment.comment }}
      </p>
    </div>

    <!-- 수정 폼 -->
    <div
      v-else
      class="comment-edit"
      style="margin-left: 45px; margin-top: 10px"
    >
      <div style="display: flex; gap: 10px; width: 100%">
        <el-input
          v-model="editText"
          type="textarea"
          :rows="3"
          resize="none"
          style="gap: 10px"
        />
        <el-button type="primary" @click="editComment"> 수정 </el-button>
      </div>
    </div>

    <!-- 답글/취소 버튼 -->
    <div class="action-buttons">
      <el-button
        v-if="!comment.editCommentToggle && comment.parSysNo === ''"
        class="comment-replyList"
        type="primary"
        @click="$emit('toggle-reply', comment)"
      >
        답글 {{ comment.replies.length }}
      </el-button>

      <el-button
        v-if="comment.editCommentToggle"
        class="comment-replyList"
        style="margin-top: 10px"
        @click="$emit('cancel-edit', comment)"
      >
        취소
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['comment-edit', 'toggle-reply', 'cancel-edit'])

/* 댓글/대댓글 수정 Text 로컬 관리용 */
const editText = ref(props.comment.editText)

/* 수정 Text 변경시, 로컬도 동기화 */
watch(
  () => props.comment.editText,
  (val) => {
    editText.value = val
  }
)

/* 수정 모드 진입할 때 수정 Text 초기화 */
watch(
  () => props.comment.editCommentToggle,
  (val) => {
    if (val) {
      editText.value = props.comment.comment
    }
  }
)

/* 수정 버튼 클릭시, 부모에 전달 */
const editComment = () => {
  emit('comment-edit', { ...props.comment, editText: editText.value })
}
</script>

<style scoped>
.comment-edit {
  margin-top: 10px;
}
.comment-replyList {
  display: flex; 
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  background-color: white;
  color: grey;
  border-color: grey;
  margin-left: 45px; /* 프로필 사진 크기 + 여백과 맞추기 */
  margin-bottom: 20px;
}
.comment-text {
  text-align: left; /* 왼쪽 정렬 */
  margin-left: 45px; /* 프로필 이미지 크기 + 여백 */
}
</style>

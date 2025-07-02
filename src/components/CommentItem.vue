<template>
  <div class="comment-item-user">
    <!-- 프로필, 내용 -->
    <div class="comment-user-info">
      <el-avatar :src="require('@/assets/profile.png')" :size="40" />
      <div class="comment-item-user-idDate">
        <span class="comment-userId">{{ comment.userId }}</span>
        <span class="comment-createDate">{{ comment.createDate }}</span>
      </div>

      <!-- ⋮ 더보기 메뉴(수정/삭제) -->
      <template v-if="comment.userSysNo !== null && !editCommentToggle">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link" style="cursor: pointer"
            ><el-icon style="margin-right: 10px"><MoreFilled /></el-icon
          ></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="emit('edit-comment', comment)"
                >수정하기</el-dropdown-item
              >
              <el-dropdown-item @click="emit('delete-comment', comment)"
                >삭제하기</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </div>

    <!-- 댓글 내용 or 수정창 -->
    <div v-if="!editCommentToggle">
      <p class="comment-text">
        <template v-if="comment.userSysNo == null">
          <el-icon style="margin-right: 10px"><WarningFilled /></el-icon>
        </template>
        {{ comment.comment }}
      </p>
    </div>
    <div v-else style="margin-left: 45px; margin-top: 10px">
      <div style="display: flex; gap: 10px; width: 100%">
        <el-input
          v-model="localEditText"
          type="textarea"
          :rows="3"
          resize="none"
          style="flex: 1"
        />
        <el-button type="primary" @click="submitEdit">수정</el-button>
      </div>
    </div>

    <!-- 답글 버튼 -->
    <div v-if="!editCommentToggle && comment.parSysNo === ''">
      <el-button
        class="comment-replyList"
        type="primary"
        @click="toggleReplies"
      >
        답글 {{ comment.replies.length }}
      </el-button>
    </div>
    <div v-if="editCommentToggle">
      <el-button
        class="comment-replyList"
        style="margin-top: 10px"
        @click="cancelEdit"
      >
        취소
      </el-button>
    </div>

    <!-- 대댓글 목록 -->
    <div v-if="repliesVisible" class="replies">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.sysNo"
        :comment="reply"
        :reply-inputs="replyInputs"
        :user-id="userId"
        @edit-comment="emit('edit-comment', $event)"
        @delete-comment="emit('delete-comment', $event)"
        @create-comment="emit('create-comment', $event)"
        @toggle-reply="emit('toggle-reply', $event)"
        @update-reply-input="emit('update-reply-input', $event)"
      />

      <!-- 대댓글 입력창 -->
      <div class="createReply-container">
        <el-input
          :model-value="replyInputs[comment.sysNo] || ''"
          @input="
            (val) =>
              emit('update-reply-input', { sysNo: comment.sysNo, value: val })
          "
          type="textarea"
          :rows="3"
          resize="none"
          placeholder="댓글을 입력해주세요"
        />
        <el-button type="primary" @click="emit('create-comment', comment)"
          >등록</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { MoreFilled, WarningFilled } from '@element-plus/icons-vue'
import CommentItem from './CommentItem.vue'
import { ref, watch } from 'vue'

const props = defineProps({
  comment: Object,
  userId: String,
  replyInputs: Object,
})

const emit = defineEmits([
  'edit-comment',
  'delete-comment',
  'create-comment',
  'toggle-reply',
  'update-reply-input',
])

// 로컬 상태로 복사해서 관리
const editCommentToggle = ref(props.comment.editCommentToggle ?? false)
const repliesVisible = ref(props.comment.repliesVisible ?? false)
const localEditText = ref(props.comment.editText || '')

// props.comment.editCommentToggle, repliesVisible, editText가 바뀌면 동기화
watch(
  () => props.comment.editCommentToggle,
  (val) => {
    editCommentToggle.value = val ?? false
  }
)
watch(
  () => props.comment.repliesVisible,
  (val) => {
    repliesVisible.value = val ?? false
  }
)
watch(
  () => props.comment.editText,
  (val) => {
    localEditText.value = val || ''
  }
)

const submitEdit = () => {
  emit('create-comment', {
    ...props.comment,
    editText: localEditText.value,
  })
}

const cancelEdit = () => {
  // 로컬 상태만 변경
  editCommentToggle.value = false
  repliesVisible.value = false
}

const toggleReplies = () => {
  repliesVisible.value = !repliesVisible.value
}
</script>

<style scoped>
.comment-item-user {
  margin-top: 20px;
  border-bottom: 1px solid #c8c8c8;
}

.comment-user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.comment-item-user-idDate {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.comment-createDate {
  color: grey;
  font-size: 13px;
  padding-top: 5px;
}

.comment-text {
  margin-left: 45px; /* 아바타 크기 + 여백 */
  margin-top: 20px;
  text-align: left;
}

.comment-replyList {
  margin-left: 50px;
  margin-top: 5px;
  margin-bottom: 20px;
  color: grey;
  background-color: white;
  border-color: grey;
  display: flex;
  justify-content: flex-start; /* 왼쪽 정렬 */
}
.replies {
  margin-left: 50px; /* 루트 댓글보다 50px 들여쓰기 */
  border-top: 1px solid #c8c8c8;
  padding-left: 10px; /* 내용과 경계선 사이 여백 */
}
.createReply-container {
  display: flex;
  gap: 10px;
  margin-left: 50px;
  padding-top: 20px;
  padding-bottom: 20px;
}
.comment-item-user .el-dropdown {
  margin-left: auto;
}
</style>

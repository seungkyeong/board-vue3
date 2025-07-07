<!-- 사용자 프로필, DropDown -->
<template>
  <div class="comment-header">
    <div class="comment-user-info">
      <el-avatar :src="require('@/assets/profile.png')" :size="40" />
      <div class="comment-item-user-idDate">
        <span class="comment-userId">{{ props.comment.userId }}</span>
        <span class="comment-createDate">{{ props.comment.createDate }}</span>
      </div>
    </div>

    <el-dropdown
      v-if="comment.userSysNo !== null && !comment.editCommentToggle"
      trigger="click"
      class="el-dropdown-wrapper"
    >
      <span class="el-dropdown-link" style="cursor: pointer">
        <el-icon><MoreFilled /></el-icon>
      </span>
      <template v-slot:dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="editComment">수정하기</el-dropdown-item>
          <el-dropdown-item @click="deleteComment">삭제하기</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { MoreFilled } from '@element-plus/icons-vue'
import { useAuthStore } from '../store/auth'
import { MESSAGES } from '../constant/messages'
import { showConfirmBox, showAlertBox } from '../utils/elementUtils'

const authStore = useAuthStore()
const userId = authStore.getUserId

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['editComment', 'deleteComment'])

/* '수정하기' 클릭시, 작성자 = 사용자 확인 후 부모에 전달 */
const editComment = async () => {
  if (props.comment.userId == userId) {
    emit('editComment', props.comment)
  } else {
    await showAlertBox(MESSAGES.AUTHOR_MISMATCH, MESSAGES.WARNING).catch(
      () => {}
    )
  }
}

/* '삭제하기' 클릭시, 작성자 = 사용자 확인 후 부모에 전달 */
const deleteComment = async () => {
  if (props.comment.userId == userId) {
    await showConfirmBox(
      MESSAGES.CONFIRM_DELETE,
      MESSAGES.WARNING_KOR,
      MESSAGES.WARNING,
      MESSAGES.DELETE
    )
      .then(() => {
        emit('deleteComment', props.comment)
      })
      .catch(() => {})
  } else {
    await showAlertBox(MESSAGES.AUTHOR_MISMATCH, MESSAGES.WARNING).catch(
      () => {}
    )
  }
}
</script>

<style scoped>
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
.el-dropdown-link {
  display: inline-flex;
  align-items: center;
}
.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-top: 1px solid #c8c8c8;
  padding-top:20px;
}
.el-dropdown-wrapper {
  margin-left: auto; 
}
</style>

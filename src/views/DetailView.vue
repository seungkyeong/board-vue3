<template>
  <!--Profile 컴포넌트-->
  <UserProfile />

  <div class="container">
    <div class="detail-user" v-if="editToggle">
      <el-avatar
        class="profile-img"
        :size="40"
        :src="require('@/assets/profile.png')"
      />
      <div class="detail-user-idDate">
        <span class="comment-userId" style="font-size: 17px">{{
          form.userId
        }}</span>
        <span class="comment-createDate">{{ form.createDate }}</span>
      </div>
    </div>

    <el-form
      :model="form"
      label-width="auto"
      style="width: 100%; padding-top: 20px"
    >
      <el-form-item label="제목">
        <el-input v-model="form.title" :disabled="editToggle" />
      </el-form-item>
      <el-form-item label="내용">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="9"
          resize="none"
          :disabled="editToggle"
        />
      </el-form-item>
      <el-form-item label="이미지">
        <div
          class="image-container"
          v-if="form.imgPath.length > 0 && editToggle"
        >
          <el-image v-for="url in form.imgPath" :key="url" :src="url" lazy />
        </div>
        <div
          class="image-no-container"
          v-if="form.imgPath.length === 0 && editToggle"
        >
          이미지 없음
        </div>
        <el-upload
          drag
          :auto-upload="false"
          multiple
          style="width: 100%"
          accept="image/*"
          :on-change="addImgPath"
          :on-remove="removeImgPath"
          :on-preview="imgPreview"
          v-if="!editToggle"
          :file-list="fileList"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500kb
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="" class="like-wrapper">
        <div class="like-container" v-if="editToggle">
          <el-button type="primary" @click="toggleLikeBtn" :style="buttonStyle"
            >👍 좋아요</el-button
          >
        </div>
      </el-form-item>
    </el-form>

    <div class="button-container">
      <el-button type="primary" @click="modifyBoard">수정</el-button>
      <el-button @click="goBack">목록</el-button>
    </div>

    <!-- 이미지 미리보기 -->
    <el-dialog v-model="dialogVisible" width="50%">
      <img :src="previewImage" alt="미리보기" style="width: 100%" />
    </el-dialog>

    <div class="comment-container" v-if="editToggle">
      <div class="createComment-container">
        <el-input
          v-model="newComment.comment"
          type="textarea"
          :rows="3"
          resize="none"
          placeholder="댓글을 입력해주세요."
        />
        <el-button type="primary" @click="createComment(null)">등록</el-button>
      </div>

      <div
        v-for="comment in commentList"
        :key="comment.sysNo"
        class="comment-item"
        style="padding-top: 30px"
      >
        <!-- 프로필 -->
        <div class="comment-item-user">
          <el-avatar
            class="profile-img"
            :size="40"
            :src="require('@/assets/profile.png')"
          />
          <div class="comment-item-user-idDate">
            <span class="comment-userId" style="font-size: 17px">{{
              comment.userId
            }}</span>
            <span class="comment-createDate">{{
              comment.formattedCreateDate
            }}</span>
          </div>
        </div>
        <!-- 댓글 내용 -->
        <p class="comment-text">{{ comment.comment }}</p>
        <!-- 답글 버튼 -->
        <el-button
          class="comment-replyList"
          type="primary"
          @click="showReplyList(comment)"
          >답글 {{ comment.replies.length }}</el-button
        >

        <!-- 대댓글 리스트 -->
        <div v-if="comment.repliesVisible">
          <div
            v-for="reply in comment.replies"
            :key="reply.sysNo"
            class="replies"
            style="padding-top: 10px"
          >
            <!-- 프로필 -->
            <div class="comment-item-user">
              <el-avatar
                class="profile-img"
                :size="40"
                :src="require('@/assets/profile.png')"
              />
              <div class="comment-item-user-idDate">
                <span class="comment-userId" style="font-size: 17px">{{
                  reply.userId
                }}</span>
                <span class="comment-createDate">{{
                  reply.formattedCreateDate
                }}</span>
              </div>
            </div>
            <!-- 댓글 내용 -->
            <p class="comment-text">{{ reply.comment }}</p>
          </div>

          <div class="createReply-container">
            <el-input
              v-model="replyInputs[comment.sysNo]"
              type="textarea"
              :rows="3"
              resize="none"
              placeholder="댓글을 입력해주세요."
            />
            <el-button type="primary" @click="createComment(comment)"
              >등록</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserProfile from '../components/Profile'
import { reactive, onMounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import boardAPI from '../api/BoardAPI'
import { useAuthStore } from '../store/auth'
import { UploadFilled } from '@element-plus/icons-vue'

export default {
  components: {
    UserProfile,
    UploadFilled,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    const sysNoParam = route.params.sysNo // URL 경로에서 sysNo를 가져옴
    const userId = authStore.getUserId
    const userSysNo = authStore.getSysNo
    const editToggle = ref(true)
    let deletedImages = ref([]) // 삭제된 기존 이미지 추적
    let fileData = new FormData()
    const previewImage = ref('')
    const dialogVisible = ref(false)
    let fileList = ref([])
    const commentList = ref([])
    const replyInputs = reactive({})
    const isLiked = ref(false) // 좋아요 상태

    //Board Detail Form
    const form = reactive({
      sysNo: '',
      title: '',
      content: '',
      imgPath: [],
      userId: '',
      userSysNo: '',
      createDate: '',
    })

    //새로운 댓글
    const newComment = reactive({
      sysNo: '',
      boardSysNo: '', //미리 세팅되어야 함
      title: '',
      comment: '',
      userId: userId, //미리 세팅되어야 함
      userSysNo: userSysNo, //미리 세팅되어야 함
      boardCreater: '',
      boardCreaterSysNo: '',
    })

    //새로운 답글
    const newReply = reactive({
      sysNo: '',
      parSysNo: '',
      boardSysNo: '', //미리 세팅되어야 함
      title: '',
      comment: '',
      userId: userId, //미리 세팅되어야 함
      userSysNo: userSysNo, //미리 세팅되어야 함
      boardCreater: '',
      boardCreaterSysNo: '',
    })

    const getBoardDetail = async () => {
      const response = await boardAPI.getBoardDetail({
        searchList: { sysNo: sysNoParam },
        pageSize: 10,
        pageIndex: 0,
        userId: userId,
        userSysNo: userSysNo,
      })

      if (response.success) {
        //s3에서 가져오기
        if (
          response.data[0].imgPath.length > 0 &&
          response.data[0].imgPath[0] != ''
        ) {
          const prefix = 'https://demofille.s3.ap-northeast-2.amazonaws.com/'
          for (let i = 0; i < response.data[0].imgPath.length; i++) {
            form.imgPath.push(prefix + response.data[0].imgPath[i])
          }
          updateFileList()
        }

        //게시물 상세 세팅
        //이미지 파일 이름 배열로 저장
        form.sysNo = response.data[0].sysNo
        form.title = response.data[0].title
        form.content = response.data[0].content
        form.userId = response.data[0].userId
        form.userSysNo = response.data[0].userSysNo
        form.createDate = response.data[0].formattedCreateDate

        //새로운 댓글을 위한 세팅
        newComment.boardSysNo = response.data[0].sysNo
        newComment.boardCreater = response.data[0].userId
        newComment.boardCreaterSysNo = response.data[0].userSysNo
        newComment.title = response.data[0].title
        newReply.title = response.data[0].title
        newReply.boardSysNo = response.data[0].sysNo
        newReply.boardCreater = response.data[0].userId
        newReply.boardCreaterSysNo = response.data[0].userSysNo

        //댓글 리스트 세팅
        commentList.value = response.data[1].map((comment) => ({
          ...comment,
          repliesVisible: false, // 초기에는 대댓글 숨김
        }))
        if (response.data[0].likeFlag == 'Increase') {
          isLiked.value = true // 파란 버튼 (좋아요 누름)
        } else {
          isLiked.value = false // 흰 버튼 (좋아요 안 누름)
        }
      } else {
        ElMessageBox.alert(response.message, '', {
          confirmButtonText: '확인',
          type: 'error',
        }).catch(() => {})
      }
    }

    //로드시 게시물 조회
    onMounted(() => {
      getBoardDetail()
    })

    //취소버튼 클릭시 이전 페이지로 이동
    const goBack = () => {
      router.go(-1)
    }

    //업로드 영역에 파일 추가시 제목을 imgPath에 넣음
    const addImgPath = (file) => {
      fileData.append('files', file.raw)
    }

    //업로드 영역에 파일 제거시 제목을 imgPath에서 제거
    const removeImgPath = (file) => {
      if (file.url) {
        // 기존 이미지 삭제 시 deletedImages에 추가
        deletedImages.value.push(file.url)
        form.imgPath = form.imgPath.filter((img) => img !== file.url)
      } else {
        const newFileData = new FormData()
        for (const [key, value] of fileData.entries()) {
          if (value !== file.raw) {
            newFileData.append(key, value) // 기존 파일 중 삭제 대상이 아닌 파일만 추가
          }
        }
        fileData = newFileData // 기존 FormData 교체
      }
    }

    //업로드한 파일 클릭시 파일 미리보기
    const imgPreview = (file) => {
      previewImage.value = file.url || URL.createObjectURL(file.raw) // 로컬 URL 생성
      dialogVisible.value = true
    }

    const updateFileList = () => {
      const updatedList = form.imgPath.map((url, index) => {
        const fileName = url.split('/')[3] // 파일 이름 추출
        const uid = `file-${index}` // 고유 ID 생성
        return {
          name: fileName,
          url, // 파일 URL
          uid,
        }
      })
      fileList.value = [...updatedList]
    }

    //수정버튼 클릭시 수정 페이지로 이동
    const modifyBoard = async () => {
      if (!editToggle.value) {
        if (!form.title.trim() || !form.content.trim()) {
          ElMessageBox.alert('제목과 내용을 입력해주세요!', '', {
            confirmButtonText: '확인',
            type: 'warning',
          }).catch(() => {})
        } else {
          //파일 업로드 수행 API 호출
          if (fileData.has('files')) {
            let fileNames = []
            //S3에서 PresignedURL 발급
            const presignedURLs = await boardAPI.getPresignedURL(fileData)
            //S3에 업로드
            const files = fileData.getAll('files')
            for (let i = 0; i < presignedURLs.length; i++) {
              const file = files[i] // FormData에서 해당 파일 가져오기
              // S3에 파일 업로드
              const response = await boardAPI.uploadFile(presignedURLs[i], file)
              fileNames.push(decodeURIComponent(response.split('/')[3]))
            }
            form.imgPath = [
              ...form.imgPath.map((url) => url.split('/').pop()), // 기존 파일명만 추출
              ...fileNames, // 새로 업로드된 파일명 추가
            ]
          }
          //s3에서 파일 삭제 + 서버 만들어야 함
          if (deletedImages.value.length > 0) {
            const deletePayload = { keys: deletedImages.value }

            await boardAPI.deleteFiles(deletePayload)
          }
          form.imgPath = [
            ...form.imgPath.map((url) => url.split('/').pop()), // 기존 파일명만 추출
          ]

          //저장 수행 API 호출
          const response = await boardAPI.createBoard(form)

          if (response.success) {
            ElMessageBox.alert('저장되었습니다.', '', {
              confirmButtonText: '확인',
              type: 'success',
            })
              .then(() => {
                form.imgPath = []
                deletedImages.value = []
                fileList.value = []
                fileData = new FormData()
                getBoardDetail()
                editToggle.value = true
              })
              .catch(() => {})
          } else {
            ElMessageBox.alert(response.message, '', {
              confirmButtonText: '확인',
              type: 'error',
            }).catch(() => {})
          }
        }
      } else {
        //사용자가 작성자이면 수정
        if (form.userId == userId) {
          //토글하기
          updateFileList()
          editToggle.value = false
        } else {
          ElMessageBox.alert('작성자와 일치하지 않습니다.', '', {
            confirmButtonText: '확인',
            type: 'warning',
          }).catch(() => {})
        }
      }
    }

    //좋아요 버튼 클릭시 Redis 좋아요 Count 증가
    const toggleLikeBtn = async () => {
      if (isLiked.value) {
        //좋아요 누른 상황 -> 취소인 경우
        isLiked.value = false
        await boardAPI.updateCount({
          type: 'like',
          action: 'Decrease',
          sysNo: form.sysNo,
          userId: userId,
          userSysNo: userSysNo,
        })
      } else {
        //좋아요 안누른 상황 -> 좋아요 누른 경우
        isLiked.value = true
        await boardAPI.updateCount({
          type: 'like',
          action: 'Increase',
          sysNo: form.sysNo,
          userId: userId,
          userSysNo: userSysNo,
        })
      }
    }

    //댓글 등록 버튼 클릭시 댓글 저장
    const createComment = async (comment = null) => {
      let response
      if (comment != null) {
        newReply.parSysNo = comment.sysNo
        newReply.boardSysNo = form.sysNo
        newReply.comment = replyInputs[comment.sysNo] || '' // 해당 댓글의 입력값 사용

        response = await boardAPI.createComment(newReply)
      } else {
        response = await boardAPI.createComment(newComment)
      }

      if (response.success) {
        ElMessageBox.alert('댓글이 등록되었습니다.', '', {
          confirmButtonText: '확인',
          type: 'success',
        })
          .then(() => {
            newComment.comment = ''
            Object.keys(replyInputs).forEach((key) => (replyInputs[key] = '')) // 모든 대댓글 입력창 초기화
            newReply.comment = ''
            getBoardDetail()
          })
          .catch(() => {})
      } else {
        ElMessageBox.alert(response.message, '', {
          confirmButtonText: '확인',
          type: 'error',
        }).catch(() => {})
      }
    }

    const showReplyList = (comment) => {
      comment.repliesVisible = !comment.repliesVisible // 토글 기능
    }

    // 버튼 스타일 (computed)
    const buttonStyle = computed(() => {
      return {
        backgroundColor: isLiked.value ? '#409EFF' : '#ffffff', // 좋아요가 눌리면 파란색, 아니면 흰색
        color: isLiked.value ? '#ffffff' : 'black', // 눌린 상태는 흰색 텍스트, 아니면 파란색 텍스트
        borderColor: isLiked.value ? '#409EFF' : '#dcdfe6', // 눌린 상태는 파란색 테두리, 아니면 기본 테두리
      }
    })

    return {
      goBack,
      form,
      modifyBoard,
      sysNoParam,
      editToggle,
      getBoardDetail,
      addImgPath,
      imgPreview,
      removeImgPath,
      updateFileList,
      fileList,
      previewImage,
      dialogVisible,
      deletedImages,
      toggleLikeBtn,
      newComment,
      createComment,
      commentList,
      showReplyList,
      newReply,
      replyInputs,
      buttonStyle,
    }
  },
}
</script>

<style scoped>
.container {
    padding: 30px 400px 30px 400px;
}
.like-container{
  padding-bottom: 20px;
}
.like-container .el-button{
  border-radius: 50px; /* 버튼을 둥글게 만듦 */
  padding: 10px 20px; /* 적당한 내부 여백 */
  background-color: white;
  color: rgb(149, 148, 148);
  border-color: rgb(149, 148, 148);
}
.button-container {
    display: flex; 
    justify-content: center; 
    margin: 20px;
}
.image-container{ 
  max-height: 450px;  
  overflow-y: auto; 
}
.el-image {
  border: 2px solid #ddd; /* 테두리 색상 */
  border-radius: 8px; /* 테두리 모서리를 둥글게 */
  padding: 5px; /* 이미지와 테두리 사이 여백 */
  max-width: 100%; /* 이미지가 컨테이너를 벗어나지 않도록 제한 */
  height: auto; /* 이미지 비율을 유지하면서 크기를 조정 */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* 약간의 그림자 추가 */
}
::v-deep(.el-form-item__label) {
  font-weight: bold; /* 라벨 텍스트 굵게 */
}
.comment-container{
  border-top: 2px solid grey;
  padding-top: 20px;
}
.createComment-container{
  display: flex; 
  gap: 10px; /* textarea와 버튼 사이 간격 조절 */
}
.comment-item{
  border-bottom: 1px solid #c8c8c8;
}
.comment-item-user, .detail-user{
  display: flex; 
  gap: 10px; /* textarea와 버튼 사이 간격 조절 */
  margin-top: 20px;
}
.comment-item-user-idDate, .detail-user-idDate{
  display: flex;
  flex-direction: column;
  text-align: left;
}
.comment-createDate{
  color: grey;
  font-size: 13px;
  padding-top:5px;
}
.comment-text {
  text-align: left; /* 왼쪽 정렬 */
  margin-left: 45px; /* 프로필 이미지 크기 + 여백 */
}
.comment-replyList{
  display: flex; 
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  background-color: white;
  color: grey;
  border-color: grey;
  margin-left: 45px; /* 프로필 사진 크기 + 여백과 맞추기 */
  margin-bottom: 20px;
}
.replies {
  margin-left: 50px; /* 루트 댓글보다 50px 들여쓰기 */
  border-top: 1px solid #c8c8c8;
  padding-left: 10px; /* 내용과 경계선 사이 여백 */
}
.createReply-container{
  display: flex; 
  gap: 10px; 
  margin-left: 50px;
  border-top: 2px solid #c8c8c8;
  padding-top: 20px;
  padding-bottom: 20px;
}
.like-wrapper {
  display: flex;
  align-items: center;
}

/* label 자리 공백을 유지 */
.like-wrapper::before {
  content: "";
  display: inline-block;
  width: 50px; /* label 영역의 기본 크기와 동일하게 설정 */
}
</style>

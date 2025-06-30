<template>
  <!--Profile 컴포넌트-->
  <UserProfile />

  <div class="container">
    <div class="detail-user" v-if="editBoardToggle">
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
        <el-input v-model="form.title" :disabled="editBoardToggle" />
      </el-form-item>
      <el-form-item label="내용">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="9"
          resize="none"
          :disabled="editBoardToggle"
        />
      </el-form-item>
      <el-form-item label="이미지">
        <div
          class="image-container"
          v-if="form.imgPath.length > 0 && editBoardToggle"
        >
          <el-image v-for="url in form.imgPath" :key="url" :src="url" lazy />
        </div>
        <div
          class="image-no-container"
          v-if="form.imgPath.length === 0 && editBoardToggle"
        >
          이미지 없음
        </div>
        <!-- 파일 업로드 컴포넌트 -->
        <ImageUploader
          v-if="!editBoardToggle"
          v-model:files="files"
          @preview="imgPreview"
          @delete-existing="deletedImage"
        />
      </el-form-item>
      <el-form-item label="" class="like-wrapper">
        <div class="like-container" v-if="editBoardToggle">
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

    <div class="comment-container" v-if="editBoardToggle">
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
          <!-- 좌측 프로필 -->
          <div class="comment-user-info">
            <!-- 프로필 이미지 -->
            <el-avatar
              class="profile-img"
              :size="40"
              :src="require('@/assets/profile.png')"
            />
            <!-- 생성일자 -->
            <div class="comment-item-user-idDate">
              <span class="comment-userId" style="font-size: 17px">{{
                comment.userId
              }}</span>
              <span class="comment-createDate">{{ comment.createDate }}</span>
            </div>
          </div>

          <!-- 우측 프로필 -->
          <!-- 더보기 메뉴(⋮) -->
          <template
            v-if="comment.userSysNo !== null && !comment.editCommentToggle"
          >
            <el-dropdown trigger="click">
              <span class="el-dropdown-link" style="cursor: pointer">
                <el-icon><MoreFilled /></el-icon>
              </span>
              <template v-slot:dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="editComment(comment)"
                    >수정하기</el-dropdown-item
                  >
                  <el-dropdown-item @click="deleteComment(comment)"
                    >삭제하기</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>

        <!-- 댓글 내용 -->
        <div v-if="!comment.editCommentToggle">
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
              v-model="comment.editText"
              type="textarea"
              :rows="3"
              resize="none"
              style="flex: 1"
            />
            <el-button type="primary" @click="createComment(comment)">
              수정
            </el-button>
          </div>
        </div>

        <!-- 답글 버튼 -->
        <div v-if="!comment.editCommentToggle">
          <el-button
            class="comment-replyList"
            type="primary"
            @click="showReplyList(comment)"
            >답글 {{ comment.replies.length }}</el-button
          >
        </div>
        <div v-else>
          <el-button
            class="comment-replyList"
            @click="cancleEditComment(comment)"
            style="margin-top: 10px"
          >
            취소
          </el-button>
        </div>

        <!-- 대댓글 리스트 -->
        <div v-if="!comment.editCommentToggle">
          <div v-if="comment.repliesVisible">
            <div
              v-for="reply in comment.replies"
              :key="reply.sysNo"
              class="replies"
              style="padding-top: 10px"
            >
              <!-- 프로필 -->
              <div class="comment-item-user">
                <!-- 좌측 프로필 -->
                <div class="comment-user-info">
                  <!-- 프로필 이미지 -->
                  <el-avatar
                    class="profile-img"
                    :size="40"
                    :src="require('@/assets/profile.png')"
                  />
                  <!-- 생성일자 -->
                  <div class="comment-item-user-idDate">
                    <span class="comment-userId" style="font-size: 17px">{{
                      reply.userId
                    }}</span>
                    <span class="comment-createDate">{{
                      reply.createDate
                    }}</span>
                  </div>
                </div>

                <!-- 우측 프로필 -->
                <!-- 더보기 메뉴(⋮) -->
                <template
                  v-if="reply.userSysNo !== null && !reply.editCommentToggle"
                >
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link" style="cursor: pointer">
                      <el-icon><MoreFilled /></el-icon>
                    </span>
                    <template v-slot:dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="editComment(reply)"
                          >수정하기</el-dropdown-item
                        >
                        <el-dropdown-item @click="deleteComment(reply)"
                          >삭제하기</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
              </div>
              <!-- 댓글 내용 -->
              <div v-if="!reply.editCommentToggle">
                <p class="comment-text">
                  <template v-if="reply.userSysNo == null">
                    <el-icon style="margin-right: 10px"
                      ><WarningFilled
                    /></el-icon> </template
                  >{{ reply.comment }}
                </p>
              </div>
              <div v-else style="margin-left: 45px; margin-top: 10px">
                <div style="display: flex; gap: 10px; width: 100%">
                  <el-input
                    v-model="reply.editText"
                    type="textarea"
                    :rows="3"
                    resize="none"
                    style="flex: 1"
                  />
                  <el-button type="primary" @click="createComment(reply)">
                    수정
                  </el-button>
                </div>
              </div>

              <div v-if="reply.editCommentToggle">
                <el-button
                  class="comment-replyList"
                  @click="cancleEditComment(reply)"
                  style="margin-top: 10px"
                >
                  취소
                </el-button>
              </div>
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
  </div>
</template>

<script>
import UserProfile from '../components/Profile'
import { reactive, onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import boardAPI from '../api/BoardAPI'
import { useAuthStore } from '../store/auth'
import { MoreFilled, WarningFilled } from '@element-plus/icons-vue'
import { goBack } from '../utils/routerUtils'
import { showConfirmBox, showAlertBox } from '../utils/elementUtils'
import { MESSAGES } from '../constant/messages'
import ImageUploader from '../components/ImageUploadComp.vue'

export default {
  components: {
    UserProfile,
    MoreFilled,
    WarningFilled,
    ImageUploader,
  },
  setup() {
    const route = useRoute()
    const sysNoParam = route.params.sysNo // URL 경로에서 sysNo를 가져옴

    const authStore = useAuthStore()
    const userId = authStore.getUserId
    const userSysNo = authStore.getSysNo

    const editBoardToggle = ref(true)
    let deletedImages = ref([]) // 삭제된 기존 이미지
    const previewImage = ref('')
    const dialogVisible = ref(false)
    const commentList = ref([])
    const replyInputs = reactive({})
    const isLiked = ref(false) // 좋아요 상태

    const files = ref([]) // CustomUpload v-model로 바인딩할 files 배열

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

    /* 게시글 상세 조회 */
    const getBoardDetail = async () => {
      const response = await boardAPI.getBoardDetail({
        type: 'detail',
        searchList: { sysNo: sysNoParam },
        pageSize: 10,
        pageIndex: 0,
        userId: userId,
        userSysNo: userSysNo,
      })

      if (response.success) {
        //업로드 이미지가 있는 경우
        if (
          response.data[0].imgPath.length > 0 &&
          response.data[0].imgPath[0] != ''
        ) {
          const prefix = 'https://demofille.s3.ap-northeast-2.amazonaws.com/'
          for (let i = 0; i < response.data[0].imgPath.length; i++) {
            //form.imgPath에 S3 경로 넣기
            form.imgPath.push(prefix + response.data[0].imgPath[i])
          }
          toUploadFileList()
        }

        //게시물 상세 세팅
        form.sysNo = response.data[0].sysNo
        form.title = response.data[0].title
        form.content = response.data[0].content
        form.userId = response.data[0].userId
        form.userSysNo = response.data[0].userSysNo
        form.createDate = response.data[0].createDate

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
          editCommentToggle: false, // 수정 모드 여부
          editText: comment.comment, // 수정 중 텍스트 초기값
          repliesVisible: false, // 초기에는 대댓글 숨김
          replies:
            comment.replies?.map((reply) => ({
              ...reply,
              editCommentToggle: false,
              editText: reply.comment,
            })) || [],
        }))
        if (response.data[0].likeFlag == 'like') {
          isLiked.value = true // 파란 버튼 (좋아요 누름)
        } else {
          isLiked.value = false // 흰 버튼 (좋아요 안 누름)
        }
      } else {
        await showAlertBox(response.message, MESSAGES.ERROR).catch(() => {})
      }
    }

    //로드시 게시물 조회
    onMounted(() => {
      getBoardDetail()
    })

    /* 업로드한 파일 클릭시 파일 미리보기 */
    const imgPreview = (url) => {
      previewImage.value = url
      dialogVisible.value = true
    }

    /* 이미지를 Upload 컴포넌트 표시용 객체로 변환 */
    const toUploadFileList = () => {
      //기존 이미지를 Upload 컴포넌트 표시용 객체로 변환
      const uploadList = form.imgPath.map((url, index) => {
        const fileName = url.split('/').pop()
        return {
          name: fileName,
          url: url,
          uid: `preloaded-${index}`,
          status: 'ready',
          raw: null,
        }
      })

      files.value = uploadList
    }

    /* 게시글 수정 버튼 클릭시, 수정 페이지로 이동 */
    /* 게시글 수정 버튼 클릭시, 게시글 수정 */
    const modifyBoard = async () => {
      //게시글 수정 토글된 경우(게시글 수정)
      if (!editBoardToggle.value) {
        if (!form.title.trim() || !form.content.trim()) {
          //모든 필드 입력 확인
          await showAlertBox(
            MESSAGES.REQUIRE_ALL_FIELDS,
            MESSAGES.WARNING
          ).catch(() => {})
        } else {
          //신규 업로드 파일 추출(raw가 있는 파일)
          const uploadFiles = files.value.filter((file) => file.raw != null)

          //신규 업로드 파일이 있는 경우
          if (uploadFiles.length > 0) {
            // FormData 생성
            const formData = new FormData()
            uploadFiles.forEach((file) => formData.append('files', file.raw))

            //S3에서 PresignedURL 발급
            const presignedURLs = await boardAPI.getPresignedURL(formData)

            const imgPath = []
            for (let i = 0; i < presignedURLs.length; i++) {
              //S3에 파일 업로드
              const response = await boardAPI.uploadFile(
                presignedURLs[i],
                uploadFiles[i].raw
              )

              //파일 이름만 추출하여 imgPath에 저장
              imgPath.push(decodeURIComponent(response.split('/')[3]))
            }

            //최종 imgPath에 기존 파일명과 신규 업로드 파일명 저장
            form.imgPath = [
              ...files.value
                .filter((file) => !file.raw)
                .map((file) => file.url.split('/').pop()), // 기존 파일명
              ...imgPath, //신규 업로드 파일명
            ]
          }

          //삭제할 이미지가 있는 경우, S3에서 이미지 삭제
          if (deletedImages.value.length > 0) {
            await boardAPI.deleteFiles({ keys: deletedImages.value })
          }

          //***이거 없애고 한번 더 확인해보***
          form.imgPath = [
            ...form.imgPath.map((url) => url.split('/').pop()), // 기존 파일명만 추출
          ]

          //저장 API 호출
          const response = await boardAPI.createBoard(form)

          if (response.success) {
            await showAlertBox(MESSAGES.SUCCESS_SAVE, MESSAGES.SUCCESS)
              .then(() => {
                form.imgPath = []
                deletedImages.value = []
                getBoardDetail()
                editBoardToggle.value = true
              })
              .catch(() => {})
          } else {
            await showAlertBox(response.message, MESSAGES.ERROR).catch(() => {})
          }
        }
      } else {
        //게시글 수정 토글 안된 경우(게시글 상세보기)
        if (form.userId == userId) {
          //사용자가 작성자인 경우, 수정
          //파일 목록을 Upload 컴포넌트 객체로 변환
          toUploadFileList()

          //게시글 수정 화면으로 토글
          editBoardToggle.value = false
        } else {
          //사용자가 작성자가 아닌 경우
          await showAlertBox(MESSAGES.AUTHOR_MISMATCH, MESSAGES.WARNING).catch(
            () => {}
          )
        }
      }
    }

    //좋아요 버튼 클릭시 Redis 좋아요 Count 증가
    const toggleLikeBtn = async () => {
      if (isLiked.value) {
        //좋아요 누른 상황 -> 취소인 경우
        isLiked.value = false
        await boardAPI.updateLike({
          action: 'unLike',
          boardSysNo: form.sysNo,
          userId: userId,
          userSysNo: userSysNo,
        })
      } else {
        //좋아요 안누른 상황 -> 좋아요 누른 경우
        isLiked.value = true
        await boardAPI.updateLike({
          action: 'like',
          boardSysNo: form.sysNo,
          userId: userId,
          userSysNo: userSysNo,
        })
      }
    }

    //댓글 등록 버튼 클릭시 댓글 저장
    const createComment = async (comment = null) => {
      let response
      //댓글, 대댓글 수정
      if (comment != null && comment.editCommentToggle) {
        newReply.comment = comment.editText
        newReply.sysNo = comment.sysNo
        newReply.parSysNo = comment.parSysNo
        response = await boardAPI.createComment(newReply)
      } else if (comment != null) {
        //대댓글 신규 등록인 경우
        newReply.parSysNo = comment.sysNo
        newReply.boardSysNo = form.sysNo
        newReply.comment = replyInputs[comment.sysNo] || '' // 해당 댓글의 입력값 사용

        response = await boardAPI.createComment(newReply)
      } else {
        //댓글 신규 등록인 경우
        response = await boardAPI.createComment(newComment)
      }

      if (response.success) {
        await showAlertBox(MESSAGES.SUCCESS_SAVE_COMMENT, MESSAGES.SUCCESS)
          .then(() => {
            newComment.comment = ''
            Object.keys(replyInputs).forEach((key) => (replyInputs[key] = '')) // 모든 대댓글 입력창 초기화
            newReply.comment = ''
            getBoardDetail()
          })
          .catch(() => {})
      } else {
        await showAlertBox(response.message, MESSAGES.ERROR).catch(() => {})
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

    //댓글 수정
    const editComment = async (comment) => {
      if (comment.userId == userId) {
        comment.editCommentToggle = true // 선택된 댓글만 수정 모드로
        comment.editText = comment.comment
      } else {
        await showAlertBox(MESSAGES.AUTHOR_MISMATCH, MESSAGES.WARNING).catch(
          () => {}
        )
      }
    }

    //댓글 삭제
    const deleteComment = async (comment) => {
      if (comment.userId == userId) {
        try {
          await showConfirmBox(
            MESSAGES.CONFIRM_DELETE,
            MESSAGES.WARNING_KOR,
            MESSAGES.WARNING,
            MESSAGES.DELETE
          ).catch(() => {})

          //삭제 누른 경우에만 삭제 실행
          const response = await boardAPI.deleteComment({
            sysNo: comment.sysNo,
          })

          if (response.success) {
            await showAlertBox(MESSAGES.SUCCESS_DELETE, MESSAGES.SUCCESS)
              .then(() => {
                getBoardDetail()
              })
              .catch(() => {})
          } else {
            await showAlertBox(MESSAGES.FAILED_DELETE, MESSAGES.WARNING).catch(
              () => {}
            )
          }
        } catch (e) {
          // 사용자가 '취소' 버튼을 눌렀거나 confirm이 reject된 경우
          console.log('사용자가 삭제를 취소했습니다.')
        }
      } else {
        await showAlertBox(MESSAGES.AUTHOR_MISMATCH, MESSAGES.WARNING).catch(
          () => {}
        )
      }
    }

    //댓글 수정 취소
    const cancleEditComment = async (comment) => {
      comment.editCommentToggle = false
      comment.repliesVisible = false
    }

    /* 기존 업로드 이미지 삭제시, deleteImages(삭제 배열)에 추가 */
    const deletedImage = (url) => {
      //S3 주소로부터 파일명을 추출하여 삭제 이미지 배열에 저장
      const fileName = url.split('/').pop()
      if (!deletedImages.value.includes(fileName)) {
        deletedImages.value.push(fileName)
      }

      //form.imgPath에서 제거
      form.imgPath = form.imgPath.filter((imgUrl) => imgUrl !== url)
    }

    return {
      goBack,
      form,
      modifyBoard,
      sysNoParam,
      editBoardToggle,
      getBoardDetail,
      imgPreview,
      toUploadFileList,
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
      editComment,
      deleteComment,
      cancleEditComment,
      files,
      deletedImage,
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
  justify-content: flex-start; /*space-between; /* 좌우로 정렬 */
  align-items: center;
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
.comment-user-info {
  display: flex;
  gap: 10px;
  align-items: center;
}
.comment-item-user .el-dropdown {
  margin-left: auto;
}
</style>

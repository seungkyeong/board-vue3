<template>
  <!--Profile 컴포넌트-->
  <UserProfile />

  <div class="container">
    <el-form :model="form" label-width="auto" style="width: 100%">
      <el-form-item label="제목">
        <el-input
          v-model="form.title"
          placeholder="제목을 입력해주세요."
          clearable
          autofocus
        />
      </el-form-item>
      <el-form-item label="내용">
        <el-input
          v-model="form.content"
          type="textarea"
          placeholder="내용을 입력해주세요."
          :rows="9"
          resize="none"
        />
      </el-form-item>
      <el-form-item label="이미지">
        <!-- 파일 업로드 컴포넌트 -->
        <ImageUploader v-model:files="files" @preview="imgPreview" />
      </el-form-item>
    </el-form>
    <div class="button-container">
      <el-button type="primary" @click="saveBoard">저장</el-button>
      <el-button @click="goBack">취소</el-button>
    </div>

    <!-- 이미지 미리보기 -->
    <el-dialog v-model="dialogVisible" width="50%">
      <img :src="previewImage" alt="미리보기" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import boardAPI from '../api/BoardAPI'
import UserProfile from '../components/Profile'
import { useAuthStore } from '../store/auth'
import { MESSAGES } from '../constant/messages'
import { showAlertBox } from '../utils/elementUtils'
import { ROUTES } from '../constant/routes'
import { goToPage, goBack } from '../utils/routerUtils'
import ImageUploader from '../components/ImageUploadComp.vue'

export default {
  components: {
    UserProfile,
    ImageUploader,
  },
  setup() {
    const previewImage = ref('') //미리보기 이미지 URL
    const dialogVisible = ref(false) //미리보기 표시 여부

    const authStore = useAuthStore()
    const userId = authStore.getUserId
    const userSysNo = authStore.getSysNo

    const form = reactive({
      title: '',
      content: '',
      userId: userId,
      userSysNo: userSysNo,
      imgPath: [],
    })

    const files = ref([]) // File 객체 배열(업로드할 파일 목록)

    /* 게시글 저장 */
    const saveBoard = async () => {
      if (!form.title || !form.content) {
        //모든 필드 입력 확인
        await showAlertBox(MESSAGES.REQUIRE_ALL_FIELDS, MESSAGES.WARNING).catch(
          () => {}
        )
      } else {
        //이미지 업로드 파일이 있는 경우
        if (files.value.length > 0) {
          // FormData 생성
          const formData = new FormData()
          files.value.forEach((file) => formData.append('files', file.raw))

          //S3에서 PresignedURL 발급
          const presignedURLs = await boardAPI.getPresignedURL(formData)

          const imgPath = []
          for (let i = 0; i < presignedURLs.length; i++) {
            const file = files.value[i].raw

            //S3에 파일 업로드
            const response = await boardAPI.uploadFile(presignedURLs[i], file)

            //파일 이름만 추출하여 imgPath에 저장
            imgPath.push(decodeURIComponent(response.split('/')[3]))
          }
          form.imgPath = imgPath
        }

        //저장 API 호출
        const response = await boardAPI.createBoard(form)
        if (response.success) {
          await showAlertBox(MESSAGES.SUCCESS_SAVE, MESSAGES.SUCCESS).catch(
            () => {}
          )
        } else {
          await showAlertBox(response.message, MESSAGES.WARNING).catch(() => {})
        }
        goToPage(ROUTES.BOARD_LIST)
      }
    }

    /* 업로드한 파일 클릭시 파일 미리보기 */
    const imgPreview = (url) => {
      previewImage.value = url
      dialogVisible.value = true
    }

    return {
      goBack,
      form,
      saveBoard,
      imgPreview,
      previewImage,
      dialogVisible,
      files,
    }
  },
}
</script>

<style scoped>
.container {
    padding: 0px 400px 30px 400px;
}
.button-container {
    display: flex; 
    justify-content: center; 
}
</style>

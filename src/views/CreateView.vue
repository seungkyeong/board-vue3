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
        <el-upload
          drag
          :auto-upload="false"
          multiple
          style="width: 100%"
          accept="image/*"
          :on-change="addImgPath"
          :on-remove="removeImgPath"
          :on-preview="imgPreview"
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
import { useRouter } from 'vue-router'
import { UploadFilled } from '@element-plus/icons-vue'
import boardAPI from '../api/BoardAPI'
import { ElMessageBox } from 'element-plus'
import UserProfile from '../components/Profile'
import { useAuthStore } from '../store/auth'

export default {
  components: {
    UploadFilled,
    UserProfile,
  },
  setup() {
    const previewImage = ref('')
    const router = useRouter()
    const dialogVisible = ref(false)
    const authStore = useAuthStore()

    const userId = authStore.getUserId
    const userSysNo = authStore.getSysNo

    const form = reactive({
      title: '',
      content: '',
      userId: userId,
      userSysNo: userSysNo,
      // imgPath: '',
      imgPath: [],
    })

    let fileData = new FormData()
    let imgPath = []

    //취소버튼 클릭시 이전 페이지로 이동
    const goBack = () => {
      router.go(-1)
    }

    //저장버튼 클릭시 저장
    const saveBoard = async () => {
      //제목, 내용 입력했는지 확인
      if (!form.title || !form.content) {
        ElMessageBox.alert('제목과 내용을 입력해주세요!', '', {
          confirmButtonText: '확인',
          type: 'warning',
        }).catch(() => {})
      } else {
        //파일 업로드 수행 API 호출
        if (fileData.has('files')) {
          // 파일 이름만 추출
          // const formDataFiles = fileData.getAll('files')
          // const fileNames = formDataFiles.map((file) => file.name)

          //S3에서 PresignedURL 발급
          const presignedURLs = await boardAPI.getPresignedURL(fileData)
          //S3에 업로드
          const files = fileData.getAll('files')
          console.log('presignedURLs.length ' + presignedURLs.length)
          for (let i = 0; i < presignedURLs.length; i++) {
            const file = files[i] // FormData에서 해당 파일 가져오기
            // S3에 파일 업로드
            const response = await boardAPI.uploadFile(presignedURLs[i], file) //const response =
            //파일 이름만 저장
            imgPath.push(decodeURIComponent(response.split('/')[3]))
          }
          form.imgPath = imgPath
        }
      }

      //저장 수행 API 호출
      boardAPI
        .createBoard(form)
        .then((response) => {
          if (response.success) {
            ElMessageBox.alert('저장되었습니다.', '', {
              confirmButtonText: '확인',
              type: 'success',
            })
              .then(() => {
                router.push({ path: '/board/list' })
              })
              .catch(() => {
                router.push({ path: '/board/list' })
              })
          }
        })
        .catch((error) => console.error('Fail:', error))
    }

    //업로드 영역에 파일 추가시 제목을 imgPath에 넣음
    const addImgPath = (file) => {
      fileData.append('files', file.raw)
    }

    //업로드 영역에 파일 제거시 제목을 imgPath에서 제거
    const removeImgPath = (file) => {
      const newFileData = new FormData()
      for (const [key, value] of fileData.entries()) {
        if (value !== file.raw) {
          newFileData.append(key, value) // 기존 파일 중 삭제 대상이 아닌 파일만 추가
        }
      }
      fileData = newFileData // 기존 FormData 교체
    }

    //업로드한 파일 클릭시 파일 미리보기
    const imgPreview = (file) => {
      previewImage.value = file.url || URL.createObjectURL(file.raw) // 로컬 URL 생성
      dialogVisible.value = true
    }

    return {
      goBack,
      form,
      saveBoard,
      addImgPath,
      removeImgPath,
      fileData,
      imgPreview,
      previewImage,
      dialogVisible,
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

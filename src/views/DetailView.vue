<template>
  <!--Profile 컴포넌트-->
  <UserProfile />

  <div class="container">
    <el-form :model="form" label-width="auto" style="width: 100%">
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
    </el-form>

    <div class="button-container">
      <el-button type="primary" @click="modifyBoard">수정</el-button>
      <el-button @click="goBack">목록</el-button>
    </div>

    <!-- 이미지 미리보기 -->
    <el-dialog v-model="dialogVisible" width="50%">
      <img :src="previewImage" alt="미리보기" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import UserProfile from '../components/Profile'
import { reactive, onMounted, ref } from 'vue'
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
    const editToggle = ref(true)
    let deletedImages = ref([]) // 삭제된 기존 이미지 추적
    let fileData = new FormData()
    const previewImage = ref('')
    const dialogVisible = ref(false)
    let fileList = ref([])
    // let imgPath = []

    const form = reactive({
      sysNo: '',
      title: '',
      content: '',
      imgPath: [],
      userId: '',
      userSysNo: '',
    })

    const getBoardDetail = async () => {
      const response = await boardAPI.getBoardDetail({
        searchList: { sysNo: sysNoParam },
        pageSize: 10,
        pageIndex: 0,
      })

      if (response.success) {
        //s3에서 가져오기
        if (
          response.data.imgPath.length > 0 &&
          response.data.imgPath[0] != ''
        ) {
          const prefix = 'https://demofille.s3.ap-northeast-2.amazonaws.com/'
          for (let i = 0; i < response.data.imgPath.length; i++) {
            form.imgPath.push(prefix + response.data.imgPath[i])
          }
          updateFileList()
        }

        //이미지 파일 이름 배열로 저장
        form.sysNo = response.data.sysNo
        form.title = response.data.title
        form.content = response.data.content
        form.userId = response.data.userId
        form.userSysNo = response.data.userSysNo
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
        console.log('기존 img 삭제시 form.imgPath', form.imgPath)
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
      console.log('form.imgPath ' + form.imgPath)
      const updatedList = form.imgPath.map((url, index) => {
        const fileName = url.split('/')[3] // 파일 이름 추출
        const uid = `file-${index}` // 고유 ID 생성
        return {
          name: fileName,
          url, // 파일 URL
          uid,
        }
      })
      // console.log('updatedList ' + JSON.stringify(updatedList))
      fileList.value = [...updatedList]
    }

    //수정버튼 클릭시 수정 페이지로 이동
    const modifyBoard = async () => {
      if (!editToggle.value) {
        if (!form.title || !form.content) {
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
            console.log('presignedURLs.length ' + presignedURLs.length)
            for (let i = 0; i < presignedURLs.length; i++) {
              const file = files[i] // FormData에서 해당 파일 가져오기
              // S3에 파일 업로드
              const response = await boardAPI.uploadFile(presignedURLs[i], file)
              fileNames.push(decodeURIComponent(response.split('/')[3]))
            }
            console.log('fileNames' + fileNames)
            form.imgPath = [
              ...form.imgPath.map((url) => url.split('/').pop()), // 기존 파일명만 추출
              ...fileNames, // 새로 업로드된 파일명 추가
            ]
            console.log('form.imgPath ' + JSON.stringify(form.imgPath))
          }

          //s3에서 파일 삭제 + 서버 만들어야 함
          if (deletedImages.value.length > 0) {
            console.log('deletedImages ' + JSON.stringify(deletedImages.value))
          }

          form.imgPath = [
            ...form.imgPath.map((url) => url.split('/').pop()), // 기존 파일명만 추출
          ]
        }

        //저장 수행 API 호출
        const response = await boardAPI.createBoard(form)

        if (response.success) {
          ElMessageBox.alert('저장되었습니다.', '', {
            confirmButtonText: '확인',
            type: 'success',
          })
            .then(() => {
              form.imgPath = []
              deletedImages = []
              fileList.value = []
              fileData = new FormData()
              getBoardDetail()
              editToggle.value = true

              console.log('create후 form.imagepath', form.imgPath)
            })
            .catch(() => {})
        } else {
          ElMessageBox.alert(response.message, '', {
            confirmButtonText: '확인',
            type: 'error',
          }).catch(() => {})
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
    }
  },
}
</script>

<style scoped>
.container {
    padding: 30px 400px 30px 400px;
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
</style>

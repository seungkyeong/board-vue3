<template>
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
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
          style="width: 100%"
          accept="image/*"
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
      <el-button @click="goBack">취소</el-button>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UploadFilled } from '@element-plus/icons-vue'
import boardAPI from '../api/BoardAPI'

export default {
  components: {
    UploadFilled,
  },
  setup() {
    const router = useRouter()

    //localStorage에서 userId, userName 가져오기
    // const userId = localStorage.getItem('userId');
    // const userName = localStorage.getItem('userName');
    const userId = 'sgjeong'
    const userName = '정승경'

    const form = reactive({
      sysNo: '',
      title: '',
      content: '',
      imgPath: [],
      userId: '',
      userName: '',
    })

    const fileList = reactive([])

    // 컴포넌트가 마운트될 때 localStorage에서 form_data를 가져오기
    onMounted(() => {
      const storedFormData = localStorage.getItem('detailData')
      if (storedFormData) {
        const parsedFormData = JSON.parse(storedFormData)
        Object.assign(form, parsedFormData) // form 데이터를 로드
      }

      // 기존 이미지 URL을 file-list 형식으로 변환
      fileList.push(
        ...form.imgPath.map((url) => ({
          name: url.split('/').pop(), // URL에서 파일 이름 추출
          url: url,
          thumbUrl: url,
          status: 'success', // 이미지가 이미 업로드된 상태로 표시
          uid: Date.now(), // 고유 ID
        }))
      )
    })

    //취소버튼 클릭시 이전 페이지로 이동
    const goBack = () => {
      router.go(-1)
    }

    //저장버튼 클릭시 저장
    const modifyBoard = () => {
      boardAPI
        .modifyBoard(form.title, form.content, userId, userName, form.imgPath)
        .then((response) => console.log('Success:', response.data))
        .catch((error) => console.error('Fail:', error))
    }

    return {
      goBack,
      onMounted,
      form,
      fileList,
      modifyBoard,
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
}
</style>

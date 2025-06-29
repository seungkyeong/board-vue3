<template>
  <el-upload
    drag
    :auto-upload="false"
    multiple
    style="width: 100%"
    accept="image/*"
    :file-list="fileList"
    @change="onAddImg"
    @remove="onRemoveImg"
    @preview="onPreview"
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
</template>

<script setup>
import { ref, watch } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'

const props = defineProps({
  files: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['update:files', 'preview'])

const fileList = ref([])

// props.files가 변경되면 동기화
watch(
  () => props.files,
  (newFiles) => {
    fileList.value = newFiles.map((file, index) => ({
      name: file.name || `image-${index}`,
      url: URL.createObjectURL(file),
      raw: file,
      uid: String(Date.now() + index), // 고유 uid 설정
      status: 'ready',
    }))
  },
  { immediate: true }
)

/* 이미지 추가시, files 부모 전달 */
const onAddImg = (file, newFileList) => {
  //기존 업로드 파일의 uid 저장
  const existingUids = new Set(fileList.value.map((f) => f.uid))

  //파일 목록 중 신규 파일 추출(기존 uid에 없는 파일)
  const newItems = newFileList
    .filter((f) => !existingUids.has(f.uid))
    .map((file, index) => ({
      name: file.name || `image-${index}`,
      url: URL.createObjectURL(file.raw),
      raw: file.raw,
      uid: file.uid || String(Date.now() + Math.random()),
      status: 'ready',
    }))

  //신규 파일 목록 추가
  fileList.value = [...fileList.value, ...newItems]

  // 부모에 파일 목록 전달 (raw만 추출)
  emit(
    'update:files',
    fileList.value.map((f) => f.raw)
  )
}

/* 이미지 제거시, files 부모 전달 */
const onRemoveImg = (file) => {
  // fileList에서 삭제된 항목 제외
  fileList.value = fileList.value.filter((f) => f.uid !== file.uid)

  // 부모에 파일 목록 전달 (raw만 추출)
  emit(
    'update:files',
    fileList.value.map((f) => f.raw)
  )
}

/* 업로드 이미지 항목 클릭시, URL 부모 전달 */
const onPreview = (file) => {
  emit('preview', file.url || URL.createObjectURL(file.raw))
}
</script>

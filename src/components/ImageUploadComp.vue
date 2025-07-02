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

/* props.files가 변경되면 동기화 */
watch(
  () => props.files,
  (newFiles = []) => {
    fileList.value = newFiles.map((item, idx) => {
      const raw = item.raw ?? null
      const url = item.url ?? (raw ? URL.createObjectURL(raw) : '')
      return {
        uid: item.uid ?? `tmp-${Date.now()}-${idx}`,
        name: item.name ?? raw?.name ?? `image-${idx}`,
        url,
        raw,
        status: 'ready',
      }
    })
  },
  { immediate: true }
)

/* 이미지 추가시, 파일 목록에 이미지 추가한 후 부모 전달 */
const onAddImg = (file, newFileList) => {
  //기존 업로드 파일의 uid 저장
  const existingUids = new Set(fileList.value.map((f) => f.uid))

  //파일 목록 중 신규 파일 추출(기존 uid가 없는 파일)
  const newItems = newFileList
    .filter((f) => !existingUids.has(f.uid))
    .map((f) => ({
      uid: f.uid,
      name: f.name,
      url: f.url || URL.createObjectURL(f.raw),
      raw: f.raw,
      status: 'ready',
    }))

  //신규 파일 목록 추가
  fileList.value.push(...newItems)

  //부모와 파일 목록 동기화
  syncToParent()
}

/* 이미지 제거시,  파일 목록에서 이미지 삭제한 후 부모 전달 */
const onRemoveImg = (file) => {
  //기존 업로드된 이미지인 경우(raw가 없고 url이 있음)
  if (!file.raw && file.url) {
    emit('delete-existing', file.url) //부모에게 삭제 알림
  }

  //fileList에서 삭제된 항목 제외
  fileList.value = fileList.value.filter((f) => f.uid !== file.uid)

  //부모와 파일 목록 동기화
  syncToParent()
}

/* 업로드 이미지 항목 클릭시, URL 부모 전달 */
const onPreview = (file) => {
  emit('preview', file.url || URL.createObjectURL(file.raw))
}

/* 부모랑 파일 목록 동기화 */
const syncToParent = () => {
  emit(
    'update:files',
    fileList.value.map((f) => ({
      uid: f.uid,
      name: f.name,
      url: f.url,
      raw: f.raw ?? null, //신규 파일인 경우 raw, 기존 파일인 경우 null
    }))
  )
}
</script>

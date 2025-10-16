<template>
  <el-dialog
    :title="'内容分类管理' + $t('common.imports')"
    v-model="visible"
    align-center
    draggable
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    width="80%"
  >
    <m-excel-import :columns="excelColumns" :on-complete="complete" style="height: 75vh" />
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { aiContentTypeImport } from '@/api/admin/content/aiContentType'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import type { ImportExcelColumn } from '@i/utils/excel'

declare type CloseType = 'refresh' | undefined

const emits = defineEmits<{
  (e: 'close', type?: CloseType): void
}>()

const { t } = useI18n()

const visible = ref(false)

const excelColumns = computed<ImportExcelColumn[]>(() => [
  {prop: 'title',label: '类别名称'},
])

// 开始导入数据
async function complete(data: any[]) {
  return aiContentTypeImport(data).then((res) => {
    if (!res.data) {
      ElNotification({
        type: 'success',
        message: t('common.importSuccess'),
        duration: 3000
      })
      close('refresh')
    }
    return res.data
  })
}

// 打开导入框
function open() {
  visible.value = true
}

// 关闭
function close(type?: CloseType) {
  visible.value = false
  if(type) emits('close', type)
}

defineExpose({
  open
})
</script>
<style lang="scss" scoped></style>

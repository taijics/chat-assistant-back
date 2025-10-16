<template>
  <el-dialog
    :title="'聊天内容管理' + $t('common.imports')"
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
import { aiChatContentImport } from '@/api/admin/content/aiChatContent'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import type { ImportExcelColumn } from '@i/utils/excel'
import useDictDetails from '@/utils/dict'

declare type CloseType = 'refresh' | undefined

const emits = defineEmits<{
  (e: 'close', type?: CloseType): void
}>()

const { t } = useI18n()

const visible = ref(false)

const excelColumns = computed<ImportExcelColumn[]>(() => [
  {prop: 'contentType',label: '图片/表情/文本',type: 'select',itemList: useDictDetails(2),rules: [{required: true},{itemList: useDictDetails(2)}]},
  {prop: 'uploadUserId',label: '上传用户id',type: 'select',itemList: useDictDetails(2),rules: [{itemList: useDictDetails(2)}]},
  {prop: 'content',label: '内容'},
  {prop: 'contentTypeId',label: '分类id',type: 'select',itemList: useDictDetails(2),rules: [{itemList: useDictDetails(2)}]},
])

// 开始导入数据
async function complete(data: any[]) {
  return aiChatContentImport(data).then((res) => {
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

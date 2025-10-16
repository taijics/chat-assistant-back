<template>
  <el-dialog
    :title="'小组管理' + $t('common.imports')"
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
import { aiUserTeamImport } from '@/api/admin/user/aiUserTeam'
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
  {prop: 'title',label: '名称',rules: [{required: true}]},
  {prop: 'teamAdminId',label: '组长'},
  {prop: 'teamUserNum',label: '小组人数',type: 'number',rules: [{type: 'int'}]},
])

// 开始导入数据
async function complete(data: any[]) {
  return aiUserTeamImport(data).then((res) => {
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

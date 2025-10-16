<template>
  <el-dialog
    :title="'用户管理' + $t('common.imports')"
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
import { aiUserImport } from '@/api/admin/user/aiUser'
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
  {prop: 'id',label: '文本',rules: [{type: 'int'}]},
  {prop: 'phone',label: '手机号',rules: [{required: true},{type: 'phone'}]},
  {prop: 'password',label: '文本',rules: [{required: true}]},
  {prop: 'username',label: '姓名',rules: [{required: true}]},
  {prop: 'teamId',label: '小组id',type: 'select',itemList: useDictDetails(2),rules: [{itemList: useDictDetails(2)}]},
  {prop: 'isdel',label: '可用状态',rules: [{type: 'int'}]},
  {prop: 'firmId',label: '所属公司'},
  {prop: 'remark',label: '备注'},
  {prop: 'careateTime',label: '创建时间'},
])

// 开始导入数据
async function complete(data: any[]) {
  return aiUserImport(data).then((res) => {
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

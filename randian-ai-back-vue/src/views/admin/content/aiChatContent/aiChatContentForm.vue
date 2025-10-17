<template>
  <div class="form-view">
    <el-scrollbar class="m-form-scroll" max-height="75vh">
      <m-form ref="formRef" :columns="columns" :model="formData" :handleType="handleType" :loading="formLoading" />
    </el-scrollbar>
    <div class="m-footer">
      <el-button icon="close" @click="close()">{{ $t('common.cancel') }}</el-button>
      <template v-if="!formLoading">
        <el-button
          v-if="['add', 'edit'].includes(handleType)"
          v-auth="['admin:content:aiChatContent:add', 'admin:content:aiChatContent:edit']"
          icon="check"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ $t('common.save') }}
        </el-button>
      </template>
    </div>
  </div>
</template>
<script setup lang="tsx">
import type { PropType } from 'vue'
import { ref, watchEffect } from 'vue'
import {
  getAiChatContentById,
  postInsertAiChatContent,
  putUpdateAiChatContent
} from '@/api/admin/content/aiChatContent'
import { useI18n } from 'vue-i18n'
import useDictDetails from '@/utils/dict'

const props = defineProps({
  handleType: {
    type: String as PropType<FormHandleType>,
    default: 'add'
  },
  modelValue: {
    type: Object as PropType<{ id: number }>
  }
})

const { t } = useI18n()

const emits = defineEmits<{
  (e: 'close', type: 'refresh' | string): void
}>()

const formRef = ref()
const formLoading = ref(false)
const saveLoading = ref(false)
const formData = ref({})

init()

async function init() {
  formLoading.value = true
  if (props.handleType !== 'add') {
    await getAiChatContentById(props.modelValue!.id!).then((res) => {
      formData.value = res.data
    })
  }
  formLoading.value = false
}

// 表单列定义
const columns = ref<CommonFormColumn<typeof formData.value>[]>([])
watchEffect(() => {
  columns.value = [
    {
      prop: 'contentType',
      label: '图片/表情/文本',
      type: 'select',
      rules: [{ required: true }],
      itemList: useDictDetails(2)
    },
    { prop: 'uploadUserId', label: '上传用户id', type: 'select', itemList: useDictDetails(2) },
    { prop: 'useType', label: '使用分类', type: 'select', itemList: useDictDetails(2) },
    { prop: 'content', label: '内容', type: 'text' },
    { prop: 'img', label: '图片/表情', type: 'upload-img' },
    { prop: 'contentTypeId', label: '分类id', type: 'select', itemList: useDictDetails(2) },
    { prop: 'createTime', label: '创建时间', type: 'datetime' },
  ]
})

// 保存方法
function save() {
  formRef.value.submit().then(() => {
    const fun = props.handleType === 'add' ? postInsertAiChatContent : putUpdateAiChatContent
    fun(formData.value, {
      loadingRef: saveLoading,
      showSuccessMsg: true,
      successMsg: t('common.saveSuccess')
    }).then(() => close('refresh'))
  })
}

function close(type?: any) {
  emits('close', type)
}
</script>
<style lang="scss" scoped>
.form-view {
  height: 100%;
  display: flex;
  flex-direction: column;

  .m-form-scroll {
    flex-grow: 1;
    padding-right: 10px;
    margin-right: -10px;
  }
}
</style>

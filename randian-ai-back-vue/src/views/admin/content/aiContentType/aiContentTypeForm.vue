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
          v-auth="['admin:content:aiContentType:add', 'admin:content:aiContentType:edit']"
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
  getAiContentTypeById,
  postInsertAiContentType,
  putUpdateAiContentType
} from '@/api/admin/content/aiContentType'
import { useI18n } from 'vue-i18n'

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
    await getAiContentTypeById(props.modelValue!.id!).then((res) => {
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
      prop: 'typeClass',
      label: '类别分类',
      type: 'select', // 或 'radio'
      options: [
        { label: '图片', value: 0 },
        { label: '表情', value: 1 },
        { label: '文字', value: 2 }
      ],
      defaultValue: 2,
      rules: [{ required: true, message: '类别分类必需选择', trigger: 'change' }]
    },
    {
      prop: 'title',
      label: '类别名称',
      type: 'text',
      rules: [{ required: true, message: '类别名称不能为空', trigger: 'blur' }]
    },
    {
      prop: 'deleted',
      label: '是否可用',
      type: 'switch',
      activeValue: false, // “可用”实际值为 false
      inactiveValue: true // “不可用”实际值为 true
    }
  ]
})

// 保存方法
function save() {
  formRef.value.submit().then(() => {
    const fun = props.handleType === 'add' ? postInsertAiContentType : putUpdateAiContentType
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

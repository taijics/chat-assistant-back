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
          v-auth="['admin:content:aiAgentKz:add', 'admin:content:aiAgentKz:edit']"
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
import { getAiAgentKzById, postInsertAiAgentKz, putUpdateAiAgentKz } from '@/api/admin/content/aiAgentKz'
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

// 这里彻底用布尔类型，默认否
const formData = ref({
  title: '',
  token: '',
  botId: '',
  isLongTime: false, // Boolean类型
  expireDate: '',
  stats: 1
})

init()

async function init() {
  formLoading.value = true
  if (props.handleType !== 'add') {
    await getAiAgentKzById(props.modelValue!.id!).then(res => {
      // 如果后端返回的是 0/1, 转成布尔
      formData.value = {
        ...res.data,
        isLongTime: res.data.isLongTime === true || res.data.isLongTime === 1
      }
    })
  }
  formLoading.value = false
}

const columns = ref<any[]>([])

watchEffect(() => {
  // 布尔判断即可
  const isLongTimeNo = formData.value.isLongTime
  columns.value = [
    {
      prop: 'title',
      label: '智能体名称',
      type: 'text',
      rules: [{ required: true, message: '请输入智能体名称', trigger: 'blur' }]
    },
    {
      prop: 'token',
      label: '扣子token',
      type: 'text',
      rules: [{ required: true, message: '请输入扣子token', trigger: 'blur' }]
    },
    {
      prop: 'botId',
      label: 'botId',
      type: 'text',
      rules: [{ required: true, message: '请输入botId', trigger: 'blur' }]
    },
    {
      prop: 'isLongTime',
      label: '长期有效',
      type: 'radio-group',
      options: [
        { label: '否', value: false },
        { label: '是', value: true }
      ],
      rules: [{ required: true, message: '请选择是否长期有效', trigger: 'change' }]
    },
    {
      prop: 'expireDate',
      label: '到期时间',
      type: 'date',
      hidden: isLongTimeNo,
      rules: isLongTimeNo
        ? [{ required: true, message: '请选择到期时间', trigger: 'change' }]
        : []
    },
    {
      prop: 'stats',
      label: '状态',
      type: 'select',
      options: [
        { label: '正常', value: 1 },
        { label: '已到期', value: 2 },
        { label: '不可用', value: 0 }
      ],
      rules: [{ required: true, message: '请选择状态', trigger: 'change' }]
    }
  ]
})

// 保存方法
function save() {
  formRef.value.submit().then(() => {
    const fun = props.handleType === 'add' ? postInsertAiAgentKz : putUpdateAiAgentKz
    // 这里直接提交，不需要转换类型
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
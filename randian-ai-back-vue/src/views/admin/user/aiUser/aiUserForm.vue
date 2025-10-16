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
          v-auth="['admin:user:aiUser:add', 'admin:user:aiUser:edit']"
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
import { getAiUserById, postInsertAiUser, putUpdateAiUser } from '@/api/admin/user/aiUser'
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
    await getAiUserById(props.modelValue!.id!).then(res => {
      formData.value = res.data
    })
  }
  formLoading.value = false
}

// 表单列定义
const columns = ref<CommonFormColumn<typeof formData.value> []>([])
watchEffect(() => {
  columns.value = [
    {prop: 'phone',label: '手机号',type: 'text',rules: [{required: true},{type: 'phone'}]},
    {prop: 'password',label: '文本',type: 'password',rules: [{required: true}]},
    {prop: 'username',label: '姓名',type: 'text',rules: [{required: true}]},
    {prop: 'teamId',label: '小组id',type: 'select',itemList: useDictDetails(2)},
    {prop: 'isdel',label: '可用状态',type: 'switch',rules: [{type: 'int'}]},
    {prop: 'firmId',label: '所属公司',type: 'text'},
    {prop: 'remark',label: '备注',type: 'textarea'},
    {prop: 'careateTime',label: '创建时间',type: 'datetime'},
    {prop: 'createTime',label: '创建时间',type: 'datetime'},
    {prop: 'updateTime',label: '修改时间',type: 'datetime'},
    {prop: 'createBy',label: '创建人',type: 'number'},
    {prop: 'updateBy',label: '修改人',type: 'number'},
    {prop: 'deleted',label: '是否已删除',type: 'switch'},
    {prop: 'sysOrgId',label: '机构ID',type: 'number'},
    {prop: 'sysRoleId',label: '角色ID',type: 'number'}
  ]
})

// 保存方法
function save() {
  formRef.value.submit().then(() => {
    const fun = props.handleType === 'add' ? postInsertAiUser : putUpdateAiUser
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

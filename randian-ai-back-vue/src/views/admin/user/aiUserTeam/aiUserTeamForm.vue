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
          v-auth="['admin:user:aiUserTeam:add', 'admin:user:aiUserTeam:edit']"
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
  getAiUserTeamById,
  postInsertAiUserTeam,
  putUpdateAiUserTeam,
  searchTeamAdmin
} from '@/api/admin/user/aiUserTeam'
import { useI18n } from 'vue-i18n'

// 组长下拉数据
const teamAdminOptions = ref([]) // [{id, phone, username, display}, ...]
const teamAdminLoading = ref(false)

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

function loadInitialTeamAdmin() {
  teamAdminLoading.value = true
  searchTeamAdmin('', 10).then((res) => {
    teamAdminOptions.value = (res.data || []).map((u: any) => ({
      ...u,
      display: `${u.phone}-${u.username}` // 拼接显示内容
    }))
    teamAdminLoading.value = false
  })
}
loadInitialTeamAdmin()

// 远程搜索
function remoteSearchTeamAdmin(query: string) {
  teamAdminLoading.value = true;
  searchTeamAdmin(query, 10).then(res => {
    // 如果data为空，options设成空数组
    const arr = res.data || [];
    teamAdminOptions.value = arr.length > 0
      ? arr.map(u => ({ ...u, display: `${u.phone}-${u.username}` }))
      : [];
    teamAdminLoading.value = false;
  });
}
// 表单初始化
init()
async function init() {
  formLoading.value = true
  if (props.handleType !== 'add') {
    await getAiUserTeamById(props.modelValue!.id!).then((res) => {
      formData.value = res.data
    })
  }
  formLoading.value = false
}

// 表单列定义（只保留需要的字段）
const columns = ref<CommonFormColumn<typeof formData.value>[]>([])
watchEffect(() => {
  columns.value = [
    { prop: 'title', label: '名称', type: 'text', rules: [{ required: true }] },
    {
      prop: 'teamAdminId',
      label: '组长',
      type: 'select',
      filterable: true, // 可以输入
      remote: true, // 远程搜索
      remoteMethod: remoteSearchTeamAdmin,
      options: teamAdminOptions.value,
      loading: teamAdminLoading.value,
      props: {
        label: 'display',
        value: 'id'
      },
      placeholder: '请输入手机号或姓名',
      noDataText: '暂无数据' // 有些组件是 no-data-text
    },
    { prop: 'icon', label: '图标', type: 'upload-img' }
  ]
})

// 保存方法
function save() {
  formRef.value.submit().then(() => {
    const fun = props.handleType === 'add' ? postInsertAiUserTeam : putUpdateAiUserTeam
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

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
import { queryAiUserTeamList } from '@/api/admin/user/aiUserTeam' // 你需确保有这个接口
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

// 可用状态默认打开（0可用，1不可用，按你后端约定）
const formData = ref<AiUserForm>({
  isdel: 0
})

const teamOptions = ref([]) // 小组下拉数据
const teamLoading = ref(false)

function loadInitialTeam() {
  teamLoading.value = true
  queryAiUserTeamList({
    isPage: true,
    param: { pageIndex: 1, pageSize: 10 }
  }).then((res) => {
    teamOptions.value = (res.data?.list || []).map((u) => ({
      ...u,
      display: u.title
    }))
    teamLoading.value = false
  })
}
loadInitialTeam()

function remoteSearchTeam(query: string) {
  teamLoading.value = true
  queryAiUserTeamList({
    isPage: true,
    param: { title: query, pageIndex: 1, pageSize: 10 }
  }).then(res => {
    const arr = res.data?.list || []
    teamOptions.value = arr.length > 0 ? arr.map(u => ({
      ...u,
      display: u.title
    })) : []
    teamLoading.value = false
  })
}
init()
async function init() {
  formLoading.value = true
  if (props.handleType !== 'add') {
    await getAiUserById(props.modelValue!.id!).then((res) => {
      formData.value = res.data
      // 保证编辑时可用状态有值（如果后端返回null，设置为0）
      if (formData.value.isdel == null) formData.value.isdel = 0
    })
  }
  formLoading.value = false
}

const columns = ref<CommonFormColumn<typeof formData.value>[]>([])
watchEffect(() => {
  columns.value = [
    { prop: 'phone', label: '手机号', type: 'text', rules: [{ required: true }, { type: 'phone' }] },
    { prop: 'password', label: '密码', type: 'password', rules: [{ required: true }],showPassword: true  },
    { prop: 'username', label: '姓名', type: 'text', rules: [{ required: true }] },
    {
      prop: 'teamId',
      label: '小组',
      type: 'select',
      filterable: true,
      remote: true,
      remoteMethod: remoteSearchTeam,
      options: teamOptions.value,
      loading: teamLoading.value,
      props: {
        label: 'display',
        value: 'id'
      },
      placeholder: '请输入小组名称',
      noDataText: '暂无数据'
    },
   {
     prop: 'isdel',
     label: '可用状态',
     type: 'switch',
     rules: [{ type: 'int' }],
     activeValue: 0,    // 开启时的值
     inactiveValue: 1   // 关闭时的值
   },
    /* { prop: 'firmId', label: '所属公司', type: 'text' }, */
    { prop: 'remark', label: '备注', type: 'textarea' }
  ]
})
interface AiUserForm {
  phone?: string
  password?: string
  username?: string
  teamId?: number | string
  isdel?: number
  firmId?: string
  remark?: string
}

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

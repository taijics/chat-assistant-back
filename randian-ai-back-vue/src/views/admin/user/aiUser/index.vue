<template>
  <div class="root">
    <m-table
      class="m-table"
      ref="tableRef"
      is-filter-table
      is-complex-filter
      :filter-param="filterParam"
      :filter-columns="topFilterColumns"
      :columns="columns"
      :fetch-data="queryAiUserList"
      selection="multiple"
      @selection-change="(rows) => (selectRows = rows)"
      v-model:data="data"
    >
      <template #right-action>
        <el-button v-auth="'admin:user:aiUser:import'" type="primary" icon="upload" @click="importRef.open()">
          {{ $t('common.imports') }}
        </el-button>
        <el-button v-auth="'admin:user:aiUser:add'" type="primary" icon="plus" @click="openForm('add', null)">
          {{ $t('common.add') }}
        </el-button>
        <el-button
          v-auth="'admin:user:aiUser:del'"
          type="danger"
          icon="delete"
          :disabled="selectRows.length === 0"
          @click="del(selectRows)"
          >{{ $t('common.del') }}
        </el-button>
        <el-button @click="reset">重置</el-button>
      </template>
    </m-table>
    <el-dialog
      :title="handleType && $t('common.' + handleType)"
      v-model="formVisible"
      draggable
      destroy-on-close
      append-to-body
      align-center
      :close-on-click-modal="false"
    >
      <AiUserForm :handle-type="handleType" :model-value="row" @close="close" style="height: 100%" />
    </el-dialog>
    <AiUserImport ref="importRef" @close="close" />
  </div>
</template>
<script setup lang="tsx">
import { type Ref, computed, reactive, ref,nextTick  } from 'vue'
import { delAiUserByIds, queryAiUserList } from '@/api/admin/user/aiUser'
import AiUserForm from './aiUserForm.vue'
import { useI18n } from 'vue-i18n'
import AiUserImport from './aiUserImport.vue'
import { queryAiUserTeamList } from '@/api/admin/user/aiUserTeam'

const { t } = useI18n()
const tableRef = ref()
const data = ref([])
const selectRows = ref([])
const filterParam = reactive<UserFilterParam>({})
const importRef = ref()

// 小组下拉远程搜索框
const teamOptions = ref([])
const teamLoading = ref(false)
function remoteSearchTeam(query: string) {
  teamLoading.value = true
  queryAiUserTeamList({
    isPage: true,
    param: { title: query, pageIndex: 1, pageSize: 10 }
  }).then((res) => {
    const arr = res.data?.list || []
    teamOptions.value =
      arr.length > 0
        ? arr.map((u) => ({
            ...u,
            display: u.title
          }))
        : []
    teamLoading.value = false
  })
}
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

const topFilterColumns = computed(() => [
  { prop: 'phone', label: '手机号', rules: [{}, { type: 'phone' }] },
  { prop: 'username', label: '姓名', rules: [{}] },
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
    type: 'select',
    options: [
      { label: '全部', value: undefined },
      { label: '可用', value: 0 },
      { label: '不可用', value: 1 }
    ]
  }
])
interface UserFilterParam {
  phone?: string
  username?: string
  teamId?: number | string
  isdel?: false
}

function reset() {
  filterParam.phone = ''
  filterParam.username = ''
  filterParam.teamId = undefined
  delete filterParam.isdel
  nextTick(() => {
    tableRef.value?.resetFilter()
  })
}
const columns: Ref<CommonTableColumn[]> = computed(() => [
  { type: 'index', width: 90 },
  { prop: 'phone', label: '手机号', type: 'text' },
  { prop: 'username', label: '姓名', type: 'text' },
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
    }
  },
  {
    prop: 'isdel',
    label: '可用状态',
    type: 'switch',
    activeText: '开启',
    inactiveText: '关闭',
    activeValue: false, // 注意：activeValue/inactiveValue也需要对应布尔
    inactiveValue: true,
    formatter: (row) => (row.isDel === false ? '可用' : '不可用')
  },
  { prop: 'firmId', label: '所属公司', type: 'text' },
  { prop: 'remark', label: '备注', type: 'textarea' },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      {
        label: t('common.edit'),
        auth: 'admin:user:aiUser:edit',
        icon: 'edit',
        onClick: (row) => openForm('edit', row)
      },
      {
        label: t('common.detail'),
        auth: 'admin:user:aiUser:detail',
        icon: 'document',
        onClick: (row) => openForm('detail', row)
      },
      {
        label: t('common.del'),
        auth: 'admin:user:aiUser:del',
        icon: 'delete',
        type: 'danger',
        onClick: (row) => del([row])
      }
    ]
  }
])

const formVisible = ref(false)
const handleType = ref()
const row = ref()

function openForm(type: FormHandleType, r) {
  row.value = r
  formVisible.value = true
  handleType.value = type
}

function del(rows: any[]) {
  delAiUserByIds(rows.map((i) => i.id).join(','), {
    showLoading: true,
    showBeforeConfirm: true,
    showSuccessMsg: true,
    confirmMsg: t('common.confirmDelete')
  }).then(() => {
    tableRef.value.fetchQuery()
  })
}

function close(type) {
  formVisible.value = false
  if (type === 'refresh') {
    tableRef.value.fetchQuery()
  }
}
</script>
<style lang="scss" scoped>
.m-table {
  height: 100%;
}
</style>

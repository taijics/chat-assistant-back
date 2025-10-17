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
      :fetch-data="queryAiAgentKzList"
      selection="multiple"
      @selection-change="(rows) => (selectRows = rows)"
      v-model:data="data"
    >
      <template #right-action>
        <el-button v-auth="'admin:content:aiAgentKz:import'" type="primary" icon="upload" @click="importRef.open()">
          {{ $t('common.imports') }}
        </el-button>
        <el-button v-auth="'admin:content:aiAgentKz:add'" type="primary" icon="plus" @click="openForm('add', null)">
          {{ $t('common.add') }}
        </el-button>
        <el-button
          v-auth="'admin:content:aiAgentKz:del'"
          type="danger"
          icon="delete"
          :disabled="selectRows.length === 0"
          @click="del(selectRows)"
          >{{ $t('common.del') }}
        </el-button>
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
      <AiAgentKzForm :handle-type="handleType" :model-value="row" @close="close" style="height: 100%" />
    </el-dialog>
    <AiAgentKzImport ref="importRef" @close="close" />
  </div>
</template>
<script setup lang="tsx">
import { computed, reactive, ref } from 'vue'
import { delAiAgentKzByIds, queryAiAgentKzList } from '@/api/admin/content/aiAgentKz'
import AiAgentKzForm from './aiAgentKzForm.vue'
import { useI18n } from 'vue-i18n'
import AiAgentKzImport from './aiAgentKzImport.vue'

const { t } = useI18n()
const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const importRef = ref()

const topFilterColumns = computed(() => [
  { prop: 'title', label: '智能体名称' },
  {
    prop: 'isLongTime',
    label: '长期有效',
    type: 'select',
    options: [
      { label: '否', value: false },
      { label: '是', value: true }
    ]
  },
  {
    prop: 'stats',
    label: '状态',
    type: 'select',
    options: [
      { label: '正常', value: 1 },
      { label: '已到期', value: 2 },
      { label: '不可用', value: 0 }
    ]
  }
])
const columns = computed(() => [
  { type: 'index', width: 90 },
  { prop: 'id', label: 'id', type: 'number', notExport: true },
  { prop: 'title', label: '智能体名称', type: 'text' },
  { prop: 'expireDate', label: '到期时间', type: 'date' },
  {
    prop: 'isLongTime',
    label: '长期有效',
    type: 'select',
    options: [
      { label: '否', value: false },
      { label: '是', value: true }
    ],
    formatter: (row) => (row.isLongTime ? '是' : '否')
    // 若后端返回 0/1 可改为 formatter: (row) => (row.isLongTime === true || row.isLongTime === 1 ? '是' : '否')
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
    formatter: (row) => {
      switch (row.stats) {
        case 1:
          return '正常'
        case 2:
          return '已到期'
        case 0:
          return '不可用'
        default:
          return ''
      }
    },
    cellStyle: (row) => {
      if (row.stats === 1) return { color: 'green' }
      if (row.stats === 2 || row.stats === 0) return { color: 'red' }
      return {}
    },
    notExport: true
  },
  { prop: 'createTime', label: '创建时间', type: 'datetime' },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      {
        label: t('common.edit'),
        auth: 'admin:content:aiAgentKz:edit',
        icon: 'edit',
        onClick: (row) => openForm('edit', row)
      },
      {
        label: t('common.detail'),
        auth: 'admin:content:aiAgentKz:detail',
        icon: 'document',
        onClick: (row) => openForm('detail', row)
      },
      {
        label: t('common.del'),
        auth: 'admin:content:aiAgentKz:del',
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
  delAiAgentKzByIds(rows.map((i) => i.id).join(','), {
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

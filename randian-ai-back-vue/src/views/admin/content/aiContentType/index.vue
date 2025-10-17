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
      :fetch-data="queryAiContentTypeList"
      selection="multiple"
      @selection-change="(rows) => (selectRows = rows)"
      v-model:data="data"
    >
      <template #right-action>
        <el-button v-auth="'admin:content:aiContentType:import'" type="primary" icon="upload" @click="importRef.open()">
          {{ $t('common.imports') }}
        </el-button>
        <el-button v-auth="'admin:content:aiContentType:add'" type="primary" icon="plus" @click="openForm('add', null)">
          {{ $t('common.add') }}
        </el-button>
        <el-button
          v-auth="'admin:content:aiContentType:del'"
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
      <AiContentTypeForm :handle-type="handleType" :model-value="row" @close="close" style="height: 100%" />
    </el-dialog>
    <AiContentTypeImport ref="importRef" @close="close" />
  </div>
</template>
<script setup lang="tsx">
import { type Ref, computed, reactive, ref } from 'vue'
import { delAiContentTypeByIds, queryAiContentTypeList } from '@/api/admin/content/aiContentType'
import AiContentTypeForm from './aiContentTypeForm.vue'
import { useI18n } from 'vue-i18n'
import AiContentTypeImport from './aiContentTypeImport.vue'

const { t } = useI18n()
const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const importRef = ref()

const topFilterColumns = computed(() => [
  { prop: 'title', label: '类别名称' },
  { prop: 'careateUserId', label: '创建人', type: 'number' },
  {
    prop: 'deleted',
    label: '是否可用',
    type: 'switch',
    activeValue: false, // “可用”实际值为 false
    inactiveValue: true // “不可用”实际值为 true
  }
])

const columns: Ref<CommonTableColumn[]> = computed(() => [
  { type: 'index', width: 90 },
  { prop: 'id', label: 'id', type: 'number' },
  { prop: 'title', label: '类别名称', type: 'text' },
  { prop: 'careateUserId', label: '创建人', type: 'number' },
  {
    prop: 'typeClass', // 类别分类
    label: '类别分类',
    type: 'text',
    formatter: (row) => {
      switch (row.typeClass) {
        case 0:
          return '图片'
        case 1:
          return '表情'
        case 2:
          return '文字'
        default:
          return ''
      }
    }
  },
  {
    prop: 'useScope', // 使用范围
    label: '使用范围',
    type: 'text',
    formatter: (row) => {
      switch (row.useScope) {
        case 0:
          return '公司'
        case 1:
          return '小组'
        case 2:
          return '私人'
        default:
          return ''
      }
    }
  },
  { prop: 'createTime', label: '创建时间', type: 'datetime' },
  {
    prop: 'deleted',
    label: '是否可用',
    type: 'text',
    formatter: (row) => (row.deleted === false ? '可用' : '不可用')
  },
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      {
        label: t('common.edit'),
        auth: 'admin:content:aiContentType:edit',
        icon: 'edit',
        onClick: (row) => openForm('edit', row)
      },
      {
        label: t('common.detail'),
        auth: 'admin:content:aiContentType:detail',
        icon: 'document',
        onClick: (row) => openForm('detail', row)
      },
      {
        label: t('common.del'),
        auth: 'admin:content:aiContentType:del',
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
  delAiContentTypeByIds(rows.map((i) => i.id).join(','), {
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

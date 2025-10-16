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
      :fetch-data="queryAiChatContentList"
      selection="multiple"
      @selection-change="(rows) => (selectRows = rows)"
      v-model:data="data"
    >
      <template #right-action>
        <el-button v-auth="'admin:content:aiChatContent:import'" type="primary" icon="upload" @click="importRef.open()">
          {{ $t('common.imports') }}
        </el-button>
        <el-button v-auth="'admin:content:aiChatContent:add'" type="primary" icon="plus" @click="openForm('add', null)">
          {{ $t('common.add') }}
        </el-button>
        <el-button
            v-auth="'admin:content:aiChatContent:del'"
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
      <AiChatContentForm :handle-type="handleType" :model-value="row" @close="close" style="height: 100%" />
    </el-dialog>
    <AiChatContentImport ref="importRef" @close="close" />
  </div>
</template>
<script setup lang="tsx">
import { type Ref, computed, reactive, ref } from 'vue'
import { delAiChatContentByIds, queryAiChatContentList } from '@/api/admin/content/aiChatContent'
import AiChatContentForm from './aiChatContentForm.vue'
import { useI18n } from 'vue-i18n'
import useDictDetails from '@/utils/dict'
import AiChatContentImport from './aiChatContentImport.vue'

const { t } = useI18n()
const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const importRef = ref()

const topFilterColumns = computed(() => [
  {prop: 'id',label: '主键ID',type: 'number'},
  {prop: 'contentType',label: '图片/表情/文本',type: 'select',itemList: useDictDetails(2),rules: [{}]},
  {prop: 'uploadUserId',label: '上传用户id',type: 'select',itemList: useDictDetails(2)},
  {prop: 'content',label: '内容'},
  {prop: 'contentTypeId',label: '分类id',type: 'select',itemList: useDictDetails(2)},
  {prop: 'createTime',label: '创建时间',type: 'datetime'},
  {prop: 'updateTime',label: '修改时间',type: 'datetime'},
  {prop: 'createBy',label: '创建人',type: 'number'},
  {prop: 'updateBy',label: '修改人',type: 'number'},
  {prop: 'deleted',label: '是否已删除'}
])

const columns: Ref<CommonTableColumn[]> = computed(() => [
  { type: 'index', width: 90 },
  {prop: 'id',label: '主键ID',type: 'number'},
  {prop: 'contentType',label: '整数',type: 'number'},
  {prop: 'contentType',label: '图片/表情/文本',type: 'select',itemList: useDictDetails(2)},
  {prop: 'uploadUserId',label: '上传用户id',type: 'select',itemList: useDictDetails(2)},
  {prop: 'useType',label: '使用分类',type: 'select',itemList: useDictDetails(2)},
  {prop: 'content',label: '内容',type: 'text'},
  {prop: 'contentTypeId',label: '分类id',type: 'select',itemList: useDictDetails(2)},
  {prop: 'datetime',label: '创建时间',type: 'datetime'},
  {prop: 'createTime',label: '创建时间',type: 'datetime'},
  {prop: 'updateTime',label: '修改时间',type: 'datetime'},
  {prop: 'createBy',label: '创建人',type: 'number'},
  {prop: 'updateBy',label: '修改人',type: 'number'},
  {prop: 'deleted',label: '是否已删除',type: 'switch'},
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: t('common.edit'), auth: 'admin:content:aiChatContent:edit', icon: 'edit', onClick: (row) => openForm('edit', row) },
      {
        label: t('common.detail'),
        auth: 'admin:content:aiChatContent:detail',
        icon: 'document',
        onClick: (row) => openForm('detail', row)
      },
      { label: t('common.del'), auth: 'admin:content:aiChatContent:del', icon: 'delete', type: 'danger', onClick: (row) => del([row]) }
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
  delAiChatContentByIds(rows.map((i) => i.id).join(','), {
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

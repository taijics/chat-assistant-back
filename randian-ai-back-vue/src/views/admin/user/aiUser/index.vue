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
import { type Ref, computed, reactive, ref } from 'vue'
import { delAiUserByIds, queryAiUserList } from '@/api/admin/user/aiUser'
import AiUserForm from './aiUserForm.vue'
import { useI18n } from 'vue-i18n'
import useDictDetails from '@/utils/dict'
import AiUserImport from './aiUserImport.vue'

const { t } = useI18n()
const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const importRef = ref()

const topFilterColumns = computed(() => [
  {prop: 'phone',label: '手机号',rules: [{},{type: 'phone'}]},
  {prop: 'password',label: '文本',rules: [{}]},
  {prop: 'username',label: '姓名',rules: [{}]},
  {prop: 'teamId',label: '小组id',type: 'select',itemList: useDictDetails(2)},
  {prop: 'isdel',label: '可用状态',rules: [{type: 'int'}]},
  {prop: 'firmId',label: '所属公司'},
  {prop: 'remark',label: '备注'},
  {prop: 'careateTime',label: '创建时间',type: 'datetime'},
  {prop: 'createTime',label: '创建时间',type: 'datetime'},
  {prop: 'updateTime',label: '修改时间',type: 'datetime'},
  {prop: 'createBy',label: '创建人',type: 'number'},
  {prop: 'updateBy',label: '修改人',type: 'number'},
  {prop: 'deleted',label: '是否已删除'},
  {prop: 'sysOrgId',label: '机构ID',type: 'number'},
  {prop: 'sysRoleId',label: '角色ID',type: 'number'}
])

const columns: Ref<CommonTableColumn[]> = computed(() => [
  { type: 'index', width: 90 },
  {prop: 'id',label: '文本',type: 'text',notExport: true},
  {prop: 'phone',label: '手机号',type: 'text'},
  {prop: 'password',label: '文本',type: 'password'},
  {prop: 'username',label: '姓名',type: 'text'},
  {prop: 'teamId',label: '小组id',type: 'select',itemList: useDictDetails(2)},
  {prop: 'isdel',label: '可用状态',type: 'switch'},
  {prop: 'firmId',label: '所属公司',type: 'text'},
  {prop: 'remark',label: '备注',type: 'textarea'},
  {prop: 'careateTime',label: '创建时间',type: 'datetime'},
  {prop: 'createTime',label: '创建时间',type: 'datetime'},
  {prop: 'updateTime',label: '修改时间',type: 'datetime'},
  {prop: 'createBy',label: '创建人',type: 'number'},
  {prop: 'updateBy',label: '修改人',type: 'number'},
  {prop: 'deleted',label: '是否已删除',type: 'switch'},
  {prop: 'sysOrgId',label: '机构ID',type: 'number'},
  {prop: 'sysRoleId',label: '角色ID',type: 'number'},
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: t('common.edit'), auth: 'admin:user:aiUser:edit', icon: 'edit', onClick: (row) => openForm('edit', row) },
      {
        label: t('common.detail'),
        auth: 'admin:user:aiUser:detail',
        icon: 'document',
        onClick: (row) => openForm('detail', row)
      },
      { label: t('common.del'), auth: 'admin:user:aiUser:del', icon: 'delete', type: 'danger', onClick: (row) => del([row]) }
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

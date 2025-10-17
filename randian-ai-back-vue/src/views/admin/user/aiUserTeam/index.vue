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
      :fetch-data="queryAiUserTeamList"
      selection="multiple"
      @selection-change="(rows) => (selectRows = rows)"
      v-model:data="data"
    >
      <template #right-action>
        <el-button v-auth="'admin:user:aiUserTeam:import'" type="primary" icon="upload" @click="importRef.open()">
          {{ $t('common.imports') }}
        </el-button>
        <el-button v-auth="'admin:user:aiUserTeam:add'" type="primary" icon="plus" @click="openForm('add', null)">
          {{ $t('common.add') }}
        </el-button>
        <el-button
            v-auth="'admin:user:aiUserTeam:del'"
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
      <AiUserTeamForm :handle-type="handleType" :model-value="row" @close="close" style="height: 100%" />
    </el-dialog>
    <AiUserTeamImport ref="importRef" @close="close" />
  </div>
</template>
<script setup lang="tsx">
import { type Ref, computed, reactive, ref } from 'vue'
import { delAiUserTeamByIds, queryAiUserTeamList } from '@/api/admin/user/aiUserTeam'
import AiUserTeamForm from './aiUserTeamForm.vue'
import { useI18n } from 'vue-i18n'
import AiUserTeamImport from './aiUserTeamImport.vue'

const { t } = useI18n()
const tableRef = ref()
const data = ref([])
const selectRows = ref([])

const filterParam = reactive({})

const importRef = ref()

const topFilterColumns = computed(() => [
  {prop: 'title',label: '名称',rules: [{}]},
])

const columns: Ref<CommonTableColumn[]> = computed(() => [
  { type: 'index', width: 90 },
  {prop: 'id',label: 'id',type: 'text'},
  {prop: 'title',label: '名称',type: 'text'},
  {prop: 'teamAdminId',label: '组长',type: 'text'},
  {prop: 'createTime',label: '创建时间',type: 'datetime'},
  {prop: 'icon',label: '图标',type: 'upload-img'},
  {
    type: 'operation',
    fixed: 'right',
    align: 'center',
    buttons: [
      { label: t('common.edit'), auth: 'admin:user:aiUserTeam:edit', icon: 'edit', onClick: (row) => openForm('edit', row) },
      {
        label: t('common.detail'),
        auth: 'admin:user:aiUserTeam:detail',
        icon: 'document',
        onClick: (row) => openForm('detail', row)
      },
      { label: t('common.del'), auth: 'admin:user:aiUserTeam:del', icon: 'delete', type: 'danger', onClick: (row) => del([row]) }
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
  delAiUserTeamByIds(rows.map((i) => i.id).join(','), {
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

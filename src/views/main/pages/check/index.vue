<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" :icon="Plus" @click="handleAdd">{{ $t('message.common.add') }}</el-button>
        <ExcelUpload @upload-success="handleUploadSuccess"/>
      </div>
    </div>

    <div class="layout-container-table">
      <Table ref="table" v-model:page="page" v-loading="loading" :showIndex="true" :showSelection="false"
        :data="data_table_list" @getTableData="getTableData" @selection-change="handleSelectionChange">
        <el-table-column prop="is_true" label="验证是否通过" align="center" width="200" />
        <el-table-column prop="account" label="账号" align="center" width="200" />
        <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop" width="200" align="center">
          <template #header="scope">
            <div :style="{ color: column.type === 'True' ? 'green' : 'black' }">{{ column.label }}<br></div>
            <div v-for="(value, index) in column.value" :key="index">
              {{ value }}
            </div>
          </template>
          <template #default="scope">
            <div
              :class="{ 'green-background': column.value.includes(scope.row[column.prop]), 'red-background': !column.value.includes(scope.row[column.prop]) }">
              {{ scope.row[column.prop] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.common.handle')" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button type="success" @click="handlecat(scope.row)">{{ $t('message.common.upgradeList') }}</el-button>
            <el-button type="danger" @click="handlefail(scope.row)">{{ $t('message.common.faillist') }}</el-button>
            <el-popconfirm :title="$t('message.common.closeTip')" @confirm="handleclose([scope.row])">
              <template #reference>
                <el-button type="warning">{{ $t('message.common.close') }}</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </Table>
      <Layer :layer="layer" @getTableData="getTableData" v-if="layer.show" />
      <Account :layer="account" @getTableData="getTableData" v-if="account.show"></Account>
      <Fail :layer="fail" @getTableData="getTableData" v-if="fail.show" :tid="task.taskId"></Fail>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import Table from '@/components/table/index.vue'
import ExcelUpload from '@/components/excelUoload/index.vue'
import { Page } from '@/components/table/type'
import { getData, close } from '@/api/table'
import Layer from './layer.vue'
import Account from './account.vue'
import Fail from './fail.vue'
import { data_table_list } from './enum'
import { ElMessage } from 'element-plus'
import type { LayerInterface } from '@/components/layer/index.vue'
import { Plus, Search, Delete } from '@element-plus/icons'
export default defineComponent({
  name: 'crudTable',
  components: {
    Table,
    Layer,
    Account,
    Fail,
    ExcelUpload
  },
  setup() {
    // 弹窗控制器
    const layer: LayerInterface = reactive({
      show: false,
      title: '新增',
      showButton: true
    })
    const account: LayerInterface = reactive({
      show: false,
      title: '升级中列表',
      showButton: false,

    })
    const fail: LayerInterface = reactive({
      show: false,
      title: '失败列表',
      showButton: false,

    })
    // 分页参数, 供table使用
    const page: Page = reactive({
      index: 1,
      size: 20,
      total: 0
    })
    const loading = ref(true)
    const tableData = ref([])
    const chooseData = ref([])
    const handleSelectionChange = (val: []) => {
      chooseData.value = val
    }
    const columns = [{ 'prop': '用户版本号', 'label': '用户版本号', 'type': 'True', 'value': ['AVATR.OS 3.3.0'] }, { 'prop': 'CDC-软件版本号', 'label': 'CDC-软件版本号', 'type': 'True', 'value': ['SWD.8.8'] }, { 'prop': 'MDC-软件版本号', 'label': 'MDC-软件版本号', 'type': 'True', 'value': ['SWC.17.0'] }, { 'prop': 'TBOX-软件版本号', 'label': 'TBOX-软件版本号', 'type': 'True', 'value': ['SWD.5.6'] }, { 'prop': 'AMP-软件版本号', 'label': 'AMP-软件版本号', 'type': 'True', 'value': ['SWD.9.12', 'SWD.7.13'] }, { 'prop': 'BCU-软件版本号', 'label': 'BCU-软件版本号', 'type': 'True', 'value': ['SWD.01.0'] }, { 'prop': 'BDC-软件版本号', 'label': 'BDC-软件版本号', 'type': 'True', 'value': ['SWB.11.0'] }, { 'prop': 'BLE-软件版本号', 'label': 'BLE-软件版本号', 'type': 'True', 'value': ['SWC.1.5'] }, { 'prop': 'DSM-软件版本号', 'label': 'DSM-软件版本号', 'type': 'True', 'value': ['SWA.1.19', 'SWA.1.19'] }, { 'prop': 'DRM-软件版本号', 'label': 'DRM-软件版本号', 'type': 'True', 'value': ['SWD.1.5/2.0.0'] }, { 'prop': 'ESJB-软件版本号', 'label': 'ESJB-软件版本号', 'type': 'True', 'value': ['SWB.10.5'] }, { 'prop': 'GW-软件版本号', 'label': 'GW-软件版本号', 'type': 'True', 'value': ['SWC.2.4'] }, { 'prop': 'HBE-软件版本号', 'label': 'HBE-软件版本号', 'type': 'True', 'value': ['SWC.8.5/WKDCG001437', 'SWC.8.5/WKDCG001437', 'SWC.8.5/WKDCG001437'] }, { 'prop': 'IC-软件版本号', 'label': 'IC-软件版本号', 'type': 'True', 'value': ['SWD.3'] }, { 'prop': 'ITMS-软件版本号', 'label': 'ITMS-软件版本号', 'type': 'True', 'value': ['SWD.2.1/CAB.1.0'] }, { 'prop': 'LSC-软件版本号', 'label': 'LSC-软件版本号', 'type': 'True', 'value': ['SWD.0.8'] }, { 'prop': 'MKC1-软件版本号', 'label': 'MKC1-软件版本号', 'type': 'True', 'value': ['SWC.8.5/WKCCG002275', 'SWC.8.5/WKCCG002275', 'SWC.8.5/WKCCG002275'] }, { 'prop': 'NFCENTER-软件版本号', 'label': 'NFCENTER-软件版本号', 'type': 'True', 'value': ['SWC.0.8'] }, { 'prop': 'NFCSTART-软件版本号', 'label': 'NFCSTART-软件版本号', 'type': 'True', 'value': ['SWD.1.6'] }, { 'prop': 'PCU-软件版本号', 'label': 'PCU-软件版本号', 'type': 'True', 'value': ['SWC.0.6'] }, { 'prop': 'PDU-软件版本号', 'label': 'PDU-软件版本号', 'type': 'True', 'value': ['SWD.3.0'] }, { 'prop': 'PTS-软件版本号', 'label': 'PTS-软件版本号', 'type': 'True', 'value': ['SWB.1.6/V0101'] }, { 'prop': 'RMIPU-软件版本号', 'label': 'RMIPU-软件版本号', 'type': 'True', 'value': ['SWD.1.2/SWD.1.2'] }, { 'prop': 'VCU-软件版本号', 'label': 'VCU-软件版本号', 'type': 'True', 'value': ['SWD.40.1', 'SWD.41.1'] }, { 'prop': 'FMIPU-软件版本号', 'label': 'FMIPU-软件版本号', 'type': 'True', 'value': ['SWD.1.2/SWD.1.2', 0] }, { 'prop': 'PDSM-软件版本号', 'label': 'PDSM-软件版本号', 'type': 'True', 'value': ['SWA.1.17', 0] }, { 'prop': 'FLDCU-软件版本号', 'label': 'FLDCU-软件版本号', 'type': 'True', 'value': ['SWC.1.9/V0101', 0] }, { 'prop': 'FRDCU-软件版本号', 'label': 'FRDCU-软件版本号', 'type': 'True', 'value': [] }, { 'prop': 'RLDCU-软件版本号', 'label': 'RLDCU-软件版本号', 'type': 'True', 'value': [] }, { 'prop': 'RRDCU-软件版本号', 'label': 'RRDCU-软件版本号', 'type': 'True', 'value': [] }, { 'prop': 'FLADR-软件版本号', 'label': 'FLADR-软件版本号', 'type': 'True', 'value': ['SWB.2.7/1.00', 0] }, { 'prop': 'FRADR-软件版本号', 'label': 'FRADR-软件版本号', 'type': 'True', 'value': [] }, { 'prop': 'RLADR-软件版本号', 'label': 'RLADR-软件版本号', 'type': 'True', 'value': [] }, { 'prop': 'RRADR-软件版本号', 'label': 'RRADR-软件版本号', 'type': 'True', 'value': [] }, { 'prop': 'CMSL-软件版本号', 'label': 'CMSL-软件版本号', 'type': 'True', 'value': ['SWD.1.6/2.1.6', 0] }, { 'prop': 'CMSR-软件版本号', 'label': 'CMSR-软件版本号', 'type': 'True', 'value': [] }, { 'prop': 'VMC-软件版本号', 'label': 'VMC-软件版本号', 'type': 'True', 'value': ['SWC.2.0/CALA.1_1', 0] }]

    // 获取表格数据
    // params <init> Boolean ，默认为false，用于判断是否需要初始化分页
    const getTableData = (init: boolean) => {
      loading.value = true
      if (init) {
        page.index = 1
      }
      let params = {
        page: page.index,
        pageSize: page.size,
      }
      getData(params)
        .then(res => {
          let data = res.data.list
          tableData.value = res.data.list
          page.total = Number(res.data.pager.total)
        })
        .catch(error => {
          tableData.value = []
          page.index = 1
          page.total = 0
        })
        .finally(() => {
          loading.value = false
        })
    }
    //关闭任务
    const handleclose = (data: object[]) => {
      let params = {
        id: data.map((e: any) => {
          return e.id
        }).join(',')
      }
      close(params)
        .then(res => {
          ElMessage({
            type: 'success',
            message: res.message
          })
          getTableData(tableData.value.length === 1 ? true : false)
        })
    }

    // 新增弹窗功能
    const handleAdd = () => {
      layer.title = '新增数据'
      layer.show = true
      delete layer.row
    }
    const task = reactive({
      taskId: ''
    })
    const handlecat = (row: any) => {
      account.row = row
      account.title = row.name + "升级中列表"
      account.show = true
      account.width = "1500px"
    }
    const handlefail = (row: any) => {
      task.taskId = row.id
      fail.row = row
      fail.title = row.name + "失败列表"
      fail.show = true
      fail.width = "1500px"
    }
    // 编辑弹窗功能
    const handleEdit = (row: object) => {
      layer.title = '编辑数据'
      layer.row = row
      layer.show = true
    }
    getTableData(true)
    return {
      Plus,
      Search,
      Delete,
      ExcelUpload,
      task,
      tableData,
      chooseData,
      loading,
      page,
      layer,
      account,
      fail,
      columns,
      data_table_list,
      handleSelectionChange,
      handleAdd,
      handleEdit,
      getTableData,
      handlecat,
      handlefail,
      handleclose
    }
  },
  methods: {
    getCellClass(row: any) {
      // 假设我们要根据 'status' 字段来判断
      // 请根据你的实际字段和逻辑调整
      // return row.status === '特定值' ?  : '';
      return 'red-background'
    },
    handleUploadSuccess(response: any) {
      // 在这里处理上传成功的响应数据
      console.log(1111111111111111);
      console.log(response);
      // 可以执行进一步的操作，如更新UI或调用其他API
    }
  }
})
</script>

<style lang="scss" scoped>
.red-background {
  // background-color: red;
  color: red;
}

.green-background {
  // background-color: red;
  color: green;
}
</style>
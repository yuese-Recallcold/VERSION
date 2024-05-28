<template>
<Layer :layer="layer" ref="layerDom">
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <ExcelUpload @upload-success="handleUploadSuccess":soversion="yourSoversionValue" />
        <el-popconfirm :title="$t('message.common.saveTip')" @confirm="handlesuccessadd(chooseData)">
          <template #reference>
            <el-button type="success" :icon="Delete" :disabled="chooseData.length === 0">{{
              $t('message.common.savelist') }}</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <div class="layout-container-table">
      <Table ref="table" v-model:page="page" v-loading="loading" :showIndex="true" :showSelection="true"
        :data="data_table_list" @getTableData="getTableData" @selection-change="handleSelectionChange">
        <el-table-column prop="is_true" label="验证是否通过" align="center" width="200" />
        <el-table-column prop="VIN" label="账号" align="center" width="200" />
        <el-table-column v-for="(column, index) in columns" :key="index" :prop="column.prop" width="200" align="center">
          <template #header="scope">
            <div :style="{ color: column.type === 'True' ? 'green' : 'burlywood' }">{{ column.label }}<br></div>
            <div v-for="(value, index) in column.value" :key="index">
              {{ value }}
            </div>
          </template>
          <template #default="scope">
            <div
              :class="{ 'green-background':String(column.value).includes(scope.row[column.prop]), 'red-background': !String(column.value).includes(scope.row[column.prop]) }">
              {{ scope.row[column.prop] }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('message.common.handle')" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button type="success" @click="handlesuccess(scope.row)">{{ $t('message.common.success') }}</el-button>
            <el-button type="danger" @click="handlefail(scope.row)">{{ $t('message.common.fail') }}</el-button>
          </template>
        </el-table-column>
      </Table>
    </div>
  </div>
</Layer>
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import Table from '@/components/table/index.vue'
import ExcelUpload from '@/components/excelUoload/index.vue'
import { Page } from '@/components/table/type'
import { getDataTwo } from '@/api/check'
import { ElMessage } from 'element-plus'
import Layer from '@/components/layer/index.vue'
import { getaccounts,updateaccounts_list} from '@/api/account'
import type { LayerInterface } from '@/components/layer/index.vue'
import { Plus, Search, Delete } from '@element-plus/icons'
export default defineComponent({
  name: 'Check',
  components: {
    Table,
    ExcelUpload,
    Layer
  },
  props: {
    layer: {
      type: Object,
      default: () => {
        return {
          show: false,
          title: '',
          showButton: false,
        }
      }
    },
  },
  setup(props) {
    let form = ref({
    username: [],
    applicant: '田世林',
    accounttext: '',
    // taskid:props.layer.row.id,
    soversion:''
  });
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
     const yourSoversionValue = props.layer.row.soversion
     const columns = ref([])
    //根据版本获取版本校验字段标题
    // params <init> Boolean ，默认为false，用于判断是否需要初始化分页
    const getTableData = (init: boolean) => {
      loading.value = true
      if (init) {
        page.index = 1
      }
      let params = {
        page: page.index,
        pageSize: page.size,
        soversion:props.layer.row.soversion
      }
      getDataTwo(params)
        .then(res => {
          columns.value =res.data.list
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
    let data_table_list = ref([{}])
    // 将上传成功的校验后的excel字段进行回显
    const handleUploadSuccess = (response: any) => {
      data_table_list.value = response
    }
    getTableData(true)
    return {
      Plus,
      Search,
      Delete,
      ExcelUpload,
      tableData,
      chooseData,
      loading,
      page,
      columns,
      data_table_list,
      form,
      yourSoversionValue,
      handleSelectionChange,
      getTableData,
      handleUploadSuccess,
      updateaccounts_list
    }
  },
  methods: {
    getCellClass(row: any) {
      // 假设我们要根据 'status' 字段来判断
      // 请根据你的实际字段和逻辑调整
      // return row.status === '特定值' ?  : '';
      return 'red-background'
    },
     handlesuccessadd (data: any[]) { 
        let params = []
        for (const number of data) {
          number.soversion=this.form.soversion
          number.state="升级成功"
          number.remarks="1次升级成功"
          params.push(number)
        }
        console.log(params);
        
        // updateaccounts_list(params)
        // .then(res => {
        //   ElMessage({
        //     type: 'success',
        //     message: '更改状态成功'
        //   })
        //   this.getTableData(this.tableData.values.length === 1 ? true : false);
        //   this.$emit('getTableData', false)
        // })
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
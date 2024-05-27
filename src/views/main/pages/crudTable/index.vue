<template>
  <div class="layout-container">
    <div class="layout-container-form flex space-between">
      <div class="layout-container-form-handle">
        <el-button type="primary" :icon="Plus" @click="handleAdd">{{ $t('message.common.add') }}</el-button>
      </div>
    </div>
    <div class="layout-container-table">
      <Table
        ref="table"
        v-model:page="page"
        v-loading="loading"
        :showIndex="true"
        :showSelection="false"
        :data="tableData"
        @getTableData="getTableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="name" label="任务名称" align="center"width="500"/>
        <!-- <el-table-column prop="source" label="来源" align="center" /> -->
        <el-table-column prop="project" label="项目" align="center" />
        <!-- <el-table-column prop="prversion" label="项目版本" align="center" />
        <el-table-column prop="soversion" label="软件版本" align="center" /> -->
        <!-- <el-table-column prop="pullreason" label="推送原因" align="center" /> -->
        <el-table-column prop="upgradingnum" label="升级中的数量" align="center" />
        <el-table-column prop="failnum" label="升级失败数量" align="center" />
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column prop="createtime" label="创建时间" align="center" />
        <el-table-column :label="$t('message.common.handle')" align="center" fixed="right" width="300">
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
import { Page } from '@/components/table/type'
import { getData, close } from '@/api/table'
import Layer from './layer.vue'
import Account from './account.vue'
import Fail from './fail.vue'
import { ElMessage } from 'element-plus'
import type { LayerInterface } from '@/components/layer/index.vue'
import { Plus, Search, Delete } from '@element-plus/icons'
export default defineComponent({
  name: 'crudTable',
  components: {
    Table,
    Layer,
    Account,
    Fail
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
        // if (Array.isArray(data)) {
        //   data.forEach(d => {
        //     const select = selectData.find(select => select.value === d.choose)
        //     select ? d.chooseName = select.label : d.chooseName = d.choose
        //     const radio = radioData.find(select => select.value === d.radio)
        //     radio ? d.radioName = radio.label : d.radio
        //   })
        // }
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
        id: data.map((e:any)=> {
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
    const handlecat =(row: any) => {
      account.row = row
      account.title = row.name +"升级中列表"
      account.show = true
      account.width= "1500px"
    }
    const handlefail =(row: any) => {
      task.taskId = row.id
      fail.row = row
      fail.title = row.name +"失败列表"
      fail.show = true
      fail.width= "1500px"
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
      task,
      tableData,
      chooseData,
      loading,
      page,
      layer,
      account,
      fail,
      handleSelectionChange,
      handleAdd,
      handleEdit,
      getTableData,
      handlecat,
      handlefail,
      handleclose
    }
  },
})
</script>

<style lang="scss" scoped>
  
</style>
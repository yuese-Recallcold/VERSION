<template>
  <Layer :layer="layer" ref="layerDom">
    <div class="layout-container">
      <div class="layout-container-table">
        <Table
          ref="table"
          v-model:page="page"
          v-loading="loading"
          :showIndex="true"
          :showSelection="true"
          :data="tableData"
          @getTableData="getTableData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="account" label="账号" align="center"/>
          <el-table-column prop="batch_num" label="批次" align="center" />
          <el-table-column prop="state" label="升级状态" align="center" />
          <el-table-column prop="applicant" label="申请人" align="center" />
          <el-table-column prop="executor" label="执行人" align="center" />
          <el-table-column prop="remarks" label="备注" align="center" />
          <el-table-column prop="create_time" label="创建时间" align="center" />
          <el-table-column :label="$t('message.common.handle')" align="center" fixed="right" width="200">
            <template #default="scope">
              <el-button type="success" @click="handlesuccess(scope.row)">{{ $t('message.common.success') }}</el-button>
              <el-button type="warning" @click="handlerevoke(scope.row)">{{ $t('message.common.revoke') }}</el-button>
            </template>
          </el-table-column>
        </Table>
        <Submitpage :layer="submitpage" @getTableData="getTableData" v-if="submitpage.show"></Submitpage>
      </div>
    </div>
    
  </Layer>
  
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, reactive } from 'vue'
  import Table from '@/components/table/index.vue'
  import { Page } from '@/components/table/type'
  import { accountadd ,getaccounts} from '@/api/account'
  import Layer from '@/components/layer/index.vue'
  import Submitpage from './submitpage.vue'
  import { ElMessage } from 'element-plus'
  import type { LayerInterface } from '@/components/layer/index.vue'
  import { Plus,  Delete } from '@element-plus/icons'


  export default defineComponent({
    name: 'Fail',
    
    components: {
      Table,
      Layer,
      Submitpage,
    }, 
    props: {
    tid: String,
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
    username: ['张三', '李四'],
    applicant: '张三',
    accounttext: '',
    taskid:props.tid,
  });

      // 存储搜索用的数据
      const query = reactive({
        input: ''
      })
      // 弹窗控制器
      const fail: LayerInterface = reactive({
        show: false,
        title: '新增',
        showButton: true,
        width: ""
      })
      const submitpage: LayerInterface = reactive({
      show: false,
      title: '状态备注提交',
      showButton: true
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
          task_id:props.tid,
          state: 0,
          ...query
        }
        getaccounts(params)
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
     
      const handlesuccess = (row: any) => {
        row.soversion=props.layer.row.soversion
        submitpage.title = '升级状态修改为成功'
        submitpage.row = row
        submitpage.show = true
        submitpage.state = "升级成功"
      }
      const handlerevoke = (row: any) => {
        row.soversion=props.layer.row.soversion
        submitpage.title = '升级状态修改为撤销'
        submitpage.row = row
        submitpage.show = true
        submitpage.state = "撤销升级"
      }
      getTableData(true)
      return {
        Plus,
        Delete,
        query,
        tableData,
        chooseData,
        loading,
        page,
        fail,
        submitpage,
        form,
        handleSelectionChange,
        handlesuccess,
        handlerevoke,

        getTableData,
      }
    },
    methods:{
      handleAdd() {
      // 使用this.form来访问组件的form数据

      let params = this.form;
      accountadd(params)
        .then(res => {
          ElMessage({
            type: 'success',
            message: '添加成功'
          });
          // 调用getTableData方法，可能需要this来访问
          this.getTableData(this.tableData.values.length === 1 ? true : false);
          this.$emit('getTableData', false)
        })
        .catch(error => {
          // 处理错误情况，例如显示错误消息
          ElMessage({
            type: 'error',
            message: '添加失败'
          });
        });
    },
    }

  })
  </script>
  
  <style lang="scss" scoped>
.custom-form {
  margin-right: 30px;
}
  </style>
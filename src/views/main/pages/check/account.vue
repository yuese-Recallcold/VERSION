<template>
  <Layer :layer="layer" ref="layerDom">
    <div class="layout-container">
      <div class="layout-container-form flex space-between">
        <div class="layout-container-form-handle">
          <el-form :model="form"  label-width="120px" class="custom-form">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="申请人" prop="applicant">
                  <el-select v-model="form.applicant" placeholder="请选择" clearable>
                    <el-option v-for="item in form.username" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="账号" prop="account">
                  <el-input
                    v-model="form.accounttext"
                    autosize
                    type="textarea"
                    placeholder="请输入账号"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          
          <el-button type="primary" :icon="Plus" @click="handleAdd">{{ $t('message.common.add') }}</el-button>
          <el-popconfirm :title="$t('message.common.saveTip')" @confirm="handlesuccessadd(chooseData)">
            <template #reference>
              <el-button type="success" :icon="Delete" :disabled="chooseData.length === 0">{{ $t('message.common.savelist') }}</el-button>
            </template>
          </el-popconfirm>
          <el-button
          type="primary"
          :icon="Download"
          :disabled="chooseData.length === 0"
          class="export-excel-btn"
          @click="handleExportExcel"
          >{{ $t('message.common.exportExcel') }}</el-button>
        </div>
      </div>
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
              <el-button type="danger" @click="handlefail(scope.row)">{{ $t('message.common.fail') }}</el-button>
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
  import { defineComponent, ref, reactive, version,unref } from 'vue'
  import Table from '@/components/table/index.vue'
  import { Page } from '@/components/table/type'
  import { accountadd ,getaccounts,updateaccounts_list} from '@/api/account'
  import Layer from '@/components/layer/index.vue'
  import Submitpage from './submitpage.vue'
  import { ElMessage } from 'element-plus'
  import type { LayerInterface } from '@/components/layer/index.vue'
  import { Plus,  Delete } from '@element-plus/icons'
  import { Download } from '@element-plus/icons'
  import { aoaToSheetXlsx } from './ExportExcel'
  import { useI18n } from 'vue-i18n'
  import {get_config} from '@/api/table'
  export default defineComponent({
    name: 'Account',
    
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
    username: [],
    applicant: '田世林',
    accounttext: '',
    taskid:props.layer.row.id,
    soversion:''
  });
  get_config() .then(res => {
      console.log(res.data);
      
       form.value.username=res.data.applicant
    })  
      form.value.soversion=props.layer.row.soversion
      // 弹窗控制器
      const account: LayerInterface = reactive({
        show: false,
        title: '新增',
        showButton: true,
        width: ""
      })
      const submitpage: LayerInterface = reactive({
      show: false,
      title: '新增',
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
          task_id:props.layer.row.id,
          state: 1,
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
      // 删除功能
      // const handleDel = (data: object[]) => { 
      //   let params = {
      //     ids: data.map((e:any)=> {
      //       return e.id
      //     }).join(',')
      //   }
      //   console.log(params);
        
      //   del(params)
      //   .then(res => {
      //     ElMessage({
      //       type: 'success',
      //       message: '删除成功'
      //     })
      //     getTableData(tableData.value.length === 1 ? true : false)
      //   })
      // }
      const handlesuccess = (row: any) => {
        row.soversion=props.layer.row.soversion
        submitpage.title = '升级状态修改为成功'
        submitpage.row = row
        submitpage.show = true
        submitpage.state = "升级成功"
      }
      const handlefail = (row: any) => {
        row.soversion=props.layer.row.soversion
        submitpage.title = '升级状态修改为失败'
        submitpage.row = row
        submitpage.show = true
        submitpage.state = "升级失败"
      }
      const handlerevoke = (row: any) => {
        row.soversion=props.layer.row.soversion
        row.task_id=props.layer.row.id
        submitpage.title = '升级状态修改为撤销'
        submitpage.row = row
        submitpage.show = true
        submitpage.state = "撤销升级"
      }
      //保存excel
      const { t } = useI18n()
      const gettime=()=>{
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const formattedTime = `_${hours}:${minutes}:${seconds}`;
        return formattedTime
      }
      const handleExportExcel = () => {
      let file_name_list = props.layer.row.name.split("_")
      let file_name =file_name_list[1]+file_name_list[2]+file_name_list[3]    
      if (!unref(file_name).trim()) {
        ElMessage({
          showClose: true,
          message: t('message.common.exportExcelTip'),
          type: 'warning',
        })
        return
      }
      let table = unref(chooseData)
      beginExportExcel(chooseData.value, file_name);
    }
    const beginExportExcel = (table: any[], fileName: string) => {
      let header = ['VIN',]
      let data = table.map((item) => {
        let {account} = item
        return [account]
      })   
      aoaToSheetXlsx({
        data,
        header,
        filename: `${unref(fileName)}.xlsx`,
      })
    }
      getTableData(true)
      return {
        Plus,
        Delete,
        Download,
        tableData,
        chooseData,
        loading,
        page,
        account,
        submitpage,
        form,
        t,
        handleSelectionChange,
        handlesuccess,
        handlefail,
        handlerevoke,
        // handleDel,
        getTableData,
        handleExportExcel,
        beginExportExcel
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
          //生成excel文件
          const accounts: string[] = this.form.accounttext.split('\n');
          // 映射数组中的每个 account 值到所需格式的对象
          const result = accounts.map(account => {
            return { account: account };
          });          
          
          let file_name_list = this.$props.layer.row.name.split("_")
          let file_name =file_name_list[1]+file_name_list[2]+file_name_list[3] +"第"+String(res.batch_num)+"批次文件" 
          this.beginExportExcel(result,file_name);
          this.form.accounttext=""
        })
        .catch(error => {
          // 处理错误情况，例如显示错误消息
          ElMessage({
            type: 'error',
            message: '添加失败'
          });
        });
    },
    //批量完成
     handlesuccessadd (data: any[]) { 
        let params = []
        for (const number of data) {
          number.soversion=this.form.soversion
          number.state="升级成功"
          number.remarks="1次升级成功"
          params.push(number)
        }
        updateaccounts_list(params)
        .then(res => {
          ElMessage({
            type: 'success',
            message: '更改状态成功'
          })
          this.getTableData(this.tableData.values.length === 1 ? true : false);
          this.$emit('getTableData', false)
        })
      }
    },
  })
  </script>
  
  <style lang="scss" scoped>
.custom-form {
  margin-right: 30px;
}
  </style>
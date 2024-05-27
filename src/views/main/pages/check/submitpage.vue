<template>
    <Layer :layer="layer" @confirm="submit" ref="layerDom">
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" style="margin-right:30px;">
        <el-form-item label="备注:" prop="remarks">
        <el-input v-model="form.remarks" placeholder="请输入备注"></el-input>
      </el-form-item>
      </el-form>
    </Layer>
  </template>
  
  <script lang="ts">
  import type { LayerType } from '@/components/layer/index.vue'
  import type { Ref } from 'vue'
  import type { ElFormItemContext } from 'element-plus/lib/el-form/src/token'
  import { defineComponent, ref } from 'vue'
  import { updateaccounts } from '@/api/account'
  import { taskData } from './enum'
  import Layer from '@/components/layer/index.vue'
  export default defineComponent({
    name:"submitpage",
    components: {
      Layer
    },
    props: {
      layer: {
        type: Object,
        default: () => {
          return {
            show: false,
            title: '',
            showButton: true
          }
        }
      },
    },
    setup(props, ctx) {
      const ruleForm: Ref<ElFormItemContext|null> = ref(null)
      // const submitpageDom: Ref<LayerType|null> = ref(null)
      const layerDom: Ref<LayerType|null> = ref(null)
      let form = ref({
        remarks: '',
        id:"",
        state:""
      })  
      init()
      function init() { // 用于判断新增还是编辑功能     
        if (props.layer.row) {
          form.value = JSON.parse(JSON.stringify(props.layer.row)) // 数量量少的直接使用这个转
          form.value.remarks=''
        } else {
  
        }
      }
      const rules = {
      remarks: [{ required: true, message: '请输入推送备注', trigger: 'blur' }],
    }
      return {
        form,
        // submitpageDom,
        layerDom,
        ruleForm,
        taskData,
        rules
      }
    },
    methods: {
      submit() {
        if (this.ruleForm) {
          this.ruleForm.validate((valid: any) => {
            if (valid) {
              let params = this.form
              if (this.layer.state) {
                params.state = this.layer.state              
                this.stateUpdate(params)
              } 
            } else {
              return false;
            }
          });
        }
      },
      // 成功提交事件
      stateUpdate(params: object) {
        updateaccounts(params)
        .then(res => {
          this.$message({
            type: 'success',
            message: '状态更新成功'
          })
          this.form.remarks=''
          this.$emit('getTableData', true)
          this.layerDom && this.layerDom.close()
        })
      },
    }
  })
  </script>
  
  <style lang="scss" scoped>
    
  </style>
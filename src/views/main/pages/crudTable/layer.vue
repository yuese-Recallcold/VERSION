<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" style="margin-right:30px;">
      <el-form-item label="来源" prop="source" >
			  <el-select v-model="form.source" placeholder="请选择" clearable  @change="generateName">
					<el-option v-for="item in taskData.source" :key="item" :label="item" :value="item"></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="项目" prop="project">
			  <el-select v-model="form.project" placeholder="请选择" clearable @change="handleChange">
					<el-option  
          v-for="(key, index) in Object.keys(taskData.project)"  
          :key="index"  
          :label="key"  
          :value="key"  
      ></el-option> 
				</el-select>
			</el-form-item>
      <el-form-item label="项目版本" prop="prversion" >
			  <el-select v-model="form.prversion" placeholder="请选择" clearable  @change="generateName">
					<el-option v-for="item in form.prversionlist" :key="item" :label="item" :value="item"></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="软件版本" prop="soversion">
			  <el-select v-model="form.soversion" placeholder="请选择" clearable  @change="generateName">
					<el-option v-for="item in taskData.soversion" :key="item" :label="item" :value="item"></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="网络" prop="network">
			  <el-select v-model="form.network" placeholder="请选择" clearable  @change="generateName">
					<el-option v-for="item in taskData.network" :key="item" :label="item" :value="item"></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="推送原因:" prop="pullreason">
        <el-input v-model="form.pullreason" placeholder="请输入原因"  @change="generateName"></el-input>
      </el-form-item>
      
      <el-form-item label="备注:" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="form.name" placeholder="任务名称"></el-input>
      </el-form-item>
      <el-form-item label="任务保存路径" prop="filepath">
        <el-input v-model="form.filepath" placeholder="保存路径"></el-input>
      </el-form-item>
      <!-- <el-form-item label="数字：" prop="number">
        <el-input v-model="form.number" oninput="value=value.replace(/[^\d]/g,'')" placeholder="只能输入正整数"></el-input>
      </el-form-item>
			<el-form-item label="选择器：" prop="select">
			  <el-select v-model="form.choose" placeholder="请选择" clearable>
					<el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="单选框：" prop="radio">
        <el-radio-group v-model="form.radio">
          <el-radio v-for="item in radioData" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item> -->
    </el-form>
  </Layer>
</template>

<script lang="ts">
import type { LayerType } from '@/components/layer/index.vue'
import type { Ref } from 'vue'
import type { ElFormItemContext } from 'element-plus/lib/el-form/src/token'
import { defineComponent, ref } from 'vue'
import { add, update } from '@/api/table'
import { taskData } from './enum'
import Layer from '@/components/layer/index.vue'
export default defineComponent({
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
    }
  },
  setup(props, ctx) {
    const ruleForm: Ref<ElFormItemContext|null> = ref(null)
    const layerDom: Ref<LayerType|null> = ref(null)
    let form = ref({
      name: '',
      source:'',
      project:'',
      prversion:'',
      prversionlist:[''],
      soversion:'',
      network:"5G",
      pullreason:'',
      remark:'',
      filepath:''
    })
    const rules = {
      pullreason: [{ required: true, message: '请输入推送原因', trigger: 'blur' }],
      name: [{ required: true, message: '请输请输入任务名称', trigger: 'blur' }],
      source: [{ required: true, message: '请选择来源', trigger: 'blur' }],
      radio: [{ required: true, message: '请选择', trigger: 'blur' }],
      project: [{ required: true, message: '请选择项目', trigger: 'blur' }],
      prversion: [{ required: true, message: '请选择项目版本', trigger: 'blur' }],
      soversion: [{ required: true, message: '请选择软件版本', trigger: 'blur' }],
      network: [{ required: true, message: '请选择网络', trigger: 'blur' }],
      filepath: [{ required: true, message: '请输入任务保存路径', trigger: 'blur' }],
    }
    init()
    function init() { // 用于判断新增还是编辑功能
      if (props.layer.row) {
        form.value = JSON.parse(JSON.stringify(props.layer.row)) // 数量量少的直接使用这个转
      } else {

      }
    }
    return {
      form,
      rules,
      layerDom,
      ruleForm,
      taskData
    }
  },
  methods: {
    submit() {
      if (this.ruleForm) {
        this.ruleForm.validate((valid: any) => {
          if (valid) {
            let params = this.form
            if (this.layer.row) {
              this.updateForm(params)
            } else {
              this.addForm(params)
            }
          } else {
            return false;
          }
        });
      }
    },
    // 新增提交事件
    addForm(params: object) {
      add(params)
      .then(res => {
        this.$message({
          type: 'success',
          message: '新增成功'
        })
        this.$emit('getTableData', true)
        this.layerDom && this.layerDom.close()
      })
    },
    // 编辑提交事件
    updateForm(params: object) {
      update(params)
      .then(res => {
        this.$message({
          type: 'success',
          message: '编辑成功'
        })
        this.$emit('getTableData', false)
        this.layerDom && this.layerDom.close()
      })
    },
    // 根据所选车型更新其版本
    handleChange() {  
      // 当项目选择变化时，更新版本列表  
      let value = this.form.project
      this.form.prversionlist= (this.taskData.project as {[key: string]: string[]})[this.form.project] || []
      this.generateName()
    },  
    //自动生成任务名称
    generateName() {  
      // 根据选中的项目生成名称的逻辑  
      // 这里只是一个简单的示例，你可以根据需要自定义生成逻辑  
      this.form.name=this.form.source+'_'+this.form.project+'_'+this.form.prversion+"_"+this.form.network+"_"+this.form.soversion+'_'+this.form.pullreason+"_"+this.form.remark
      // ... 其他项目的生成逻辑  
    },
    
  }
})
</script>

<style lang="scss" scoped>
  
</style>
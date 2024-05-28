<template>
  <Layer :layer="layer" @confirm="submit" ref="layerDom">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" style="margin-right:30px;">
      <el-form-item label="控制器名称：" prop="label">
        <el-input v-model="form.label" placeholder="请输入控制器名称："></el-input>
      </el-form-item>
      <el-form-item label="控制器版本：" prop="value">
        <el-input v-model="form.value" placeholder="请输入控制器版本（如果有多个请以,分隔）：" style="width: 100%" />
      </el-form-item>
      <el-form-item label="是否可选" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :label="'True'">必选</el-radio>
          <el-radio :label="'False'">可选</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </Layer>
</template>

<script lang="ts">
import type { LayerType } from '@/components/layer/index.vue'
import type { Ref } from 'vue'
import type { ElFormItemContext } from 'element-plus/lib/el-form/src/token'
import { defineComponent, ref } from 'vue'
import { add, update} from '@/api/check'
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
    const ruleForm: Ref<ElFormItemContext | null> = ref(null)
    const layerDom: Ref<LayerType | null> = ref(null)
    let form = ref({
      id:'',
      soversion_id: '',
      label: '',
      prop: '',
      type: 'True',
      value: '',
    })
    form.value.soversion_id = props.layer.config_id
    const rules = {
      label: [{ required: true, message: '请输入控制器名称', trigger: 'blur' }],
      value: [{ required: true, message: '请输入控制器版本', trigger: 'blur' }],
    }
    init()
    function init() { // 用于判断新增还是编辑功能
      if (props.layer.row) {
        form.value = JSON.parse(JSON.stringify(props.layer.row)) // 数量量少的直接使用这个转
        console.log(form.value);
        
      } else {
      }
    }
    return {
      form,
      rules,
      layerDom,
      ruleForm,
    }
  },
  methods: {
    submit() {
      if (this.ruleForm) {
        this.ruleForm.validate((valid: any) => {
          if (valid) {
            this.form.prop=this.form.label
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
    }
  }
})
</script>

<style lang="scss" scoped></style>
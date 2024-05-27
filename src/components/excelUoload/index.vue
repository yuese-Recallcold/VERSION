<template>
  <el-upload
    class="upload-demo"
    action="/api/upload" 
    :on-preview="handlePreview"
    :before-upload="handleBeforeUpload"
    :limit="1"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
  >
    <el-button type="primary">上传excel文件</el-button>
    <template #tip>
      <div class="el-upload__tip">
        请上传车辆excel信息表 (.xlsx, .xls)。
      </div>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage, ElMessageBox, ElUpload } from 'element-plus';

const fileList = ref([]);

const handlePreview = (file: any) => {
  console.log(file);
};

const handleExceed = (files: string | any[], fileList: any) => {
  ElMessage.warning(`只能上传1个文件,当前选择了 ${files.length} 个文件`);
};

const handleBeforeUpload = (file: { name: string; }) => {
  // 检查文件是否为Excel格式
  const isExcel = /(\.xlsx|\.xls)$/.test(file.name.toLowerCase());
  if (!isExcel) {
    ElMessage.error('只能上传Excel文件！');
  }
  return isExcel; // 返回false将取消上传
};
const handleSuccess = (response: any) => {
if (response.code === 200) {
  ElMessage.success('文件上传成功');
  // 使用 defineEmits 定义的事件触发上传成功的响应
  emit('upload-success', response.data);
} else {
  ElMessage.error('文件上传失败');
}
};

// 使用 defineEmits 定义事件
const emit = defineEmits(['upload-success']);
</script>
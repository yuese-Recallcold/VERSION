<template>
  <el-upload
    class="upload-demo"
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
import { ElMessage, ElUpload } from 'element-plus';
import axios from 'axios';  // 导入axios
import type { AxiosInstance } from 'axios';  // 导入类型定义

// 创建axios实例
const http = ref<AxiosInstance>(axios.create());

const fileList = ref([]);

const handlePreview = (file: any) => {
  console.log(file);
};
const props = defineProps({
  soversion: String, // 从父组件接收soversion
});
const handleExceed = (files: string | any[], fileList: any) => {
  ElMessage.warning(`只能上传1个文件,当前选择了 ${files.length} 个文件`);
};

const handleBeforeUpload = async (file: { name: string; }) => {
  // 检查文件是否为Excel格式
  const isExcel = /(\.xlsx|\.xls)$/.test(file.name.toLowerCase());
  if (!isExcel) {
    ElMessage.error('只能上传Excel文件！');
    return false; // 返回false将取消上传
  }

  try {
    // 准备FormData
    const formData = new FormData();
    formData.append('file', file);
    // 可以在这里添加其他参数
    formData.append('soversion', props.soversion);

    // 使用axios上传文件并携带参数
    const response = await (http.value.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }));

    // 处理响应
    if (response.status === 200) {
      ElMessage.success('文件上传成功');
      // 触发自定义事件 upload-success，并携带额外参数
      emit('upload-success', response.data);
    } else {
      ElMessage.error('文件上传失败');
    }
  } catch (error) {
    ElMessage.error('文件上传异常');
    console.error('上传文件时发生错误:', error);
    return false; // 返回false将取消上传
  }
};

const handleSuccess = (response: any, file: any, fileList: any) => {
  // 处理上传成功的逻辑
};

// 使用 defineEmits 定义事件
const emit = defineEmits(['upload-success']);
</script>
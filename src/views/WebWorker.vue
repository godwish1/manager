  <template>
    <div>
      <div class="excel-container">
        <h2>数据导出</h2>
        <button @click="exportExcel" class="export-btn">导出10万条数据</button>
        <p v-if="loading">正在生成数据，请稍候...</p>
        <p v-else-if="success">导出成功！</p>
      </div>
      <div class="excel-container">
          <textarea name="textarea1" cols="30" rows="5"></textarea>
          <button @click="handleSubmit" class="export-btn">Submit</button>
      </div>
    </div>
  </template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);
const success = ref(false);

// 创建Web Worker
let worker = new Worker('http://localhost:8080/excel.js');

// 监听来自Web Worker的消息
worker.onmessage = (event) => {
  try {
    // 接收处理好的Excel数据
    const { type, data } = event.data;
    
    if (type === 'COMPLETE') {
      // 创建下载链接
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.xlsx';
      a.click();
      URL.revokeObjectURL(url);
      
      loading.value = false;
      success.value = true;

    } else if (type === 'ERROR') {
      throw new Error(data);
    }
  } catch (error) {
    console.error('导出失败:', error);
    loading.value = false;
    alert('导出失败，请重试');
  }
};

// 点击导出
function exportExcel() {
  try {
    loading.value = true;
    success.value = false;
    
    // 向Web Worker发送消息，开始处理数据
    worker.postMessage({ action: 'GENERATE_EXCEL' });
  } catch (error) {
    console.error('导出失败:', error);
    loading.value = false;
    alert('导出失败，请重试');
  }
}

// 提交表单
const handleSubmit = () => {
  const textarea = document.querySelector('textarea');
  const text = textarea.value;
  
  // 在这里处理表单数据，例如发送到服务器进行保存
  console.log('表单数据：', text);
  
  alert('表单已提交！');
};


</script>

<style scoped lang="scss">
.excel-container {
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .export-btn {
    width: 10vw;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 10px;
    
    &:hover {
      background-color: #0056b3;
    }
  }
  
  p {
    margin: 10px 0;
    color: #666;
  }
}
.textarea-container {
    text-align: center;
    margin-top: 20px;
}
</style>
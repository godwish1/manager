// 引入xlsx库
importScripts('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');

// 监听来自主线程的消息
self.onmessage = function(event) {
  const { action } = event.data;
  
  if (action === 'GENERATE_EXCEL') {
    try {
      // 生成测试数据
      const data = generateTestData();
      
      // 转换为Excel格式
      const sheet = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, 'Sheet1');
      
      // 导出为二进制数据
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      
      // 发送回主线程
      self.postMessage({
        type: 'COMPLETE',
        data: wbout
      });
    } catch (error) {
      self.postMessage({
        type: 'ERROR',
        data: error.message
      });
    }
  }
};

// 生成十万条测试数据
function generateTestData() {
  const arr = [];
  for (let i = 0; i < 100000; i++) {
    arr.push({
      id: i + 1,
      name: `大伟${i}`,
      age: i % 100,
      sex: i % 2 === 0 ? '男' : '女',
      address: `北京市${i}`,
      phone: `1380013800${i % 10}` + Math.floor(Math.random() * 100000000),
      email: `user${i}@example.com`,
      createTime: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)).toLocaleString(),
      updateTime: new Date().toLocaleString(),
      status: i % 2 === 0 ? '启用' : '禁用',
      remark: `备注${i}`,
      score: Math.floor(Math.random() * 100),
      salary: Math.floor(Math.random() * 10000) + 3000
    });
  }
  return arr;
}
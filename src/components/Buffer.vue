<template>
    <div class="buffer-container">
      <div class="controls">
        <label>
          选择GeoJSON文件:
          <input type="file" @change="handleFileUpload" accept=".geojson" />
        </label>
        <label>
          缓冲区半径 (米):
          <input type="number" v-model="bufferRadius" min="1" />
        </label>
        <button @click="startAnalysis" :disabled="!geojsonData">开始分析</button>
      </div>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import * as Cesium from 'cesium'
  import { createBuffer } from '../function/Buffer.js'
  
  const props = {
    viewer: Object
  }
  
  const geojsonData = ref(null)
  const bufferRadius = ref(100) // 默认缓冲区半径为 100 米
  const errorMessage = ref('')
  
  // 处理文件上传
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          geojsonData.value = JSON.parse(e.target.result)
          zoomToGeoJSON(geojsonData.value)
          errorMessage.value = ''
        } catch (err) {
          errorMessage.value = '无效的GeoJSON文件'
        }
      }
      reader.readAsText(file)
    }
  }
  
  // 缩放到GeoJSON范围
  const zoomToGeoJSON = (geojson) => {
    if (props.viewer && props.viewer.entities) {
      props.viewer.entities.removeAll()
      Cesium.GeoJsonDataSource.load(geojson).then((dataSource) => {
        props.viewer.dataSources.add(dataSource)
        props.viewer.zoomTo(dataSource)
      })
    }
  }
  
  // 开始缓冲区分析
  const startAnalysis = () => {
    if (!geojsonData.value || !bufferRadius.value) {
      errorMessage.value = '请确保已选择GeoJSON文件并输入有效的缓冲区半径'
      return
    }
  
    const bufferedGeoJSON = createBuffer(geojsonData.value, bufferRadius.value)
    if (bufferedGeoJSON) {
      // 显示缓冲区
      if (props.viewer && props.viewer.entities) {
        props.viewer.entities.removeAll()
        Cesium.GeoJsonDataSource.load(bufferedGeoJSON).then((dataSource) => {
          props.viewer.dataSources.add(dataSource)
          props.viewer.zoomTo(dataSource)
        })
      }
      errorMessage.value = ''
    } else {
      errorMessage.value = '缓冲区生成失败，请检查输入数据'
    }
  }
  </script>
  
  <style scoped>
  .buffer-container {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(255, 255, 255, 0.9);
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }
  
  .controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  label {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  button {
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .error {
    color: red;
    font-size: 12px;
    margin-top: 10px;
  }
  </style>
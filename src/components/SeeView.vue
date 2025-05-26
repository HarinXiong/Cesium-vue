<template>
    <div class="seeview-panel">
      <button @click="startPickPoints">创建起点和终点</button>
      <button @click="doSeeView" :disabled="points.length < 2">通视分析</button>
      <div v-if="points.length">
        <div>起点: {{ points[0] ? formatPoint(points[0]) : '未选择' }}</div>
        <div>终点: {{ points[1] ? formatPoint(points[1]) : '未选择' }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import useSeeView from '../function/SeeView.js'
  
  const props = defineProps({ viewer: Object })
  const points = ref([])
  
  const { pickPoints, doSeeViewAnalysis } = useSeeView(props.viewer, points)
  
  const startPickPoints = () => {
    pickPoints()
  }
  
  const doSeeView = () => {
    doSeeViewAnalysis()
  }
  
  const formatPoint = (p) => p ? `${p.lng.toFixed(6)}, ${p.lat.toFixed(6)}, ${p.height.toFixed(2)}` : ''
  </script>
  
  <style scoped>
  .seeview-panel {
    position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  gap: 10px;
  background: #222;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}
  button {
    margin-right: 10px;
    margin-bottom: 8px;
  }
  </style>
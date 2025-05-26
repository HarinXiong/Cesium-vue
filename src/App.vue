<script setup>
import * as Cesium from 'cesium'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import LoadMap from './components/loadMap.vue'
import SwitchView from './components/switchView.vue'
import LoadData from './components/loadData.vue'
import GetXYZ from './components/GetXYZ.vue'
import RenderAndAnnotate from './components/renderAndAnnotate.vue'
import DistanceRoad from './components/showDistanceRoad.vue'
import Visibility from './components/Visibility.vue'
import Buffer from './components/Buffer.vue'
import SeeView from './components/SeeView.vue'

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNGJhZmY1Mi01Yzg4LTRhN2EtYWYyNC1hNGQ2NzgxZmQxZDIiLCJpZCI6MjkzMDgzLCJpYXQiOjE3NDQ2MjgxMjl9.MBrZ9Dyc8UdhNTTjlx2va0Y_kkfILeTD1I1fAiylcEk';

const viewer = ref(null)
const ballRef = ref(null)
const showLoadMap = ref(false)
const showSwitchView = ref(false)
const showLoadData = ref(false)
const showGetXYZ = ref(false)
const showRenderAndAnnotate = ref(false)
const showDistanceRoad = ref(false)
const showVisibility = ref(false)
const showBuffer = ref(false)
const showSeeView = ref(false)


onMounted(() => {
  viewer.value = new Cesium.Viewer("cesiumContainer", {
    infoBox: false,
    timeline: false,
  });

  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (e) => {
  if (menuVisible.value && ballRef.value && !ballRef.value.contains(e.target)) {
    menuVisible.value = false
  }
}

// 菜单控制
const menuVisible = ref(false)
const toggleMenu = () => {
  menuVisible.value = !menuVisible.value
}

// 拖拽球逻辑 (不修改)
const ballPos = ref({ x: 100, y: 100 })
let isDragging = false
let offset = { x: 0, y: 0 }

const startDrag = (e) => {
  if (menuVisible.value) return

  isDragging = true
  offset = {
    x: e.clientX - ballPos.value.x,
    y: e.clientY - ballPos.value.y,
  }
  window.addEventListener('mousemove', drag)
  window.addEventListener('mouseup', stopDrag)
}

const drag = (e) => {
  if (!isDragging) return
  ballPos.value = {
    x: e.clientX - offset.x,
    y: e.clientY - offset.y,
  }
}

const stopDrag = () => {
  isDragging = false
  window.removeEventListener('mousemove', drag)
  window.removeEventListener('mouseup', stopDrag)
}

// 加载地形数据
const toggleLoadMap = async () => {
  showLoadMap.value = !showLoadMap.value
  if (showLoadMap.value && viewer.value) {
    const terrain = await Cesium.createWorldTerrainAsync()
    viewer.value.terrainProvider = terrain
  }
}

// 切换视角
const toggleSwitchView = () => {
  showSwitchView.value = !showSwitchView.value
}

const toggleLoadData = () => {
  showLoadData.value = !showLoadData.value
}


const toggleGetXYZ = () => {
  showGetXYZ.value = !showGetXYZ.value
}
const toggleRenderAndAnnotate = () => {
  showRenderAndAnnotate.value = !showRenderAndAnnotate.value
}

const toggleDistanceRoad = () => {
  showDistanceRoad.value = !showDistanceRoad.value
}

const toggleVisibility = () => {
  showVisibility.value = !showVisibility.value
}
const toggleBuffer = () => {
  showBuffer.value = !showBuffer.value
}

const toggleSeeView = () => {
  showSeeView.value = !showSeeView.value
}

</script>

<template>
  <div id="cesiumContainer"></div>
  <!-- 球形菜单容器 / 展开后为面板 -->
  <div class="floating-ball" ref="ballRef" :class="{ 'menu-open': menuVisible }" @mousedown="startDrag"
    @mouseup="stopDrag" @mousemove="drag" @click="toggleMenu"
    :style="{ left: ballPos.x + 'px', top: ballPos.y + 'px' }">
    <template v-if="menuVisible">
      <button class="menu-button" @click.stop="toggleLoadMap">加载地形数据</button>
      <button class="menu-button" @click.stop="toggleSwitchView">视角切换</button>
      <button class="menu-button" @click.stop="toggleLoadData">加载数据</button>
      <button class="menu-button" @click.stop="toggleGetXYZ">获取经纬度</button>
      <button class="menu-button" @click.stop="toggleRenderAndAnnotate">分色渲染+注记</button>
      <button class="menu-button" @click.stop="toggleDistanceRoad">路径规划分析</button>
      <button class="menu-button" @click.stop="toggleSeeView">通视分析</button>
      <button class="menu-button" @click.stop="toggleVisibility">可视域分析</button>
      <button class="menu-button" @click.stop="toggleBuffer">缓冲区分析</button>
    </template>
    <template v-else>
      菜单
    </template>
  </div>
  <LoadMap v-if="showLoadMap" :viewer="viewer" />
  <SwitchView v-if="showSwitchView" :viewer="viewer" />
  <LoadData v-if="showLoadData" :viewer="viewer" />
  <GetXYZ v-if="showGetXYZ" :viewer="viewer" />
  <RenderAndAnnotate v-if="showRenderAndAnnotate" :viewer="viewer" />
  <DistanceRoad v-if="showDistanceRoad" :viewer="viewer" />
  <SeeView v-if="showSeeView" :viewer="viewer" />
  <Visibility v-if="showVisibility" :viewer="viewer" />
  <Buffer v-if="showBuffer" :viewer="viewer" />
</template>

<style scoped>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 初始球体样式 */
.floating-ball {
  width: 60px;
  height: 60px;
  background: radial-gradient(circle at 30% 30%, #1e1e1e, #3a3a3a);
  border-radius: 50%;
  position: absolute;
  z-index: 10;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: bold;
  font-size: 14px;
}

/* 展开后变为菜单容器 */
.floating-ball.menu-open {
  width: 220px;
  height: auto;
  border-radius: 12px;
  padding: 16px 12px;
  background: #222;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
}

/* 菜单按钮样式 */
.menu-button {
  background: #444;
  color: #f0f0f0;
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.menu-button:hover {
  background: #666;
}
</style>

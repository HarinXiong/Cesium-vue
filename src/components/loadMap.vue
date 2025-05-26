<template>
  <div class="basemap-controls">
    <button class="menu-button" @click="handleArcGIS">影像底图</button>
    <button class="menu-button" @click="handleTianditu">天地图</button>
    <button class="menu-button" @click="handleCesium">Cesium原图</button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { switchToArcGIS, switchToTianditu, switchToCesium } from '../function/loadMap.js'

const props = defineProps({
  viewer: Object
})

const handleArcGIS = async () => {
  if (props.viewer) {
    await switchToArcGIS(props.viewer)
  }
}

const handleTianditu = async () => {
  if (props.viewer) {
    await switchToTianditu(props.viewer)
  }
}

const handleCesium = async () => {
  if (props.viewer) {
    await switchToCesium(props.viewer)
  }
}
</script>

<style scoped>
.basemap-controls {
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

.menu-button {
  background: #444;
  color: #f0f0f0;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.menu-button:hover {
  background: #666;
}
</style>
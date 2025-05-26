<template>
    <div class="data-controls">
        <button class="menu-button" @click="loadGeoJSON">加载 GeoJSON 文件</button>
        <button class="menu-button" @click="loadGLTF">加载 glTF 文件</button>
        <button class="menu-button" @click="load3DTiles">加载 3D Tiles 数据</button>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { loadGeoJSONFile, loadGLTFFile, load3DTilesFile } from '../function/loadData.js'

const props = defineProps({
    viewer: Object
})

// 调用外部方法
const loadGeoJSON = async () => {
    if (props.viewer) {
        await loadGeoJSONFile(props.viewer)
    } else {
        console.error('Viewer is not initialized')
    }
}

const loadGLTF = async () => {
    if (props.viewer) {
        await loadGLTFFile(props.viewer)
    } else {
        console.error('Viewer is not initialized')
    }
}

const load3DTiles = async () => {
    if (props.viewer) {
        await load3DTilesFile(props.viewer)
    } else {
        console.error('Viewer is not initialized')
    }
}
</script>

<style scoped>
.data-controls {
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
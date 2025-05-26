<template>
    <div class="xyz-controls">
        <button class="menu-button" @click="startGettingCoordinates">获取笛卡尔坐标</button>
        <button class="menu-button" @click="stopGettingCoordinates">结束获取</button>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { startGetCoordinates, stopGetCoordinates } from '../function/GetXYZ.js'

const props = defineProps({
    viewer: Object
})

const startGettingCoordinates = () => {
    if (props.viewer) {
        startGetCoordinates(props.viewer)
    } else {
        console.error('Viewer is not initialized')
    }
}

const stopGettingCoordinates = () => {
    stopGetCoordinates()
}
</script>

<style scoped>
.xyz-controls {
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
<template>
    <div class="view-controls">
        <button class="menu-button" @click="setTopView">俯视</button>
        <button class="menu-button" @click="setFrontView">平视</button>
        <button class="menu-button" @click="setObliqueView">斜视</button>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import * as Cesium from 'cesium'

const props = defineProps({
    viewer: Object
})

// 中国地质大学武汉未来城校区的经纬度和高度
const longitude = 114.405; // 经度
const latitude = 30.513; // 纬度
const height = 500; // 高度（单位：米）

const setTopView = () => {
    if (props.viewer) {
        const camera = props.viewer.camera
        camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height), // 定位到校区
            orientation: {
                heading: 0,
                pitch: -Cesium.Math.PI_OVER_TWO, // 俯视
                roll: 0
            }
        })
    }
}

const setFrontView = () => {
    if (props.viewer) {
        const camera = props.viewer.camera
        camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height), // 定位到校区
            orientation: {
                heading: 0,
                pitch: 0, // 平视
                roll: 0
            }
        })
    }
}

const setObliqueView = () => {
    if (props.viewer) {
        const camera = props.viewer.camera
        camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height), // 定位到校区
            orientation: {
                heading: Cesium.Math.toRadians(45), // 朝向 45 度
                pitch: -Cesium.Math.PI_OVER_FOUR, // 斜视
                roll: 0
            }
        })
    }
}
</script>

<style scoped>
.view-controls {
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
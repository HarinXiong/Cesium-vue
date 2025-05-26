<template>
    <div class="render-controls">
        <button class="menu-button" @click="loadGeoJSON">加载 GeoJSON</button>
        <button class="menu-button" @click="applyLayerColors" :disabled="!geoJsonDataSource">分层设色</button>
        <button class="menu-button" @click="toggleAnnotations" :disabled="!geoJsonDataSource">注记</button>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { loadGeoJSONFile, setLayerColors, toggleLayerAnnotations } from '../function/renderAndAnnotate.js'

const props = defineProps({
    viewer: Object
})

const geoJsonDataSource = ref(null)

const loadGeoJSON = async () => {
    if (props.viewer) {
        try {
            geoJsonDataSource.value = await loadGeoJSONFile(props.viewer)
            if (!geoJsonDataSource.value) {
                console.error('Failed to load GeoJSON data')
            }
        } catch (error) {
            console.error('Error loading GeoJSON:', error)
        }
    } else {
        console.error('Viewer is not initialized')
    }
}

const applyLayerColors = () => {
    if (geoJsonDataSource.value) {
        setLayerColors(geoJsonDataSource.value)
    } else {
        console.error('No GeoJSON data loaded')
    }
}

const toggleAnnotations = () => {
    if (geoJsonDataSource.value) {
        toggleLayerAnnotations(geoJsonDataSource.value, props.viewer)
    } else {
        console.error('No GeoJSON data loaded')
    }
}
</script>

<style scoped>
.render-controls {
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
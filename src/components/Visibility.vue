<template>
    <div class="visibility-controls">
        <button class="menu-button" @click="selectPoints">选取起点和终点</button>
        <button class="menu-button" @click="performAnalysis" :disabled="!startPoint || !endPoint">执行可视域分析</button>
    </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue'
import { initVisibility, selectPoint, analyzeVisibility } from '../function/Visibility.js'

const props = defineProps({
    viewer: Object
})

const startPoint = ref(null)
const endPoint = ref(null)

onMounted(() => {
    if (props.viewer) {
        initVisibility(props.viewer)
    } else {
        console.error('Viewer is not initialized')
    }
})

const selectPoints = async () => {
    try {
        const points = await selectPoint(props.viewer)
        startPoint.value = points.start
        endPoint.value = points.end
        console.log('起点:', startPoint.value, '终点:', endPoint.value)
    } catch (error) {
        console.error('Error selecting points:', error)
    }
}

const performAnalysis = () => {
    if (startPoint.value && endPoint.value) {
        analyzeVisibility(props.viewer, startPoint.value, endPoint.value)
    } else {
        console.error('起点或终点未选取')
    }
}
</script>

<style scoped>
.visibility-controls {
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
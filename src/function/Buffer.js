import * as turf from '@turf/turf'

/**
 * 创建缓冲区
 * @param {Object} geojson GeoJSON 数据
 * @param {number} radius 缓冲区半径（米）
 * @returns {Object} 缓冲区的 GeoJSON 数据
 */
export function createBuffer(geojson, radius) {
    try {
        const buffered = turf.buffer(geojson, radius, { units: 'meters' })
        return buffered
    } catch (error) {
        console.error('缓冲区生成失败:', error)
        return null
    }
}
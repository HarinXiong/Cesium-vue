import * as Cesium from 'cesium'

const longitude = 114.405 // 经度
const latitude = 30.513 // 纬度
const height = 500 // 高度（单位：米）

// 俯视视角
export const setTopView = (viewer) => {
    if (!viewer) {
        console.error('Viewer is not initialized')
        return
    }
    const camera = viewer.camera
    camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
        orientation: {
            heading: 0,
            pitch: -Cesium.Math.PI_OVER_TWO, // 俯视
            roll: 0
        }
    })
}

// 平视视角
export const setFrontView = (viewer) => {
    if (!viewer) {
        console.error('Viewer is not initialized')
        return
    }
    const camera = viewer.camera
    camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
        orientation: {
            heading: 0,
            pitch: 0, // 平视
            roll: 0
        }
    })
}

// 斜视视角
export const setObliqueView = (viewer) => {
    if (!viewer) {
        console.error('Viewer is not initialized')
        return
    }
    const camera = viewer.camera
    camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
        orientation: {
            heading: Cesium.Math.toRadians(45), // 朝向 45 度
            pitch: -Cesium.Math.PI_OVER_FOUR, // 斜视
            roll: 0
        }
    })
}
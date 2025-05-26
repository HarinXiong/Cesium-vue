import * as Cesium from 'cesium'

let handler = null

// 初始化可视域分析
export const initVisibility = (viewer) => {
    if (!viewer) {
        console.error('Viewer is not initialized')
        return
    }
    handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    console.log('可视域分析初始化完成')
}

// 选取起点和终点
export const selectPoint = (viewer) => {
    return new Promise((resolve) => {
        const points = { start: null, end: null }
        let clickCount = 0

        handler.setInputAction((movement) => {
            const cartesian = viewer.scene.pickPosition(movement.position)
            if (cartesian) {
                const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
                const longitude = Cesium.Math.toDegrees(cartographic.longitude)
                const latitude = Cesium.Math.toDegrees(cartographic.latitude)
                const height = cartographic.height

                if (clickCount === 0) {
                    points.start = [longitude, latitude, height]
                    console.log('起点选取:', points.start)
                    viewer.entities.add({
                        position: cartesian,
                        point: {
                            pixelSize: 10,
                            color: Cesium.Color.RED,
                        },
                        label: {
                            text: '起点',
                            font: '14px sans-serif',
                            fillColor: Cesium.Color.WHITE,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            outlineWidth: 2,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -20),
                        },
                    })
                    clickCount++
                } else if (clickCount === 1) {
                    points.end = [longitude, latitude, height]
                    console.log('终点选取:', points.end)
                    viewer.entities.add({
                        position: cartesian,
                        point: {
                            pixelSize: 10,
                            color: Cesium.Color.BLUE,
                        },
                        label: {
                            text: '终点',
                            font: '14px sans-serif',
                            fillColor: Cesium.Color.WHITE,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            outlineWidth: 2,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -20),
                        },
                    })
                    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
                    resolve(points)
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    })
}

// 执行可视域分析
export const analyzeVisibility = (viewer, start, end) => {
    const startCartesian = Cesium.Cartesian3.fromDegrees(start[0], start[1], start[2])
    const endCartesian = Cesium.Cartesian3.fromDegrees(end[0], end[1], end[2])

    const ray = new Cesium.Ray(startCartesian, Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(endCartesian, startCartesian, new Cesium.Cartesian3()), new Cesium.Cartesian3()))
    const intersection = viewer.scene.pickFromRay(ray)

    if (intersection) {
        console.log('可视域分析结果: 不可见')
        viewer.entities.add({
            polyline: {
                positions: [startCartesian, intersection.position],
                width: 5,
                material: Cesium.Color.RED,
            },
        })
    } else {
        console.log('可视域分析结果: 可见')
        viewer.entities.add({
            polyline: {
                positions: [startCartesian, endCartesian],
                width: 5,
                material: Cesium.Color.GREEN,
            },
        })
    }
}
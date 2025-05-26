import * as Cesium from 'cesium'

let amap = null
let startPoint = null
let endPoint = null
let routePolyline = null // 用于存储路线的 Polyline

// 初始化高德地图
export const initAMap = (viewer) => {
    amap = new AMap.Map('cesiumContainer', {
        resizeEnable: true,
        zoom: 14,
        center: [114.27, 30.59] // 默认中心点
    })
    console.log('高德地图初始化完成')
}

// 选取起点和终点
export const selectPoint = () => {
    return new Promise((resolve) => {
        let clickCount = 0
        amap.on('click', (e) => {
            if (clickCount === 0) {
                startPoint = [e.lnglat.getLng(), e.lnglat.getLat()]
                console.log('起点选取:', startPoint)
                // 在地图上标记起点
                new AMap.Marker({
                    position: startPoint,
                    map: amap,
                    content: '<div style="color: red; font-size: 14px;">起点</div>'
                })
                clickCount++
            } else if (clickCount === 1) {
                endPoint = [e.lnglat.getLng(), e.lnglat.getLat()]
                console.log('终点选取:', endPoint)
                // 在地图上标记终点
                new AMap.Marker({
                    position: endPoint,
                    map: amap,
                    content: '<div style="color: red; font-size: 14px;">终点</div>'
                })
                amap.off('click') // 移除点击事件
                resolve({ start: startPoint, end: endPoint })
            }
        })
    })
}

// 调用高德 REST API 进行路径规划
export const calculateRoute = (start, end, callback) => {
    const wgs2gcj = (lng, lat) => {
        // WGS84 转 GCJ02 的简单实现
        return [lng, lat]
    }

    const startP = wgs2gcj(start[0], start[1])
    const endP = wgs2gcj(end[0], end[1])

    const url = `https://restapi.amap.com/v3/direction/driving?key=50cbe78fefe4409c092b077a12a97d85&origin=${startP[0]},${startP[1]}&destination=${endP[0]},${endP[1]}&extensions=all&output=json&callback=routeCallback`

    // 动态创建 script 标签
    const script = document.createElement('script')
    script.src = url
    script.async = true
    window.routeCallback = (json) => {
        if (json && json.route && json.route.paths) {
            const paths = json.route.paths
            console.log('路径规划成功:', paths)

            // 绘制路线
            if (paths.length > 0) {
                const steps = paths[0].steps
                const routeCoordinates = steps.flatMap((step) =>
                    step.polyline.split(';').map((point) => {
                        const [lng, lat] = point.split(',').map(Number)
                        return [lng, lat]
                    })
                )

                // 如果之前有路线，先移除
                if (routePolyline) {
                    amap.remove(routePolyline)
                }

                // 在地图上绘制路线
                routePolyline = new AMap.Polyline({
                    path: routeCoordinates,
                    strokeColor: '#FF0000', // 红色
                    strokeWeight: 4, // 线宽
                    map: amap
                })
            }

            if (typeof callback === 'function') {
                callback(paths)
            }
        } else {
            console.error('路径规划失败:', json)
            if (typeof callback === 'function') {
                callback(null)
            }
        }
        document.body.removeChild(script) // 移除 script 标签
    }
    script.onerror = () => {
        console.error('请求失败')
        if (typeof callback === 'function') {
            callback(null)
        }
        document.body.removeChild(script) // 移除 script 标签
    }
    document.body.appendChild(script)
}
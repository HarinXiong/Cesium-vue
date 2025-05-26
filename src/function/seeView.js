import * as Cesium from 'cesium'

export default function useSeeView(viewer, pointsRef) {
    let handler = null

    function pickPoints() {
        pointsRef.value = []
        if (!viewer.value) return
        if (handler) handler.destroy()
        handler = new Cesium.ScreenSpaceEventHandler(viewer.value.scene.canvas)
        handler.setInputAction((click) => {
            const pos = click.position
            const cartesian = viewer.value.scene.pickPosition(pos)
            if (cartesian) {
                const carto = Cesium.Cartographic.fromCartesian(cartesian)
                const lng = Cesium.Math.toDegrees(carto.longitude)
                const lat = Cesium.Math.toDegrees(carto.latitude)
                const height = carto.height
                pointsRef.value.push({ lng, lat, height })
                if (pointsRef.value.length === 2) {
                    handler.destroy()
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }

    function doSeeViewAnalysis() {
        if (pointsRef.value.length < 2 || !viewer.value) return
        const [start, end] = pointsRef.value
        viewer.value.entities.removeAll()
        viewer.value.entities.add({
            position: Cesium.Cartesian3.fromDegrees(start.lng, start.lat, start.height),
            point: { pixelSize: 10, color: Cesium.Color.GREEN }
        })
        viewer.value.entities.add({
            position: Cesium.Cartesian3.fromDegrees(end.lng, end.lat, end.height),
            point: { pixelSize: 10, color: Cesium.Color.RED }
        })
        viewer.value.entities.add({
            polyline: {
                positions: [
                    Cesium.Cartesian3.fromDegrees(start.lng, start.lat, start.height),
                    Cesium.Cartesian3.fromDegrees(end.lng, end.lat, end.height)
                ],
                width: 4,
                material: Cesium.Color.YELLOW
            }
        })
        // 这里只是简单分析，实际可视性判断可根据需要补充
        alert('已绘制通视线')
    }

    return { pickPoints, doSeeViewAnalysis }
}
import * as Cesium from 'cesium'

// ArcGIS 世界影像底图
export async function switchToArcGIS(viewer) {
    if (!viewer) return

    const imageryProvider = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
    )

    viewer.imageryLayers.removeAll()
    viewer.imageryLayers.addImageryProvider(imageryProvider)
    await imageryProvider.readyPromise
    viewer.scene.requestRender()
}

// 天地图路网图层
export async function switchToTianditu(viewer) {
    if (!viewer) return

    const imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
        url: 'https://t{s}.tianditu.gov.cn/vec_w/wmts?tk=217d26344bfba0d2622bc441104dd16d',
        layer: 'vec',
        style: 'default',
        tileMatrixSetID: 'w',
        format: 'tiles',
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        tilingScheme: new Cesium.GeographicTilingScheme(),
        maximumLevel: 18,
        credit: '天地图 © 国家测绘局'
    })

    viewer.imageryLayers.removeAll()
    viewer.imageryLayers.addImageryProvider(imageryProvider)
    await imageryProvider.readyPromise
    viewer.scene.requestRender()
}

// Cesium 原始底图（OpenStreetMap）
// Cesium 默认影像图（Bing Aerial imagery via Cesium Ion）
export async function switchToCesium(viewer) {
    if (!viewer) return

    const imageryProvider = await Cesium.createWorldImageryAsync()

    viewer.imageryLayers.removeAll()
    viewer.imageryLayers.addImageryProvider(imageryProvider)

    await imageryProvider.readyPromise
    viewer.scene.requestRender()
}

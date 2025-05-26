import * as Cesium from 'cesium'

let annotationEntities = [] // 用于存储注记实体

// 加载 GeoJSON 文件
export const loadGeoJSONFile = async (viewer) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.geojson,.json'
    return new Promise((resolve, reject) => {
        fileInput.onchange = async (event) => {
            const file = event.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = async () => {
                    try {
                        const geoJsonData = JSON.parse(reader.result)
                        const dataSource = await Cesium.GeoJsonDataSource.load(geoJsonData)
                        viewer.dataSources.add(dataSource)
                        viewer.flyTo(dataSource)
                        resolve(dataSource)
                    } catch (error) {
                        console.error('Error loading GeoJSON:', error)
                        reject(error)
                    }
                }
                reader.readAsText(file)
            } else {
                reject('No file selected')
            }
        }
        fileInput.click()
    })
}

// 分层设色
export const setLayerColors = (dataSource) => {
    const entities = dataSource.entities.values

    entities.forEach((entity) => {
        const color = entity.properties.color?.getValue() || Cesium.Color.WHITE
        if (entity.polygon) {
            entity.polygon.material = Cesium.Color.fromCssColorString(color).withAlpha(0.6)
        } else if (entity.polyline) {
            entity.polyline.material = new Cesium.ColorMaterialProperty(Cesium.Color.fromCssColorString(color))
        } else if (entity.point) {
            entity.point.color = Cesium.Color.fromCssColorString(color)
        }
    })
}

// 添加或移除注记
export const toggleLayerAnnotations = (dataSource, viewer) => {
    if (annotationEntities.length > 0) {
        // 如果注记已存在，则移除注记
        annotationEntities.forEach((entity) => {
            viewer.entities.remove(entity)
        })
        annotationEntities = [] // 清空注记数组
    } else {
        // 添加注记
        const entities = dataSource.entities.values
        entities.forEach((entity) => {
            let position = entity.position
            if (!position && entity.polygon) {
                // 如果是 Polygon 类型，计算多边形的中心点
                const polygonHierarchy = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now())
                const positions = polygonHierarchy.positions
                position = Cesium.BoundingSphere.fromPoints(positions).center
                position = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(position)
            }

            if (position) {
                const labelText = entity.properties.label?.getValue() || '未命名'
                const labelColor = entity.properties.color?.getValue() || '#FFFFFF'

                const label = viewer.entities.add({
                    position: position,
                    label: {
                        text: labelText,
                        font: '14px sans-serif',
                        fillColor: Cesium.Color.fromCssColorString(labelColor), // 根据 GeoJSON 的 color 字段设置颜色
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 2,
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -10)
                    }
                })
                annotationEntities.push(label) // 将注记实体存储到数组中
            }
        })
    }
}
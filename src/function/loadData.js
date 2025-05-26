import * as Cesium from 'cesium'

// 加载 GeoJSON 文件
export const loadGeoJSONFile = async (viewer) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.geojson,.json'
    fileInput.onchange = async (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                const geoJsonData = JSON.parse(reader.result)
                const dataSource = Cesium.GeoJsonDataSource.load(geoJsonData)
                viewer.dataSources.add(dataSource).then((ds) => {
                    viewer.flyTo(ds)
                })
            }
            reader.readAsText(file)
        }
    }
    fileInput.click()
}

// 加载 glTF 文件
export const loadGLTFFile = async (viewer) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.gltf,.glb'
    fileInput.onchange = async (event) => {
        const file = event.target.files[0]
        if (file) {
            const url = URL.createObjectURL(file)
            const entity = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(114.405, 30.513, 0), // 示例位置
                model: {
                    uri: url
                }
            })
            viewer.flyTo(entity)
        }
    }
    fileInput.click()
}

// 加载 3D Tiles 数据
export const load3DTilesFile = async (viewer) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.json'
    fileInput.onchange = async (event) => {
        const file = event.target.files[0]
        if (file) {
            const url = URL.createObjectURL(file)
            const tileset = new Cesium.Cesium3DTileset({ url })
            viewer.scene.primitives.add(tileset)
            tileset.readyPromise.then(() => {
                viewer.flyTo(tileset)
            })
        }
    }
    fileInput.click()
}
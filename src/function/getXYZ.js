import * as Cesium from 'cesium'

let handler = null
let tooltipElement = null

// 创建提示框
const createTooltip = () => {
  tooltipElement = document.createElement('div')
  tooltipElement.style.position = 'absolute'
  tooltipElement.style.background = '#fff'
  tooltipElement.style.color = '#000'
  tooltipElement.style.padding = '5px 10px'
  tooltipElement.style.border = '1px solid #ccc'
  tooltipElement.style.borderRadius = '4px'
  tooltipElement.style.fontSize = '12px'
  tooltipElement.style.pointerEvents = 'none'
  tooltipElement.style.zIndex = '1000'
  tooltipElement.style.display = 'none'
  document.body.appendChild(tooltipElement)
}

// 显示提示框
const showTooltip = (text, x, y) => {
  if (!tooltipElement) return
  tooltipElement.textContent = text
  tooltipElement.style.left = `${x + 10}px` // 鼠标右侧偏移 10px
  tooltipElement.style.top = `${y + 10}px` // 鼠标下方偏移 10px
  tooltipElement.style.display = 'block'
}

// 隐藏提示框
const hideTooltip = () => {
  if (tooltipElement) {
    tooltipElement.style.display = 'none'
  }
}

// 开始获取经纬度
export const startGetCoordinates = (viewer) => {
  if (!viewer) {
    console.error('Viewer is not initialized')
    return
  }

  if (!tooltipElement) {
    createTooltip()
  }

  handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

  handler.setInputAction((movement) => {
    const cartesian = viewer.scene.pickPosition(movement.endPosition)
    if (cartesian) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      const x = cartesian.x.toFixed(2)
      const y = cartesian.y.toFixed(2)
      const z = cartesian.z.toFixed(2)
      const screenPos = movement.endPosition
      showTooltip(`X: ${x}, Y: ${y}, Z: ${z}`, screenPos.x, screenPos.y)
    } else {
      hideTooltip()
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}

// 停止获取经纬度
export const stopGetCoordinates = () => {
  if (handler) {
    handler.destroy()
    handler = null
  }
  hideTooltip()
}
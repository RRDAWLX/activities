/**
 * 可手动任意转动的地球
 */
import * as THREE from 'three'

const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(50))

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 0
camera.position.y = 0
let distance = 50
camera.position.z = distance
camera.lookAt(scene.position)

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(new THREE.Color(0x111111))
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new THREE.TextureLoader().load('./Earth.png', function (texture) {
  let radius = 10
  let sphereGeometry = new THREE.SphereGeometry(radius, 40, 40)
  let sphereMaterial = new THREE.MeshBasicMaterial({ map: texture })
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  // sphere.add(new THREE.AxesHelper(20))
  sphere.rotateZ(- Math.PI / 6) // 倾斜 30°
  scene.add(sphere)

  const zAxis = new THREE.Vector3(0, 0, 1)
  let rotateAxis = new THREE.Vector3(0, 1, 0)
    .applyAxisAngle(zAxis, - Math.PI / 6)
  let rotating = true

  updates.push(() => {
    if (rotating) {
      sphere.rotateOnWorldAxis(rotateAxis, Math.PI * 0.01)
    }
  })

  let point = { x: 0, y: 0 }
  let stopRotation = (x, y) => {
    rotating = false
    point.x = x
    point.y = y
  }
  let rotateAndUpdate = (x, y) => {
    let deltaX = x - point.x
    let deltaY = point.y - y // 网页计算位置的 y 轴跟绘图空间相反
    rotateAxis = rotateAxis.set(deltaX, deltaY, 0)
      .applyAxisAngle(zAxis, Math.PI / 2)
      .normalize() // 一定要转换为单位向量，否则物体在旋转过程中会变形
    // 弧长公式：弧长 = 弧度 * 半径
    // 将移动距离视为弧长，并等比例缩小，然后求弧度
    let angle = (deltaX ** 2 + deltaY ** 2) ** 0.5 * (radius / distance) / radius
    sphere.rotateOnWorldAxis(rotateAxis, angle)
    point.x = x
    point.y = y
  }
  let restartRotation = () => {
    rotating = true
  }

  // 移动端事件处理
  renderer.domElement.addEventListener('touchstart', (e) => {
    let touch = e.changedTouches[0]
    stopRotation(touch.clientX, touch.clientY)
  })
  renderer.domElement.addEventListener('touchmove', (e) => {
    e.preventDefault()
    let touch = e.changedTouches[0]
    rotateAndUpdate(touch.clientX, touch.clientY)
  })
  renderer.domElement.addEventListener('touchend', restartRotation)
  renderer.domElement.addEventListener('touchcancel', restartRotation)

  // PC 端事件处理
  renderer.domElement.addEventListener('mousedown', (e) => {
    stopRotation(e.clientX, e.clientY)
    let handleMove = (e) => {
      rotateAndUpdate(e.clientX, e.clientY)
    }
    renderer.domElement.addEventListener('mousemove', handleMove)
    renderer.domElement.addEventListener('mouseup', () => {
      renderer.domElement.removeEventListener('mousemove', handleMove)
      restartRotation()
    }, { once: true })
  })
})

const updates = []
function animate() {
  for (let update of updates) {
    update()
  }

  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

animate()

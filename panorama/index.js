/**
 * 全景照片
 */
import * as THREE from 'three'

let scene
let camera
let renderer

function init() {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 0

  renderer = new THREE.WebGLRenderer()
  // renderer.setClearColor(new THREE.Color(0x111111))
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  let textureCube = new THREE.CubeTextureLoader()
    .setPath('./').
    load([
      './posx.jpg',
      './negx.jpg',
      './posy.jpg',
      './negy.jpg',
      './posz.jpg',
      './negz.jpg',
    ])

  let shader = THREE.ShaderLib.cube
  shader.uniforms.tCube.value = textureCube

  let material = new THREE.ShaderMaterial({
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false, // 2d 渲染就行
    side: THREE.BackSide, // 只渲染一面就行
  })

  let panoramaCube = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), material)
  scene.add(panoramaCube)

  render()
}

let a = 0  // 空间中点P在Oxz屏幕上的射影Q，迎着y轴看时，OQ按逆时针方向旋转与z轴正向的夹角。
let b = Math.PI / 2  // OP与y轴正向的夹角，定义域为 [0, π]。
function render() {
  // sin(b) 是单位向量在 Oxz 平面上投影的长度
  camera.lookAt(new THREE.Vector3(Math.sin(b) * Math.sin(a), Math.cos(b), Math.sin(b) * Math.cos(a)))
  renderer.render(scene, camera)
  requestAnimationFrame(render)
}

let preX
let preY
function startDragging(x, y) {
  preX = x
  preY = y
}

let factor = Math.PI / 180 / 200
function drag(x, y) {
  let deltaX = x - preX
  let deltaY = y - preY
  a += deltaX * factor
  b -= deltaY * factor

  // camera 沿着水平轴旋转超过 90° 或 -90° 后画面会发生上下颠倒，不符合需求，所以让其视线永远无法平行于 y 轴。
  if (b <= 0) {
    b = 1e-10
  } else if (b >= Math.PI) {
    b = Math.PI - 1e-10
  }
}

window.addEventListener('touchstart', e => {
  startDragging(e.touches[0].clientX, e.touches[0].clientY)
})

window.addEventListener('touchmove', e => {
  drag(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
})

/*window.addEventListener('touchend', e => {
  console.log(`(${a / Math.PI * 180}, ${b / Math.PI * 180}), (${Math.sin(b) * Math.sin(a)}, ${Math.cos(b)}, ${Math.sin(b) * Math.cos(a)})`)
})*/

window.addEventListener('mousedown', e => {
  startDragging(e.clientX, e.clientY)
  let cb = e => {
    drag(e.clientX, e.clientY)
  }
  window.addEventListener('mousemove', cb)
  window.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', cb)
  }, { once: true })
})

init()

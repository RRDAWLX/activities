/**
 * 公转并自转的地球
 */
import * as THREE from 'three'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(50))

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 200
camera.position.y = 50
camera.position.z = 200
camera.lookAt(scene.position)

const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(new THREE.Color(0x111111))
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new THREE.TextureLoader().load('./Earth.png', function (texture) {
  let sphereGeometry = new THREE.SphereGeometry(10, 40, 40)
  let sphereMaterial = new THREE.MeshBasicMaterial({ map: texture })
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.x = 50
  sphere.add(new THREE.AxesHelper(20))
  sphere.rotateZ(- Math.PI / 6) // 倾斜 30°
  scene.add(sphere)
  let yAxis = new THREE.Vector3(0, 1, 0)
  let rotateAxis = new THREE.Vector3(0, 1, 0)//.normalize()
  updates.push(() => {
    sphere.position.applyAxisAngle(yAxis, Math.PI * 0.01)
    sphere.rotateOnAxis(rotateAxis, Math.PI * 0.02)
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

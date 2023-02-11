/**
 * 公转并自转的地球
 */
import * as THREE from 'three'
import { OrbitControls } from 'orbit-controls'

const dev = false

class Sphere {
  #sphere
  #initPosition
  #revolutionAxis
  #revolutionPeriod
  #rotationAxis = new THREE.Vector3(0, 1, 0)
  #rotationPeriod
  #inclination
  #children = []

  /**
   * @param {object} param
   * @param {THREE.Material} param.MaterialType
   * @param {THREE.Texture} param.texture
   * @param {number} param.radius
   * @param {THREE.Vector3} param.position
   * @param {number} param.revolutionPeriod 公转周期，单位 s
   * @param {THREE.Vector3} param.revolutionAxis
   * @param {number} param.rotationPeriod 自转周期，单位 s
   * @param {number} param.inclination 倾斜角，单位 度
   */
  constructor({
    texture,
    MaterialType = THREE.MeshBasicMaterial,
    radius,
    position,
    revolutionPeriod = 0,
    revolutionAxis = new THREE.Vector3(0, 1, 0),
    rotationPeriod = 0,
    inclination = 0,
  }) {
    let sphereGeometry = new THREE.SphereGeometry(radius, 40, 40)
    let sphereMaterial = new MaterialType({ map: texture })
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

    if (dev) {
      sphere.add(new THREE.AxesHelper(20))
    }

    this.#sphere = sphere
    this.#initPosition = position
    this.#revolutionPeriod = revolutionPeriod
    this.#revolutionAxis = revolutionAxis.normalize()
    this.#rotationPeriod = rotationPeriod
    this.#inclination = inclination / 180 * Math.PI
  }

  /**
   * @param {number} elipsedTime 自动画开始的总消失时间
   */
  update(elipsedTime) {
    let sphere = this.#sphere

    if (this.#revolutionPeriod) {
      let revolutionRadian = (elipsedTime / this.#revolutionPeriod) % 1 * 2 * Math.PI
      sphere.position.copy(this.#initPosition)
      sphere.position.applyAxisAngle(this.#revolutionAxis, revolutionRadian)
    }

    if (this.#rotationPeriod) {
      let rotationRadian = (elipsedTime / this.#rotationPeriod) % 1 * 2 * Math.PI
      sphere.rotation.set(0, 0, this.#inclination)
      sphere.rotateOnAxis(this.#rotationAxis, rotationRadian)
    }

    for (let child of this.#children) {
      child.update(elipsedTime)
    }
  }

  add(sphere) {
    this.#children.push(sphere)
    sphere.addTo(this.#sphere)
  }

  addTo(object3d) {
    object3d.add(this.#sphere)
  }
}

function createSphere({ textureUrl, ...rest }) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      textureUrl,
      function(texture) {
        resolve(new Sphere({
          texture,
          ...rest,
        }))
      },
      undefined,
      function(err) {
        reject(err)
      }
    )
  })
}

const scene = new THREE.Scene()

if (dev) {
  scene.add(new THREE.AxesHelper(300))
  scene.add(new THREE.GridHelper(200))
}

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 200
camera.position.y = 50
camera.position.z = 200
camera.lookAt(scene.position)

const renderer = new THREE.WebGLRenderer()
// renderer.setClearColor(new THREE.Color(0x111111))
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const orbitControls = new OrbitControls(camera, renderer.domElement)

async function init() {
  let moon = createSphere({
    textureUrl: './moon.jpg',
    MaterialType: THREE.MeshPhysicalMaterial,
    radius: 3,
    position: new THREE.Vector3(25, 0, 0),
    revolutionPeriod: 5,
    rotationPeriod: 5,
    inclination: 1.5,
  })
  let earth = createSphere({
    textureUrl: './Earth.png',
    MaterialType: THREE.MeshPhysicalMaterial,
    radius: 10,
    position: new THREE.Vector3(100, 0, 0),
    revolutionPeriod: 20,
    rotationPeriod: 5,
    inclination: -30,
  })
  let sun = createSphere({
    textureUrl: './sun.webp',
    radius: 30,
    rotationPeriod: 10
  })

  moon = await moon
  earth = await earth
  sun = await sun

  earth.add(moon)
  sun.add(earth)
  sun.addTo(scene)
  updates.push((elipsedTime) => {
    sun.update(elipsedTime)
  })
}

scene.add(new THREE.PointLight())

const updates = []
const clock = new THREE.Clock()
function animate() {
  let elipsedTime = clock.getElapsedTime()

  for (let update of updates) {
    update(elipsedTime)
  }

  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

init().then(animate)

/**
 * 公转并自转的地球
 */
import * as THREE from 'three'
import { OrbitControls } from 'orbit-controls'

const dev = false

class Sphere {
  #sphere
  #revolutionAxis
  #revolutionPeriod
  #rotateAxis = new THREE.Vector3(0, 1, 0)
  #rotationPeriod
  #children = []

  constructor({
    radius,
    texture,
    revolutionPeriod = 0, // 公转周期，单位 s
    revolutionRadius = 0,
    revolutionAxis = new THREE.Vector3(0, 1, 0),
    rotationPeriod = 0, // 自转周期，单位 s
    inclination = 0, // 倾斜角，单位 度
  }) {
    let sphereGeometry = new THREE.SphereGeometry(radius, 40, 40)
    let sphereMaterial = new THREE.MeshBasicMaterial({ map: texture })
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.position.x = revolutionRadius

    if (inclination) {
      sphere.rotateZ(inclination / 180 * Math.PI) // 倾斜 30°
    }

    if (dev) {
      sphere.add(new THREE.AxesHelper(20))
    }

    this.#sphere = sphere
    this.#revolutionPeriod = revolutionPeriod
    this.#revolutionAxis = revolutionAxis
    this.#rotationPeriod = rotationPeriod
  }

  /**
   * @param {number} deltaTime 自动画开始的总消失时间
   */
  update(deltaTime) {
    if (this.#revolutionPeriod) {
      let revolutionRadian = deltaTime / this.#revolutionPeriod * 2 * Math.PI
      this.#sphere.position.applyAxisAngle(this.#revolutionAxis, revolutionRadian)
    }

    if (this.#rotationPeriod) {
      let rotationRadian = deltaTime / this.#rotationPeriod * 2 * Math.PI
      this.#sphere.rotateOnAxis(this.#rotateAxis, rotationRadian)
    }

    for (let child of this.#children) {
      child.update(deltaTime)
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
renderer.setClearColor(new THREE.Color(0x111111))
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const orbitControls = new OrbitControls(camera, renderer.domElement)

async function init() {
  let moon = createSphere({
    radius: 3,
    textureUrl: './moon.jpg',
    revolutionPeriod: 5,
    revolutionRadius: 25,
    rotationPeriod: 5,
    inclination: 1.5,
  })
  let earth = createSphere({
    radius: 10,
    textureUrl: './Earth.png',
    revolutionPeriod: 20,
    revolutionRadius: 100,
    rotationPeriod: 5,
    inclination: -30,
  })
  let sun = createSphere({
    radius: 30,
    textureUrl: './sun.webp',
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

const updates = []
const clock = new THREE.Clock()
function animate() {
  let deltaTime = clock.getDelta()

  for (let update of updates) {
    update(deltaTime)
  }

  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)
}

init().then(animate)

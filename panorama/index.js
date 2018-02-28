/**
 * 全景照片
 */

let scene, camera, renderer,
    gamma = 0,
    initAlpha, initBeta, initGamma,
    deltaAphpa = 0,
    deltaBeta = 0,
    deltaGamma = 0,
    touchBeta = 0,
    touchGamma = 0;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x111111));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let textureCube = new THREE.CubeTextureLoader()
      .setPath('./').
      load([
        './posx.jpg',
        './negx.jpg',
        './posy.jpg',
        './negy.jpg',
        './posz.jpg',
        './negz.jpg',
      ]);

    let shader = THREE.ShaderLib.cube;
    shader.uniforms.tCube.value = textureCube;

    let material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    let panoramaCube = new THREE.Mesh(new THREE.BoxGeometry(1000, 1000, 1000), material);
    scene.add(panoramaCube);

    render();
}

function createCubeMap() {
  let urls = [
    './posx.jpg',
    './negx.jpg',
    './posy.jpg',
    './negy.jpg',
    './posz.jpg',
    './negz.jpg',
  ];
  return THREE.ImageUtils.loadTextureCube(urls);
}

function render() {
  let now = Date.now() / 1000 / 60 * Math.PI * 2;
  camera.lookAt(new THREE.Vector3(Math.sin(now), 0, Math.cos(now)))
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

/*window.addEventListener('deviceorientation', e => {
    if (initAlpha === undefined) {
        initAlpha = e.alpha;
        initBeta = e.beta;
        initGamma = e.gamma;
    }
    deltaAlpha = -(e.alpha - initAlpha) / 180 * Math.PI;
    deltaBeta = (e.beta - initBeta) / 180 * Math.PI;
    deltaGamma = (e.gamma - initGamma) / 180 * Math.PI * 2;
});*/

// devicemotion事件对象的相关属性还未理解清楚
/*var t = Date.now();
var p = document.querySelector('p');
window.addEventListener('devicemotion', e => {
    if (Date.now() - t > 1000) {
        t = Date.now();
        p.innerHTML = `${e.acceleration.x}<br/>${e.acceleration.y}<br/>${e.acceleration.z}`;
    }
});*/

/*let startX, startY;
window.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});
window.addEventListener('touchmove', e => {
    let deltaX = e.changedTouches[0].clientX - startX,
        deltaY = e.changedTouches[0].clientY - startY;
    touchBeta += deltaY / 1440;
    touchGamma += deltaX / 1440;
});*/

init();

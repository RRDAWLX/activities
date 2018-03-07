/**
 * 全景照片
 * 测试发现 camera 中旋转相关的方法都无效
 */

let scene, camera, renderer,
    a = 0,  // 空间中点P在Oxz屏幕上的射影Q，迎着y轴看时，OQ按逆时针方向旋转与z轴正向的夹角。
    b = Math.PI / 2;  // OQ与y轴正向的夹角，定义域为 [0, π]。

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;

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
  camera.lookAt(new THREE.Vector3(Math.sin(b) * Math.sin(a), Math.cos(b), Math.sin(b) * Math.cos(a)));
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

let startX, startY, preA, preB;
window.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    preA = a;
    preB = b;
});

let factor = Math.PI / 180 / 10;
window.addEventListener('touchmove', e => {
    let deltaX = e.changedTouches[0].clientX - startX,
        deltaY = e.changedTouches[0].clientY - startY;
    a = preA + deltaX * factor;
    let tempB = preB - deltaY * factor;
    // 当 camera 的视线平行于 y 轴时，需对其姿态做调整，但目前看来无法调整其姿态，所以让其视线永远无法平行于 y 轴。
    if (tempB <= 0) {
      b = 1e-10;
    } else if (tempB >= Math.PI) {
      b = Math.PI - 1e-10;
    } else {
      b = tempB;
    }
});

/*window.addEventListener('touchend', e => {
  console.log(`(${a / Math.PI * 180}, ${b / Math.PI * 180}), (${Math.sin(b) * Math.sin(a)}, ${Math.cos(b)}, ${Math.sin(b) * Math.cos(a)})`)
});*/

init();

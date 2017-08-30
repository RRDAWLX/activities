/**
 * 地球固定，照相机转动。
 */

let scene, camera, renderer, axes,
    sphere, sphereGeometry, sphereMaterial, texture,
    gamma = Math.PI / 2,
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
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x111111));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // axes = new THREE.AxisHelper(20);
    // scene.add(axes);
    new THREE.TextureLoader().load('./Earth.png', function(texture){
        sphereGeometry = new THREE.SphereGeometry(10, 40, 40);
        sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
        sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);
        animate();
    });
}

function animate() {
    gamma -= 0.01;
    camera.position.x = 50 * Math.cos(gamma);
    camera.position.z = 50 * Math.sin(gamma);
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

window.addEventListener('deviceorientation', e => {
    if (initAlpha === undefined) {
        initAlpha = e.alpha;
        initBeta = e.beta;
        initGamma = e.gamma;
    }
    deltaAlpha = -(e.alpha - initAlpha) / 180 * Math.PI;
    deltaBeta = (e.beta - initBeta) / 180 * Math.PI;
    deltaGamma = (e.gamma - initGamma) / 180 * Math.PI * 2;
});

let startX, startY;
window.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});
window.addEventListener('touchmove', e => {
    let deltaX = e.changedTouches[0].clientX - startX,
        deltaY = e.changedTouches[0].clientY - startY;
    touchBeta += deltaY / 1440;
    touchGamma += deltaX / 1440;
});

init();

let scene, camera, renderer, axes,
    sphere, sphereGeometry, sphereMaterial, texture,
    cube, cubeGeometry, cubeMaterial,
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
    camera.position.z = 50;
    camera.lookAt(scene.position);

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

    /*cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true
    });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);*/
}

function animate() {
    gamma += 0.01;
    // cube.rotation.x = deltaBeta + touchBeta;
    // cube.rotation.y = deltaGamma + touchGamma;
    // cube.rotation.z = deltaAlpha;
    sphere.rotation.x = deltaBeta + touchBeta;
    sphere.rotation.y = gamma + deltaGamma + touchGamma;
    // sphere.rotation.z = deltaAlpha;
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

// devicemotion事件对象的相关属性还未理解清楚
/*var t = Date.now();
var p = document.querySelector('p');
window.addEventListener('devicemotion', e => {
    if (Date.now() - t > 1000) {
        t = Date.now();
        p.innerHTML = `${e.acceleration.x}<br/>${e.acceleration.y}<br/>${e.acceleration.z}`;
    }
});*/

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

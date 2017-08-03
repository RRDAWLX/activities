// alert(window.DeviceOrientationEvent ? true : false);

let msg = document.querySelector('#msg');
window.addEventListener('deviceorientation', e => {
    console.log(e);
    msg.innerHTML = `
    alpha: ${e.alpha.toFixed(2)}<br/>
    beta: ${e.beta.toFixed(2)}<br/>
    gamma: ${e.gamma.toFixed(2)}<br/>
    absolute: ${e.absolute}<br/>`;
    // alpha: ${e.alpha.toFixed(2)}<br/>
    // beta: ${e.beta.toFixed(2)}<br/>
    // gamma: ${e.gamma.toFixed(2)}<br/>
}, false);

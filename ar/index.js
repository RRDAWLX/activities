/*// 只可获取前置摄像头
// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {

        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
    };
}

navigator.mediaDevices.getUserMedia({
        video: true
    })
    .then(function(stream) {
        var video = document.querySelector('video');
        // Older browsers may not have srcObject
        if ("srcObject" in video) {
            video.srcObject = stream;
        } else {
            // Avoid using this in new browsers, as it is going away.
            video.src = window.URL.createObjectURL(stream);
        }
        video.onloadedmetadata = function(e) {
            video.play();
        };
    })
    .catch(function(err) {
        alert(err.name + ": " + err.message);
    });*/



// qq浏览器内核可获取后置摄像头
function getMedia() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    var exArray = [];
    if (navigator.getUserMedia && MediaStreamTrack.getSources) {
        MediaStreamTrack.getSources(function(sourceInfos) {
            for (var i = 0; i != sourceInfos.length; ++i) {
                var sourceInfo = sourceInfos[i];
                if (sourceInfo.kind === "video") {
                    exArray.push(sourceInfo.id);
                }
            }
            navigator.getUserMedia({
                "video": {
                    "optional": [{
                        "sourceId": exArray[1]
                    }]
                },
                "audio": false
            }, successFunc, errorFunc);
        });
    }
}

function successFunc(stream) {
    var video = document.querySelector('video');
    if (video.mozSrcObject !== undefined) {
        video.mozSrcObject = stream;
    } else {
        video.src = window.URL && window.URL.createObjectURL(stream) || stream;
    }
    video.play();
}

function errorFunc(e) {
    alert("Error！" + e);
}
getMedia();

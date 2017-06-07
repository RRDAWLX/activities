class ScratchCard {
    constructor(parentSelector) {
        this.scratchMobile = this.scratchMobile.bind(this);
        this.scratchPc = this.scratchPc.bind(this);
        this.check = this.check.bind(this);
        this.clear = this.clear.bind(this);
        this.getImageData = this.getImageData.bind(this);

        this.parent = document.querySelector(parentSelector);
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.width = this.canvas.width = this.parent.clientWidth;
        this.height = this.canvas.height = this.parent.clientHeight;

        let style = this.canvas.style;
        style.backgroundRepeat = 'no-repeat';
        style.backgroundPosition = 'center';
        style.backgroundSize = 'contain';

        this.cover();
        this.addListeners();
        this.parent.appendChild(this.canvas);
    }

    cover() {
        this.scratched = false;     // 标识未被刮开
        let context = this.context;
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = 'grey';
        context.fillRect(0, 0, this.width, this.height);
        context.globalCompositeOperation = 'destination-out';

    }

    setPrizeImage(imgUrl) {
        this.canvas.style.backgroundImage = `url(${imgUrl})`;
        return this;
    }

    addListeners() {
        this.canvas.addEventListener('touchstart', this.scratchMobile, false);
        this.canvas.addEventListener('touchmove', this.scratchMobile, false);
        this.canvas.addEventListener('mousemove', this.scratchPc, false);
        this.canvas.addEventListener('touchend', this.check, false);
        this.canvas.addEventListener('touchcancel', this.check, false);
        this.canvas.addEventListener('mouseout', this.check, false);
    }

    scratchMobile(e) {
        let context = this.context,
            canvas = this.canvas,
            touch = e.changedTouches[0],
            radius = 30,
            x = touch.pageX - canvas.offsetLeft,
            y = touch.pageY - canvas.offsetTop;
        // console.log(x, y);
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = 'white';
        context.fill();
    }

    scratchPc(e) {
        let context = this.context,
            canvas = this.canvas,
            radius = 30,
            x = e.layerX,
            y = e.layerY;
        // console.log(x, y);
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.closePath();
        context.fillStyle = 'white';
        context.fill();
    }

    check() {
        if (this.scratched) {
            return;
        }

        let data = this.context.getImageData(0, 0, this.width, this.height).data,
            len = data.length,
            counter = 0;
        for (let i = 0; i < len; i += 4) {
            if ((data[i] + data[i + 1] + data[i + 2] + data[i + 3]) === 0) {
                counter++;
            }
        }
        if (counter / len * 4 > 0.5) {
            this.clear();
            this.scratched = true;
            setTimeout(() => {window.alert('中奖了！');}, 0);
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    transparentize() {
        let image = this.context.getImageData(0, 0, this.width, this.height);
        for (let i = 3, len = image.data.length; i <= len; i += 4) {
            image.data[i] = 0;
        }
        this.context.putImageData(image, 0, 0);
        console.log(image.data.length);
        console.log(image.data.slice(0, 10));
    }

    getImageData() {
        let data = this.context.getImageData(0, 0, this.width, this.height).data,
            customData = [];
        for (let i = 0, len = 40; i < len; i += 4) {
            customData.push(`(${data[i]}, ${data[i+1]}, ${data[i+2]}, ${data[i+3]})`);
        }
        return customData;
    }

    getPixelLength() {
        return this.context.getImageData(0, 0, this.width, this.height).data.length / 4;
    }
}

let scratchCard = new ScratchCard('#scratchCard');
scratchCard.setPrizeImage('./prize.jpg');
document.querySelector('#reset').addEventListener('click', () => {
    scratchCard.cover();
}, false);
document.querySelector('#trans').addEventListener('click', () => {
    scratchCard.transparentize();
}, false);
document.querySelector('#data').addEventListener('click', () => {
    console.log(scratchCard.getImageData());
}, false);
document.querySelector('#info').addEventListener('click', () => {
    document.querySelector('#msg').textContent = `width * height = ${scratchCard.width} * ${scratchCard.height} = ${scratchCard.width * scratchCard.height}, pixels: ${scratchCard.getPixelLength()}.`;
}, false);

class ScratchCard {
    constructor(parentSelector, imageUrl) {
        this.scratchMobile = this.scratchMobile.bind(this);
        this.scratchPc = this.scratchPc.bind(this);
        this.checkIfClear = this.checkIfClear.bind(this);
        this.clear = this.clear.bind(this);
        this.getImageData = this.getImageData.bind(this);

        this.parent = document.querySelector(parentSelector);
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        this.width = this.canvas.width = this.parent.clientWidth;
        this.height = this.canvas.height = this.parent.clientHeight;

        this.canvas.style.background = `url(${imageUrl}) no-repeat center`;
        this.canvas.style.backgroundSize = 'contain';

        this.cover();
        this.addListeners();
        this.parent.appendChild(this.canvas);
    }

    cover() {
        this.scratched = false;
        let context = this.context;
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = 'grey';
        context.fillRect(0, 0, this.width, this.height);
        context.globalCompositeOperation = 'destination-out';

    }

    addListeners() {
        this.canvas.addEventListener('touchstart', this.scratchMobile, false);
        this.canvas.addEventListener('touchmove', this.scratchMobile, false);
        this.canvas.addEventListener('mousemove', this.scratchPc, false);
        this.canvas.addEventListener('touchend', this.checkIfClear, false);
        this.canvas.addEventListener('touchcancel', this.checkIfClear, false);
        this.canvas.addEventListener('mouseout', this.checkIfClear, false);
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

    checkIfClear() {
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
            window.alert('中奖了！');
        }
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    getImageData() {
        let data = this.context.getImageData(0, 0, this.width, this.height).data,
            customData = [];
        for (let i = 0, len = 400; i < len; i += 4) {
            customData.push(`(${data[i]}, ${data[i+1]}, ${data[i+2]}, ${data[i+3]})`);
        }
        return customData;
    }
}

let scratchCard = new ScratchCard('#scratchCard', './prize.jpg');
document.querySelector('#reset').addEventListener('click', () => {
    scratchCard.cover();
}, false);
document.querySelector('#data').addEventListener('click', () => {
    console.log(scratchCard.getImageData());
}, false);

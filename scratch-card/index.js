class ScratchCard {
    constructor(parentSelector) {
        this.scratchMobile = this.scratchMobile.bind(this);
        this.scratchPC = this.scratchPC.bind(this);
        this.check = this.check.bind(this);
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

        this.scratched = true;     // 初始时未设置奖项，标识为已被刮开，从而忽略刮卡操作。
        this.cover().addListeners();
        this.parent.appendChild(this.canvas);
    }

    /* 覆盖刮刮卡，重置刮层 */
    cover() {
        let context = this.context;
        context.globalCompositeOperation = 'source-over';
        context.fillStyle = 'grey';
        context.fillRect(0, 0, this.width, this.height);
        // 刮开图层的重点 https://www.runoob.com/jsref/prop-canvas-globalcompositeoperation.html
        context.globalCompositeOperation = 'destination-out';
        return this;
    }

    /* 设置奖项图片 */
    setPrizeInfo(info) {
        this.canvas.style.backgroundImage = `url(${info.imgUrl})`;
        this.prizeMsg = info.msg;
        this.scratched = false;
        return this;
    }

    /* 监听挂卡操作 */
    addListeners() {
        this.canvas.addEventListener('touchstart', this.scratchMobile, false);
        this.canvas.addEventListener('touchmove', this.scratchMobile, false);
        this.canvas.addEventListener('mousemove', this.scratchPC, false);
        this.canvas.addEventListener('touchend', this.check, false);
        this.canvas.addEventListener('touchcancel', this.check, false);
        this.canvas.addEventListener('mouseout', this.check, false);
        return this;
    }

    /* 移动端刮卡 */
    scratchMobile(e) {
        if (this.scratched) {
            return;
        }

        let context = this.context,
            canvas = this.canvas,
            touch = e.changedTouches[0],
            radius = 30,
            x = touch.pageX - canvas.offsetLeft,
            y = touch.pageY - canvas.offsetTop;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }

    /* 桌面端刮卡 */
    scratchPC(e) {
        if (this.scratched) {
            return;
        }

        let context = this.context,
            radius = 30,
            x = e.layerX,
            y = e.layerY;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }

    /* 检查刮刮卡是否已被刮开了足够的区域，如果刮开了足够的区域，则认为刮刮卡已被刮开，清楚刮层，并执行后续相关操作 */
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
            setTimeout(() => {
                alert(`${this.prizeMsg} ${(new Date()).toLocaleString()}`);
            }, 17);
        }
    }

    /* 清除刮层 */
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }


    // 调试用工具方法
    /* 使刮层透明 */
    transparentize() {
        let image = this.context.getImageData(0, 0, this.width, this.height);
        for (let i = 3, len = image.data.length; i <= len; i += 4) {
            image.data[i] = 0;
        }
        this.context.putImageData(image, 0, 0);
        console.log(image.data.length);
        console.log(image.data.slice(0, 10));
    }

    /* 获取画布部分像素信息 */
    getImageData() {
        let data = this.context.getImageData(0, 0, this.width, this.height).data,
            customData = [];
        for (let i = 0, len = 40; i < len; i += 4) {
            customData.push(`(${data[i]}, ${data[i+1]}, ${data[i+2]}, ${data[i+3]})`);
        }
        return customData;
    }

    /* 获取画布绘图区域像素长度 */
    getPixelLength() {
        return this.context.getImageData(0, 0, this.width, this.height).data.length / 4;
    }
}

let getAPrize = function() {
    let prizes = [
        {
            imgUrl: './coupon.jpg',
            msg: '优惠券'
        },
        {
            imgUrl: './camera.png',
            msg: '单反'
        },
        {
            imgUrl: './watch.png',
            msg: '手表'
        }
    ];

    return () => {
        let random = Math.random()
        // 中奖概率在这调整
        switch (true) {
            case random < 0.01:
                return prizes[0];

            case random < 0.5:
                return prizes[1];

            default:
                return prizes[2];
        }
    }
}();

let scratchCard = new ScratchCard('#scratchCard').setPrizeInfo(getAPrize());

// 调试用操作
document.querySelector('#reset').addEventListener('click', () => {
    scratchCard.cover().setPrizeInfo(getAPrize());
}, false);
/* document.querySelector('#trans').addEventListener('click', () => {
    scratchCard.transparentize();
}, false);
document.querySelector('#data').addEventListener('click', () => {
    console.log(scratchCard.getImageData());
}, false);
document.querySelector('#info').addEventListener('click', () => {
    document.querySelector('#msg').textContent = `width * height = ${scratchCard.width} * ${scratchCard.height} = ${scratchCard.width * scratchCard.height}, pixels: ${scratchCard.getPixelLength()}.`;
}, false); */
